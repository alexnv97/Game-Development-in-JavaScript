


var game = function() {
	

///////////////////////////////Inicio Quintus/////////////////////////////////////////////////
	// Set up an instance of the Quintus engine and include
	// the Sprites, Scenes, Input and 2D module. The 2D module
	// includes the `TileLayer` class as well as the `2d` componet.
	var Q = Quintus({ 
		development: true,
		imagePath: "images/",
		audioPath: "audio/",
		audioSupported: [ 'mp3' ],
		dataPath: "data/"
		}).include("Sprites, Scenes, Input, 2D, Audio, Anim, Touch, UI, TMX").setup({
			width: 512, // Set the default width to 800 pixels
			height: 500, // Set the default height to 600 pixels
		//	downsampleWidth: 640, // Halve the pixel density if resolution
		//	downsampleHeight: 960 // is larger than or equal to 1024x768
		}).controls().touch().enableSound();

	

///////////////////////////////sprites//////////////////////////////////////////////	
	
	//CARGA DE DATOS

	Q.load(["megaman.png", "megaman.json", "fireman.png", "fireman.json", "bullet.png",
		"roomba.png", "roomba.json", "wheel.png", "wheel.json", "fireball.png", "fireball.json",
		"explosion.png", "explosion.json", "shark.png", "lives.png", "lives.json",
		"lava1.png", "lava1.json", "lava2.png", "lava2.json", "horizontalfire.png",
		"horizontalfire.json", "firebar.png", "firebar.json", "powerUpP.png", "powerUpG.png", 
		"powerUpG.json", "OneUp.png", "lanzallamas.png"], function() {

		Q.compileSheets("megaman.png", "megaman.json");
		Q.compileSheets("roomba.png", "roomba.json");
		Q.compileSheets("wheel.png", "wheel.json");
		Q.compileSheets("fireball.png", "fireball.json");
		Q.compileSheets("explosion.png", "explosion.json");
		Q.compileSheets("lives.png", "lives.json");
		Q.compileSheets("lava1.png", "lava1.json");
		Q.compileSheets("lava2.png", "lava2.json");
		Q.compileSheets("horizontalfire.png", "horizontalfire.json");
		Q.compileSheets("firebar.png", "firebar.json");
		Q.compileSheets("powerUpG.png", "powerUpG.json");

	});

	//Constantes
	const MAX_BULLETS = 3;

	//Variables globales
	var numBullets = 0;
	var health = 30;

	//SPRITE MEGAMAN
	Q.Sprite.extend("Megaman",{

		init: function(p) {
		    this._super(p, {
		      	sheet: "megaStill",
		      	sprite:  "megaman_anim",
		      	shooting: false,
		      	onLadder: false,
		      	gettingOff: false,
		    	jumpSpeed: -1000,
		    	exploding: false,
		    	speed: 200,
		    	type: Q.SPRITE_FRIENDLY

		    });

		    this.add('2d, platformerControls, animation, tween, Stats');
		    Q.input.on("fire", this, "shoot");
		    this.on("fired", this, "endShoot");
		    this.on("endHit", this, "endHit");
		    this.on("endClimb", this, "endClimb");
		    this.setStats(20, 0, false);
		},

		step: function(dt) {
			this.stage.x = this.p.x;
			this.stage.y = this.p.y;
			Q.state.set({ health: this.health});
			if(this.p.onLadder) this.p.vx = 0; // Cuando está en escalera no se puede mover horizontalmente
			if(this.p.y > 1110) this.stage.centerOn(this.p.x,1350);
			else if(this.p.y > 656) this.stage.centerOn(this.p.x,900);
			else this.stage.centerOn(this.p.x,450);

			if (!this.p.exploding && !this.invencible && !this.p.gettingOff){
				if(this.p.direction == "left")
					this.p.flip = "x";
				else
					this.p.flip = "";
				// Comportamiento cuando está subido a una escalera
				if(this.p.onLadder && !this.p.shooting) {
			      	this.p.gravity = 0;
				    if(Q.inputs['up']) {
				        this.p.vy = -100;
				        this.play("climb");
				    } 
				    else if(Q.inputs['down']) {
				    	if(this.p.landed < 0){
				        	this.p.vy = 100;
				        	this.play("climb");
				        }
				        else{
				        	this.p.gravity = 1;
							this.p.onLadder = false;
				        }
				    }
				    else if(Q.inputs['left'] || Q.inputs['right']){
				    	this.p.vy = 0;
				        this.play("shoot_ladder_right");
				    }
				    else{
				        this.p.vy = 0;
				        this.play("stand_ladder");
				    }
			    }
			    // Comportamiento cuando NO está subido a una escalera
			    else{
			    	if(!this.p.shooting){
						if(this.p.landed < 0){
							this.play("jump_right");
						}
						else{
					  		if (this.p.vx != 0)
					  			this.play("run_right");
					  	else
					  		this.play("stand_right");
						}
					}
				}
			}
		},

		shoot: function(){
			if(!this.p.exploding && !this.invencible && !this.p.gettingOff){
				this.p.shooting = true;
				if(this.p.onLadder){
					this.play("shoot_ladder_right");
				}
				else if (this.p.landed < 0)
					this.play("shoot_jump_right");
				else if (this.p.vx != 0)
					this.play("shoot_run_right");
				else{
					this.play("shoot_still_right");
				}
				if(numBullets < MAX_BULLETS){
					if(this.p.direction == "right")
						this.stage.insert(new Q.Bullet({x:this.p.x + 30, y:this.p.y, vx:330}));
					else
						this.stage.insert(new Q.Bullet({x:this.p.x - 30, y:this.p.y, vx:-330}));
				}
			}
		},

		endShoot: function(){
			this.p.shooting = false;
		},

		explode: function(){
			if(!this.invencible){
				this.setInv(true);
				if(this.p.direction == "left")
					//this.p.vx = 100;
					this.animate({x: this.p.x+20}, 0.4, Q.Easing.Linear, {callback: this.nowDown});
				else
					//this.p.vx = -100;
					this.animate({x: this.p.x-20}, 0.4, Q.Easing.Linear, {callback: this.nowDown});
				this.p.exploding = true;
				this.p.sprite = "megamanHit_anim";
				this.sheet("megaDie",true);
				this.play("megaHit");

				//Cambiamos el atributo shooting a false en el caso de que estemos explotando mientras estamos disparando
				if(this.p.shooting){
					this.p.shooting = false;
				}
			}
		},

		getOffLadder: function(){
			this.p.gettingOff = true;
			if(!this.p.exploding){
				this.play("end_climb");
			}
		},

		endClimb: function(){
			this.p.gettingOff = false;
			this.p.gravity = 1;
			if((Q.inputs['up']))
				this.p.vy -=400;
			this.p.onLadder = false;
		},

		endHit: function(){
			if (this.p.onLadder){
				this.p.gettingOff = false;
				this.p.gravity = 1;
				this.p.onLadder = false;
			}
			this.sheet("megaStill", true);
			this.p.sprite = "megaman_anim";
			this.p.exploding = false;
			this.setInv(false);
		},

		endInv: function(){
			this.setInv(false);
		},

		Dead: function(){
			this.destroy();
		},

		extralife: function(){

		}

	
	});

	//Sobreescribimos el metodo para generar la mascara de colision para que la haga mas pequeña en el Megaman
	Q._generatePoints = function(obj,force) {
	    if(obj.p.points && !force) { return; }
	    
	    if (obj.p.type == Q.SPRITE_FRIENDLY){
	    	var p = obj.p,
	    	halfW = p.w/2-20;
	    	halfH = p.h/2;
	    }
	    else{
	    	var p = obj.p,
	        halfW = p.w/2,
	        halfH = p.h/2;
	    }
	    p.points = [
	      [ -halfW, -halfH ],
	      [  halfW, -halfH ],
	      [  halfW,  halfH ],
	      [ -halfW,  halfH ]
	      ];
  	};

	//SPRITE STAIRS 
	Q.Sprite.extend("Stairs",{
		init: function(p) {
		    this._super(p, {
		    	asset: "Stairs.png",
		    	sensor: true
		    });
		    this.on("hit", this, "collide");
		},
	
		collide: function(collision){
			if(collision.obj.isA("Megaman") && !collision.obj.p.shooting && !collision.obj.p.gettingOff 
				&& (((Q.inputs['up'])) || 
					(collision.obj.p.landed < 0 && (Q.inputs['down'])))) {
				collision.obj.p.onLadder = true;
				collision.obj.p.x = this.p.x;
			}
		}
	});

	//SPRITE LAVA 
	Q.Sprite.extend("Lava",{

		//Este sprite representa la parte de arriba de la lava, y actua como sensor, si megaman la toca, muere

		init: function(p) {

		    this._super(p, {
		    	sensor: true,
		    	sheet: "lava1",
		    	sprite: "lava_anim",
		    	collisionMask: Q.SPRITE_ALL
		    });
		    this.add("animation");
		    this.on("hit.sprite",function(collision) {

				if(collision.obj.isA("Megaman")) {
					collision.obj.Dead();
				}
			});
		},

		step: function(dt){
			this.play("move");
		}
	});

	//Sprite de lava sin colision (lava de abajo)
	Q.Sprite.extend("Lava2",{

		init: function(p) {

		    this._super(p, {
		    	sheet: "lava2",
		    	sprite: "lava_anim"
		    });
		    this.add("animation");
		},

		step: function(dt){
			this.play("move");
		}
	});

	//Barras de fuego horizontales
	Q.Sprite.extend("HorizontalFlame",{

		init: function(p) {

		    this._super(p, {
		    	sensor: true,
		    	sheet: "fireBar",
		    	sprite: "fireBar_anim",
		    	activated: false,
		    	time: 0,
		    	little: true
		    });
		    this.add("animation");
		    this.on("hit.sprite",function(collision) {

				if(collision.obj.isA("Megaman")) {
					collision.obj.explode();
				}
			});
		},

		step: function(dt){

			if (this.p.activated){

				//Para recolocar los sprites necesitamos saber si es fuego pequeño o grande
				if(!this.p.little){
					this.p.x += 56;
					this.p.little = true;
				}
				this.p.sprite = "fireH_anim";
				this.sheet("horizontalFire", true);
				this.play("flameH");

				this.p.time += dt;

				if (this.p.time > 4){ this.p.activated = false; this.p.time = 0;}

			}
			else{
				if (this.p.little){
					this.p.x -= 56;
					this.p.little = false;
				}
				this.p.sprite = "fireBar_anim";
				this.sheet("fireBar", true);
				this.play("miniFlame");
				this.p.time += dt;
				var random_number = Math.floor(Math.random()*10) + 1;
				if (random_number <= 2 && this.p.time > 3){
					this.p.activated = true;
					this.p.time = 0;
				}
			}
		}
	});

	//SPRITE LANZALLAMAS
	Q.Sprite.extend("lanzaLlamas",{

		init: function(p) {

		    this._super(p, {
		    	asset: "lanzallamas.png",

		    });
		    this.add("2d, animation, barraFuego");
		}
	});

	//SPRITE TILECHECKER 
	Q.Sprite.extend("TileChecker",{
		/*
		Este sprite va a valer para que el Roomba no se vaya de donde tiene que estar y tambien estan colocados en las partes de 
		arriba y abajo de las escaleras.
		*/
	 
		init: function(p) {

		    this._super(p, {
		    	sensor: true,
		    	asset: "Stairs.png",
		    	w: 32,
		    	h: 32
		    });
		 this.on("hit", this, "collide");
		},

		collide: function(collision){
			if(collision.obj.isA("Megaman") && collision.obj.p.onLadder) {
				collision.obj.getOffLadder();
			}
		}
	
	});


	//Balas Megaman
	Q.Sprite.extend("Bullet", {
		init: function(p) {

			this._super(p, {
				sensor: true,
				asset: "bullet.png",
				vx: 330,
				gravity: 0,
				exploding:false,
				collisionMask: Q.SPRITE_ENEMY
			});
			this.add("2d, animation, Stats");
			this.on("exploded", this, "destroy");	//una vez mostrada la animacion se destruye la bala
			this.setStats(100, 1, true);
			numBullets +=1;

		},

		step: function(dt){
			if(!this.p.exploding && (this.p.vx == 0 || this.p.x > this.stage.x+250 || this.p.x < this.stage.x - 250)){
				this.destroy();
				numBullets -=1;
			}
			if(this.p.exploding){
				this.p.vx = 0;
			}
		},

		explode: function(){
			this.alive = false;
			this.p.exploding = true;
			this.p.sprite = "explosion_anim";
			this.sheet("enemiesExplosion",true);
			this.play("explode");
			numBullets -= 1;
		},

		Dead: function(){

			
		}
	});

	//Balas wheel
	Q.Sprite.extend("WheelBullet", {

		init: function(p){

			this._super(p, {
				sensor: true,
				sheet: "bulletWheel",
				gravity:0,
				time: 0,
				exploding:false,
				collisionMask: Q.SPRITE_FRIENDLY
			});
			this.add('2d, animation, Stats');
		    this.setStats(100, 2, true);
		    this.on("hit", function(collision){
		    	if(collision.obj.isA("Megaman")) {
					collision.obj.HITTED(this.power);
					collision.obj.explode();
					this.alive = false;
					this.destroy();
		    	}
		    });

		},

		step: function(dt){
			this.p.time += dt;
			if (this.p.exploding){
				this.p.vx = 0; this.p.vy = 0;
			}
		},

		ead: function(){

			
		}
	});


	//SPRITE BOTIQUINP
	Q.Sprite.extend("BotiquinP",{

	 
		init: function(p) {

			this.taken = false;
		 
		    this._super(p, {
		    	asset: "powerUpP.png",
		    	sensor: true
		    });

		    this.add('2d');

		    this.on("hit.sprite",function(collision) {


				if(collision.obj.isA("Megaman")) {
					if(!this.taken){
						this.taken = true;
						collision.obj.RECOVER(2);
						this.destroy();
					}
				}
			});

		}

	
	});

	//SPRITE BOTIQUING
	Q.Sprite.extend("BotiquinG",{

	 
		init: function(p) {

			this.taken = false;
		 
		    this._super(p, {
		    	
		    	sheet: "powerUp",
		    	sprite: "powerUp_Anim",
		    	sensor: true
		    });

		    this.add('2d, animation');

		    this.on("hit.sprite",function(collision) {


				if(collision.obj.isA("Megaman")) {
					if(!this.taken){
						this.taken = true;
						collision.obj.RECOVER(5);
						this.destroy();
					}
				}
			});

		},

		step: function(dt){

			this.play('still');

		}

	
	});

	//SPRITE ONEUP
	Q.Sprite.extend("OneUp",{

	 
		init: function(p) {

			this.taken = false;
		 
		    this._super(p, {
		    	asset: "OneUp.png",
		    	sensor: true
		    });

		    this.add('2d');

		    this.on("hit.sprite",function(collision) {


				if(collision.obj.isA("Megaman")) {
					if(!this.taken){
						this.taken = true;
						//Se añade una vida mas
						this.destroy();
					}
				}
			});
		}
	});


	//SPRITE ROOMBA
	Q.Sprite.extend("Roomba",{

	 
		init: function(p) {

		 
		    this._super(p, {
		    	readyToChange: true,
		    	type: Q.SPRITE_ALL,
		    	sheet: "rotationRoomba",
		    	sprite: "armadilloAnim",
		    	vx: 100,
		    	direction: "right",
		    	h: 16
		    });
		    this.on("hit",function(collision){
		      	if(collision.obj.isA("TileChecker") && this.p.readyToChange){
		      		 if(this.p.direction == "left")
		      		 	this.p.direction = "right";
		      		 else
		      		 	this.p.direction = "left";
		      		 this.p.vx = -this.p.vx;
		      		 readyToChange = false;
		      	}

		    });
				
		    this.add('2d, animation, DefaultEnemy, Stats');
			
			this.setStats(10, 2, true);
		},


		step: function(dt) {

			if(this.alive){
				if(this.stage.y >= this.p.py -16 && this.stage.y <= this.p.py +16 && this.p.direction == "left"){
					this.vx = -300;
					this.play("fast");
				}
				else if(this.stage.y >= this.p.py -16 && this.stage.y <= this.p.py +16 && this.p.direction == "right"){
					this.vx = -300;
					this.play("fast");
				}
				else if(this.p.direction == "left"){
					this.vx = -100;
					this.play("slow");
				}
				else if(this.p.direction == "right"){
					this.vx = 100;
					this.play("slow");
				}
				this.p.readyToChange = true;
			}
		},
		// Listen for a sprite collision, if it's the player,
		// end the game unless the enemy is hit on top
	
	});


	Q.Sprite.extend("Wheel", {
		init: function(p){

			this._super(p, {
				type: Q.SPRITE_ALL,
				sensor: true,
				sprite: "wheel_anim",
				sheet: "wheelDown",
				time: 0,
				activated: false,	//si esta activado, esta arriba
				up: false,
				shoot: true,		//indica si esta preparado para disparar o no
				shoots: 0			//numero de disparos dado
			});

			this.add('animation, DefaultEnemy, Stats');

			this.setStats(4, 2, false);

			},

		step: function(dt){
			if(this.p.activated){

				if(!this.p.up) {this.p.y -= 9; this.p.up = true;}
				this.p.sprite = "wheel_anim";
				this.sheet("wheelUp", true);
				this.play("spin");

				if (this.p.x - 250 < this.stage.x && this.p.x + 250 >= this.stage.x){
					this.p.time +=dt;
					if (this.p.time >= 2 && this.p.shoots < 2){this.p.shoot = true;}
					if (this.p.shoots < 2 && this.p.shoot){
						++this.p.shoots;
						this.p.shoot = false;
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 150}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -150}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 150, vy: -150}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -150, vy: -150}))
						this.stage.insert(new Q.WheelBullet({x: this.p.x, y: this.p.y-20, vy: -150}));
					}
					if (this.p.time >= 3){
						this.p.activated = false;
						this.p.time = 0;
						this.p.shoot = true;
						this.p.shoots = 0;
					}
				}
				
				else {
					this.p.activated = false;
					this.p.time = 0;
					this.p.shoot = true;
					this.p.shoots = 0;

				}
			}
			else{

				if(this.p.up) {this.p.y += 9; this.p.up = false;}
				this.p.sprite = "wheel_down";
				this.sheet("wheelDown", true);
				this.play("down");
				this.p.time += dt;
				if (this.p.time <= 1){
					this.p.sprite = "wheel_down";
					this.sheet("wheelDown", true);
					this.play("down");
				}
				else{
					this.p.time = 0;
					var random_number = Math.floor(Math.random()*10) + 1;
					if (random_number <= 5 || (this.p.x - 250 < this.stage.x && this.p.x + 250 >= this.stage.x)){
						this.p.activated = true;
					}
				}
				
			}
		},

		Dead: function(){
			this.dropItem();
			this.destroy();
		}	

	});

	Q.Sprite.extend("Shark", {
		init: function(p){
			this._super(p, {
				type: Q.SPRITE_ALL,
				asset: "shark.png",
				vx: -60,
				tick: 100,
				sensor: true,
				collisionMask: Q.SPRITE_NONE

			});
			this.add('2d,animation, DefaultEnemy, Stats');
			this.setStats(4, 2, false);
			},

			step: function(dt){
				++this.p.tick;
				this.p.vy = 150 * Math.sin(this.p.tick * 0.1);
			}
	});

	Q.Sprite.extend("FireBall", {
		init: function(p){
			this._super(p, {
			type: Q.SPRITE_ALL,
			sprite: "fireball_anim",
			sheet: "fireBall",
			sensor: true,
			gravity:0
		});
			this.add('animation, DefaultEnemy, Stats');
			this.on("hit",this,"collide")
			this.setStats(4, 2, false);
		},

		step: function(dt){
			this.play("fly");
			this.p.y += 0.8;
			if (this.p.x > this.stage.x)
				this.p.x -= 0.8;
			else
				this.p.x += 0.8;
			if (this.p.y > this.stage.y + 250)
				this.destroy();
		},

		collide: function(collision){
			if(collision.obj.isA("Megaman")) {

		    		this.destroy();
		    	}
		}
	});

////////////////////////////////////COMPONENTES////////////////////////////////////////////////////
	//COMPONENTE ENEMIGOS
	Q.component("DefaultEnemy", {
		
		added: function(){

			this.entity.on("hit", function(collision){
				if(collision.obj.isA("Megaman")) {
		    		collision.obj.HITTED(this.power);
					collision.obj.explode();
		    	}
		    	if(collision.obj.isA("Bullet") && !collision.obj.p.exploding) {
					this.HITTED(collision.obj.power);
					collision.obj.explode();
		    	}

			});


		},

		extend: {
			dropItem: function(){
				//Esta funcion se encarga del dropeo de los objetos, ha de llamarse cuando un enemigo muere antes del destroy()

				chance = Math.floor((Math.random() * 30) + 1);
				if(chance == 1){
					//Aparece un oneUp
					this.stage.insert(new Q.OneUp({x:this.p.x, y:this.p.y}));
				}
				else if(chance > 1 && chance < 4){
					//Aparece un botiquin grande
					this.stage.insert(new Q.BotiquinG({x:this.p.x, y:this.p.y}));
				}
				else if(chance >= 4 && chance < 10){
					//Aparece un botiquin pequeño
					this.stage.insert(new Q.BotiquinP({x:this.p.x, y:this.p.y}));

				}

			}
			/*DEAD: function() {

			},

			die: function(){

			}*/
		}

	});

	Q.component("Stats", {

		added: function(){

			this.entity.OHealth = 0;
			this.entity.alive = true;
			this.entity.health = 0;
			this.entity.power = 0;
			this.entity.invencible = true;

		},

		extend: {

			HITTED: function(enemyPower){

				if(this.alive){
					if(!this.invencible)
						this.health -= enemyPower;

					if(this.health <= 0)
						this.DIE();
				}

			},

			DIE: function(){

				this.alive = false;
				this.Dead();

			},

			RECOVER: function(healthRecovery){

				this.health += healtRecovery;

			},

			setStats: function(health, power, inv){
				this.invencible = inv;
				this.health = health;
				this.OHealth = health;
				this.power = power;

			},

			setInv: function(inv){
				this.invencible = inv;
			},

			RECOVER: function(amount){
				if(this.health + amount <= this.OHealth)
					this.health += amount;
				else
					this.health = this.OHealth;

			}
		}

	});

	/*
	Creo que esto al final se va a descartar
	//Componente aiBounce modificado para el Roomba
	  Q.component('aiBounce2', {
	    added: function() {
	      this.entity.on("bump.right",function(collision){
	      	if(collision.obj.isA("TileChecker"))
	      		this.goRight();

	      });
	      this.entity.on("bump.left",function(collision){
	      	if(collision.obj.isA("TileChecker"))
	      		this.goLeft();
	      });
	    },

	    goLeft: function() {
	      this.entity.p.vx = -col.impact;
	      if(this.entity.p.defaultDirection === 'right') {
	          this.entity.p.flip = 'x';
	      }
	      else {
	          this.entity.p.flip = false;
	      }
	    },

	    goRight: function(col) {
	      this.entity.p.vx = col.impact;
	      if(this.entity.p.defaultDirection === 'left') {
	          this.entity.p.flip = 'x';
	      }
	      else {
	          this.entity.p.flip = false;
	      }
	    }
	  });
	*/		

////////////////////////////////////ANIMACIONES/////////////////////////////////////////////////////
	
	//Animaciones Mario
	Q.animations('megaman_anim', {
		run_right: { frames: [3,4,5], rate: 1/4}, 
		jump_right: { frames: [6], rate: 1/2},
		shoot_still_right: { frames: [10], rate: 1/2, loop: false, trigger: "fired" },
		shoot_run_right: { frames: [11,12,13], rate: 1/2, loop: false, trigger: "fired" },
		shoot_jump_right: { frames: [14], rate: 1/2, loop: false, trigger: "fired" },
		shoot_ladder_right: { frames: [15], rate: 1/2, loop: false, trigger: "fired" },
		stand_ladder: {frames: [7], rate: 1/2 },
		climb: {frames: [7,8], rate: 1/3 },
		end_climb: {frames: [9], rate: 1/3, loop: false, trigger: "endClimb"},
		stand_right: { frames: [0,1], rate: 1/2, loop: true},
		//fall_right: { frames: [], loop: false },
		//die: {frames: [16,17], loop: true}
	});

	Q.animations('wheel_anim',{
		spin: { frames: [0,1,2], rate: 1/2, loop: false}
	});

	Q.animations('wheel_down',{
		down: {frames: [0],loop: true}
	});

	Q.animations('fireball_anim',{
		fly: {frames: [0,1], rate: 1/2, loop: true}
	});

	Q.animations('explosion_anim', {
		explode: {frames: [0,1,2], rate: 1/5, loop:false, trigger:'exploded'}
	});

	Q.animations('megamanHit_anim',{
		megaHit: {frames: [0,1,0,1], rate: 1/4, loop: false, trigger:"endHit"}
	});

	Q.animations('armadilloAnim',{
		slow: {frames: [0,1], rate:1/2},
		fast: {frames: [0,1], rate:1/4}
	});

	Q.animations('lava_anim',{
		move: {frames: [0,1,2], rate: 1/2, loop: true}
	});

	Q.animations('fireBar_anim',{
		miniFlame: {frames: [0,1], rate: 1/2}
	});

	Q.animations('fireH_anim', {
		flameH: {frames: [0,1], rate: 1/5}
	});

	Q.animations('powerUp_Anim', {
		still: {frames: [0,1], rate: 1/3}
	});

///////////////////////////////////AUDIOS///////////////////////////////////////////////////////////
	//CARGA DE AUDIOS
	Q.load([], function(){

	});
///////////////////////////////////CARGA NIVELES////////////////////////////////////////////////////

	//INICIALIZACION
	Q.loadTMX("FiremanStage.tmx", function() {
		Q.state.reset({ health: 20});
		Q.stageScene("level1");
		Q.stageScene("HUD",1);
		//Q.stageScene("level1");
	});


	//NIVEL 1
	Q.scene("level1", function(stage) {

		Q.stageTMX("FiremanStage.tmx",stage);
		this.height = 10000;
		this.width = 10000;
		var x, y;

		//Q.audio.play('music_main.mp3',{ loop: true });
		var player = stage.insert(new Q.Megaman({x:120, y:1500}));
		stage.add("viewport").follow(Q("Megaman").first(), { x: true, y:false });
		/*
		stage.insert(new Q.Wheel({x:272, y:1408}));
		stage.insert(new Q.Wheel({x:272, y:1280}));
		stage.insert(new Q.Wheel({x:512, y:1280}));
		stage.insert(new Q.Wheel({x:912, y:1280}));
		stage.insert(new Q.Wheel({x:752, y:1408}));
		stage.insert(new Q.FireBall({x:290, y:1300}));
		stage.insert(new Q.Shark({x:500, y:1400}));
		*/
		stage.centerOn(120,1350);
	});

	//TITULO DEL JUEGO
	Q.scene("mainTitle", function(stage){
		
	});

	//GAME OVER
	Q.scene('endGame',function(stage) {


	});

	//HUD
   Q.scene("HUD", function(stage) {
		var container = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0)" 
		}));
		stage.insert(new Q.Lives(),container);
	});

/////////////////////////////////PARTES DEL HUD////////////////////////////////////////////////
    //SCORE
    Q.UI.Text.extend("SCORE", {
        init: function(p) {
            this._super(p, {
                label: "SCORE: " + Q.state.get("score"),
                    color: "white",
                    size: "14"
                });
            /** Necesito extender porque quiero escuchar los cambios de la variable en el "State". */
            Q.state.on("change.score", this, "update_label");
        },
 
        /**
        * Con esta función actualizo el label.
        */
        update_label: function(score) {
            this.p.label = "SCORE: " +  Q.state.get("score");
        }
    });

    //LIVES
    Q.Sprite.extend("Lives", {
        init: function(p) {
            this._super(p, {
                y: 90-Q.height/2,
      			x: 30-Q.width/2,
      			scale:0.3,
      			sheet: "20lives"
                });
        },

        step: function(dt){
        	this.sheet(Q.state.get("health") + "lives" ,true);
        },
    });


////////////////////////////////BUCLE PRINCIPAL//////////////////////////////////////////////



}

