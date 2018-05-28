


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
			upsampleWidth: 256,  // Double the pixel density of the 
  			upsampleHeight: 250,
			downsampleWidth: 1024, // Halve the pixel density if resolution
			downsampleHeight: 1000, // is larger than or equal to 1024x768
			scaleToFit: true,
			maximize: true
		}).controls().touch().enableSound();

	

///////////////////////////////sprites//////////////////////////////////////////////	
	
	//CARGA DE DATOS

	Q.load(["megaman.png", "megaman.json", "fireman.png", "fireman.json", "bullet.png",
		"roomba.png", "roomba.json", "wheel.png", "wheel.json", "fireball.png", "fireball.json",
		"explosion.png", "explosion.json", "shark.png", "lives.png", "lives.json",
		"lava1.png", "lava1.json", "lava2.png", "lava2.json", "horizontalfire.png",
		"horizontalfire.json", "firebar.png", "firebar.json", "powerUpP.png", "powerUpG.png", 
		"powerUpG.json", "OneUp.png", "lanzallamas.png", "title-screen.png",
		"title-screen-noletters.png", "endingItem.png", "endingItem.json",
		"megaExplosion.png", "megaExplosion.json", "invertedWheel.png", "invertedWheel.json",
		"falling.png", "falling.json", "verticalfire.png", "verticalfire.json", "blackTile.png",
		"1up.mp3", "disparo.mp3", "ending.mp3", "endingItemJingle.mp3", "enemyDamage.mp3", "enemyShoot.mp3", "EnergyFill.mp3",
		"epicDoors.mp3", "megamanDamage.mp3", "megamanDeath.mp3", "pressStart.mp3", "fireMan.mp3", "entraMegaman.mp3", "megaJump.mp3"],
		 function() {


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
		Q.compileSheets("endingItem.png", "endingItem.json");
		Q.compileSheets("megaExplosion.png", "megaExplosion.json");
		Q.compileSheets("invertedWheel.png", "invertedWheel.json");
		Q.compileSheets("falling.png", "falling.json");
		Q.compileSheets("verticalfire.png", "verticalfire.json");
		//INICIALIZACION TMX
		Q.loadTMX(["FiremanStage.tmx", "credits.tmx"], function() {
			Q.state.reset({ health: 20, lives: 3});
			Q.stageScene("mainTitle");
			//Q.stageScene("level1");
		});


	});



	//Constantes
	const MAX_BULLETS = 3;

	//Variables globales
	var numBullets = 0;
	var health = 30;

	//SPRITE MEGAMAN
	Q.Sprite.extend("Megaman",{
		init: function(p) {

			playedEntered = false;

		    this._super(p, {
		      	sheet: "falling",
		      	sprite:  "fall_anim",
		      	shooting: false,
		      	onLadder: false,
		      	gettingOff: false,
		    	jumpSpeed: -450,
		    	exploding: false,
		    	speed: 150,
		    	entering:true,
		    	type: Q.SPRITE_FRIENDLY

		    });

		    this.add('2d,animation, tween, Stats');
		    Q.input.on("fire", this, "shoot");
		    this.on("fired", this, "endShoot");
		    this.on("endHit", this, "endHit");
		    this.on("endClimb", this, "endClimb");
		    this.on("ready", this, "readyToPlay");
		    this.setStats(20, 0, false);
		},

		step: function(dt) {
			if (this.p.entering){ //Megaman entra en el nivel
				if(this.p.y < 1500){
					this.p.collisionMask = Q.SPRITE_NONE;
					this.play("fall");
				}
				else{
					if(!this.playedEntered){
						this.playedEntered = true;
						Q.audio.play("entraMegaman.mp3");
					}
					this.p.y = 1500;
					this.p.vy = 0;
					this.play("up");
					this.p.collisionMask = Q.SPRITE_ALL;
				}

			}
			else{ //Megaman ya ha entrado en el nivel
				if(!Q.state.get("checkPoint") && this.p.x > 2190 && this.p.y > 1150)
					Q.state.set({ checkPoint: true});
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
					    else if(Q.inputs['action']){
					    	this.playedLanding = false;
					    	this.p.onLadder = false;
					    	this.p.gravity = 1;
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
								this.playedLanding = false;
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
			}
		},

		shoot: function(){
			if(!this.p.exploding && !this.invencible && !this.p.gettingOff && !this.p.entering){
				
				this.p.shooting = true;
				if(this.p.onLadder){
					this.play("shoot_ladder_right");
				}
				else if (this.p.landed < 0){
					this.playedLanding = false;
					this.play("shoot_jump_right");
				}
				else if (this.p.vx != 0){
					this.playedLanding = false;
					this.play("shoot_run_right");
				}
				else{
					this.play("shoot_still_right");
				}
				if(numBullets < MAX_BULLETS){
					Q.audio.play("disparo.mp3");
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
				Q.audio.play("megamanDamage.mp3");
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
			this.playedLanding = false;
			this.p.gettingOff = false;
			if((Q.inputs['up'])){
				console.log("jump");
				this.p.vy -=270;
			}
			this.p.gravity = 1;
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
			Q.audio.stop();
			Q.audio.play("megamanDeath.mp3");
			Q.state.set({ health: this.health = 0});
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vx: 100, vy: -100}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vx: -100, vy: -100}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vx: -100, vy: 100}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vx: 100, vy: 100}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vx: 100}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vy: -100}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vx: -100}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vy: 100}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vx: 150}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vy: -150}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vx: -150}));
			this.stage.insert(new Q.MegamanExplosion({x: this.p.x, y: this.p.y, vy: 150}));
			this.quitLife();
			
		},

		//Funcion para disminuir vidas
		quitLife: function(){
			this.destroy(); //Destruimos el megaman
			Q.state.dec("lives", 1);
		},

		extralife: function(){
			Q.state.inc("lives",1);
		},

		readyToPlay: function(){
			this.p.entering = false;
			this.add("platformerControlsMegaman");
			this.sheet("megaStill", true);
			this.p.sprite = "megaman_anim";
		}

	
	});
	
	Q.Sprite.extend("MegamanExplosion", {
		init: function(p){
			this._super(p, {
				sprite: "megaDie_anim",
				sheet:"megaExplode",
				gravity:0,
				time: 0,
				collisionMask: Q.SPRITE_NONE
			});
			this.add('2d,animation');
			this.on("endExplode", this, "end")
		},

		step: function(dt){
			this.p.time += dt;
			this.play("mega_die");
			//if (this.p.time >= 1.5){this.destroy();}
		},
		end: function(){
			if(this.p.time >= 2.5){
				if (Q.state.get("lives") == 0){
					Q.clearStages();
					Q.stageScene("mainTitle");
				}
				else{
					Q.clearStages();
					Q.stageScene("level1");
					Q.stageScene("HUD",1);
				}
			}
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
	    else if (obj.p.type == Q.SPRITE_ACTIVE){
	    	var p = obj.p,
	    	halfW = p.w/2-5;
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

	//SPRITE WALKINGMEGAMAN (El que se usa para los creditos)
	Q.Sprite.extend("WalkingMegaman",{
		init: function(p) {
		    this._super(p, {
		      	sheet: "megaStill",
		      	sprite:  "megaman_anim",
		      	inTheAir: false,
		    	speed: 200,
		    	walking: 0

		    });

		    this.add('animation, tween');
		    this.animate({x: this.p.x}, 2, {callback: this.walk})

		},

		step: function(dt) {
			
			if(this.p.walking == 0){
				this.play("stand_right");
				this.p.flip = "x";

			}
			else if(this.p.walking == 1){
				this.play("run_right");
				this.p.flip = "x";
			}
			else{
				this.play("jump_right");
				this.p.flip = "x";
			}
			
		},

		walk: function(){
			this.p.walking = 1;
			this.animate({x: this.p.x-2115}, 21, Q.Easing.Linear, {callback: this.jump});
		},

		jump: function(){
			this.p.walking = 2;
			this.animate({y: this.p.y-130}, 3/2, Q.Easing.Quadratic.Out);
		}

		

	
	});
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
////////////////////////////////////SPRITES DEL ESCENARIO/////////////////////////////////////////////////
	//SPRITE LAVA 
	Q.Sprite.extend("Lava",{

		//Este sprite representa la parte de arriba de la lava, y actua como sensor, si megaman la toca, muere

		init: function(p) {

		    this._super(p, {
		    	sensor: true,
		    	sheet: "lava1",
		    	sprite: "lava_anim",
		    	collisionMask: Q.SPRITE_ALL,
		    	dado: false
		    });
		    this.add("animation");
		    this.on("hit.sprite",function(collision) {

				if(collision.obj.isA("Megaman") && !this.p.dado) {
					collision.obj.Dead();
					this.p.dado = true; /*como puede colisionar con varias lavas a la vez, 
										si ya ha colisionado con una, con el resto que no lo haga*/
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
		    this.add("Stats, animation");
		    this.on("hit.sprite",function(collision) {

				if(collision.obj.isA("Megaman") && this.p.activated) {
					collision.obj.HITTED(this.power);
					collision.obj.explode();
				}
			});

			this.setStats(100, 3, true);
			
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

	//Barras de fuego verticales
	Q.Sprite.extend("barraFuego",{

		init: function(p) {

			this.hidden = false;

		    this._super(p, {
		    	type: Q.SPRITE_ACTIVE,
		    	layerIndex: -1,
		    	sensor: true,
		    	sheet: "verticalFire",
		    	sprite: "verticalFire_Anim",
		    	z: -100

		    });

		    this.add("Stats, animation, tween");
		    this.on("hit.sprite",function(collision) {
				if(collision.obj.isA("Megaman") && !this.hidden) {
					collision.obj.HITTED(this.power);
					collision.obj.explode();
				}
				if(collision.obj.isA("Bullet") && !collision.obj.p.exploding && !this.hidden) {
					//Las balas desaparecen al chocar contra estas como en el juego original
					collision.obj.destroy();
					if(numBullets > 0)
						numBullets -= 1;
		    	}
			});


			this.setStats(100, 2, true);
			
			this.animate({y: this.p.y - 75}, 1, {callback: this.wait4Down})
		},

		wait4Up: function(){
			this.animate({y: this.p.y}, 1, {callback: this.up});
		},

		wait4Down: function(){
			this.animate({y: this.p.y}, 1, {callback: this.down});
		},

		down: function(){
			this.animate({y: this.p.y + 128}, 1, {callback: this.wait4Up});
		},

		up: function(){
			this.animate({y: this.p.y - 128}, 1, {callback: this.wait4Down});
		},

		step: function(dt){
			this.play("still");
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

	//SPRITE BlACK 
	Q.Sprite.extend("Black",{
		/*
		Se usa para que la barra de fuego no se vea donde no nos interesa
		*/
	 
		init: function(p) {

		    this._super(p, {
		    	collisionMask: Q.SPRITE_ACTIVE,
		    	sensor: true,
		    	asset: "blackTile.png",
		    	w: 32,
		    	h: 32
		    });
		}


	
	});

////////////////////////////////////////////BALAS////////////////////////////////////////////////////////////////
	//Balas Megaman
	Q.Sprite.extend("Bullet", {
		init: function(p) {

			this._super(p, {
				sensor: true,
				asset: "bullet.png",
				vx: 500,
				gravity: 0,
				exploding:false,
				collisionMask: Q.SPRITE_ENEMY && Q.SPRITE_ACTIVE
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

			if(numBullets < 0)
				numBullets = 0;
		},

		explode: function(){
			this.alive = false;
			this.p.exploding = true;
			this.p.sprite = "explosion_anim";
			this.sheet("enemiesExplosion",true);
			this.play("explode");
			numBullets -= 1;
		},

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


	});

///////////////////////////////////OBJETOS////////////////////////////////////////////////////////////////////////
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
						Q.audio.play("EnergyFill.mp3");
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
						Q.audio.play("EnergyFill.mp3");
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
						Q.audio.play("1up.mp3");
						this.taken = true;
						collision.obj.extralife();
						this.destroy();
					}
				}
			});
		}
	});


	//SPRITE OBJETO FINAL DEL NIVEL
	Q.Sprite.extend("endingItem",{

	 
		init: function(p) {

			this.taken = false;
		 
		    this._super(p, {
		    	sheet: "endingItem",
		    	sprite: "endingItem_Anim",
		    	sensor: true
		    });

		    this.add('2d, tween');

		    this.on("hit.sprite",function(collision) {


				if(collision.obj.isA("Megaman")) {
					if(!this.taken){
						this.taken = true;
						//Se añade una vida mas
						collision.obj.del('2d, platformerControls');
						this.del('2d');
						Q.audio.stop();
						Q.audio.play("endingItemJingle.mp3");
						this.animate({y: this.p.y-100}, 2, Q.Easing.Quadratic.Out, {callback:this.wait4It});
					}
				}
			});
		},

		wait4It: function(){
			this.animate({y: this.p.y}, 11/2, Q.Easing.Quadratic.Out, {callback:this.endLevel});
		},

		endLevel: function(){

			Q.clearStages();
			Q.stageScene('endGame');

		}
	});



/////////////////////////////////////////ENEMIGOS//////////////////////////////////////////////////////////////
	//SPRITE ROOMBA
	Q.Sprite.extend("Roomba",{

	 
		init: function(p) {

		 
		    this._super(p, {
		    	readyToChange: true,
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
			
			this.setStats(5, 2, false);
		},


		step: function(dt) {

			if(this.alive){
				if(this.stage.y >= this.p.y -16 && this.stage.y <= this.p.y +16 && this.p.direction == "left"){
					this.vx = -500;
					this.play("fast");
				}
				else if(this.stage.y >= this.p.y -16 && this.stage.y <= this.p.y +16 && this.p.direction == "right"){
					this.vx = -500;
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

		Dead: function(){
			this.dropItem();
			this.destroy();
		}
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
						Q.audio.play("enemyShoot.mp3");
						++this.p.shoots;
						this.p.shoot = false;
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 250, vy: -250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -250, vy: -250}))
						this.stage.insert(new Q.WheelBullet({x: this.p.x, y: this.p.y-20, vy: -250}));
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


	Q.Sprite.extend("InvertedWheel", {
		init: function(p){

			this._super(p, {
				type: Q.SPRITE_ALL,
				sensor: true,
				sprite: "wheel_anim",
				sheet: "iwheelDown",
				time: 0,
				activated: false,	//si esta activado, esta arriba
				up: false,
				shoot: true,		//indica si esta preparado para disparar o no
				shoots: 0,			//numero de disparos dado
				angle: 180
			});

			this.add('animation, DefaultEnemy, Stats');

			this.setStats(4, 2, false);

			},

		step: function(dt){
			if(this.p.activated){

				if(!this.p.up) {this.p.y += 9; this.p.up = true;}
				this.p.sprite = "wheel_anim";
				this.sheet("wheelUp", true);
				this.play("spin");

				if (this.p.x - 250 < this.stage.x && this.p.x + 250 >= this.stage.x){
					this.p.time +=dt;
					if (this.p.time >= 2 && this.p.shoots < 2){this.p.shoot = true;}
					if (this.p.shoots < 2 && this.p.shoot){
						Q.audio.play("enemyShoot.mp3");
						++this.p.shoots;
						this.p.shoot = false;
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 250, vy: 250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -250, vy: 250}))
						this.stage.insert(new Q.WheelBullet({x: this.p.x, y: this.p.y-20, vy: 250}));
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

				if(this.p.up) {this.p.y -= 9; this.p.up = false;}
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
				vx: -100,
				tick: 100,
				sensor: true,
				collisionMask: Q.SPRITE_NONE

			});
			this.add('2d,animation, DefaultEnemy, Stats');
			this.setStats(2, 3, false);
			this.on("hit", function(collision){
		    	if(collision.obj.isA("Megaman"))
					this.Dead();
		    });
		},

			step: function(dt){
				++this.p.tick;
				this.p.vy = 170 * Math.sin(this.p.tick * 0.1);
				if (this.p.vx == 0)
					this.Dead();
			},

			Dead: function(){
				this.dropItem();
				this.stage.insert(new Q.Explosion({x: this.p.x + 20, y: this.p.y, vx: 150}));
				this.stage.insert(new Q.Explosion({x: this.p.x - 20, y: this.p.y, vx: -150}));
				this.stage.insert(new Q.Explosion({x: this.p.x + 20, y: this.p.y, vx: 150, vy: -150}));
				this.stage.insert(new Q.Explosion({x: this.p.x - 20, y: this.p.y, vx: -150, vy: -150}))
				this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y-20, vy: -150}));
				this.destroy();
			}
	});

	Q.Sprite.extend("Explosion", {
		init: function(p){
			this._super(p, {
				sensor: true,
				sprite: "explosion_anim",
				sheet:"enemiesExplosion",
				gravity:0,
				collisionMask: Q.SPRITE_FRIENDLY
			});
			this.add('2d,animation, Stats');
			this.on("exploded", this, "destroy");
		    this.setStats(100, 2, true);
		    this.on("hit", function(collision){
		    	if(collision.obj.isA("Megaman")) {
					collision.obj.HITTED(this.power);
					collision.obj.explode();
					this.alive = false;
		    	}
		    });
		},

		step: function(dt){
			this.play("explode");
		}
	});

	Q.Sprite.extend("FireBall", {
		init: function(p){
			this._super(p, {
			type: Q.SPRITE_ALL,
			sprite: "fireball_anim",
			sheet: "fireBall",
			sensor: true,
			dx: 0,
			timeascending:1.6,
			ascending: true,
			gravity:0
		});
			this.add('animation, DefaultEnemy, Stats');
			this.setStats(1, 1, false);
		},

		step: function(dt){
			this.play("fly");
			this.p.timeascending -= dt;
			if(this.p.timeascending > 0)
				this.p.y -= 5;
			else{
				if(this.p.ascending){
					this.p.ascending = false;
					this.p.x += this.p.dx;
				}
				this.p.y += 1;
			}
			if (this.p.x > this.stage.x)
				this.p.x -= 0.3;
			else
				this.p.x += 0.3;
			if (this.p.y > this.stage.y + 250)
				this.destroy();
		},

		Dead: function(){
			this.dropItem();
			this.destroy();
		}
	});

	Q.Sprite.extend("SpawnerFireBall",{
		init: function(p){
        	this._super(p, {
        		num: 3,
        		time:0,
        		frec: 10
        	});
        },
        step: function(dt){
        	this.p.time -=dt;
        	if(this.p.time <= 0){
        		var i;
        		var j = 0;
        		var time = 1.7;
        		for(i= 0; i < this.p.num; ++i){
        			this.stage.insert(new Q.FireBall({x:this.p.x, y: this.p.y+j-100, timeascending: time , dx: j}))
        			j += 40;
        			time += 0.1;
        		}
        		this.p.time = this.p.frec;
        	}
        }
	});


	Q.Sprite.extend("SpawnerShark",{
		init: function(p){
        	this._super(p, {
        		intervalTop: 0,
        		intervalBot: 0,
        		intervalLeft: 0,
        		intervalRight: 0,
        		time:0,
        		frec: 5
        	});
        },
        step: function(dt){
        	this.p.time -=dt;
        	if(this.p.time <= 0){
        		if(this.stage.y > this.p.intervalTop && this.stage.y < this.p.intervalBottom
        			&& this.stage.x > this.p.intervalLeft && this.stage.x < this.p.intervalRight){
        			this.stage.insert(new Q.Shark({x:this.stage.x + 300, y: this.stage.y}))
        			this.p.time = this.p.frec;
        		}
        	}
        }
	});


///////////////////////////////////////SPRITES VARIOS/////////////////////////////////////////////////



	//SPRITE PRESS START
	 Q.Sprite.extend("Title", {
        init: function(p) {
            this._super(p, {
                y: Q.height/2,
      			x: Q.width/2,
      			time: 0,
      			asset: "title-screen.png"
                });
        },

        step: function(dt){
        	this.p.time += dt;
        	if(this.p.time >= 0.5){
        		this.p.time = 0;
	        	if(this.p.asset == "title-screen.png")
	        		this.p.asset = "title-screen-noletters.png";
	        	else
	        		this.p.asset = "title-screen.png";
       		}
        },
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
		    		Q.audio.play("enemyDamage.mp3");
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

					if(this.health <= 0){
						this.health = 0;
						this.DIE();
					}
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

	Q.component("platformerControlsMegaman", {
	    defaults: {
	      speed: 200,
	      jumpSpeed: -300,
	      collisions: []
	    },

	    added: function() {

	    	this.entity.playedLanding = false;
	      var p = this.entity.p;

	      Q._defaults(p,this.defaults);

	      this.entity.on("step",this,"step");
	      this.entity.on("bump.bottom",this,"landed");

	      p.landed = 0;
	      p.direction ='right';
	    },

	    landed: function(col) {
	      if(!this.entity.playedLanding){
	      	Q.audio.play("megaJump.mp3");
	        this.entity.playedLanding = true;
	 	  }
	      var p = this.entity.p;
	      p.landed = 1/5;
	    },

	    step: function(dt) {
	      var p = this.entity.p;

	      if(p.ignoreControls === undefined || !p.ignoreControls) {
	        var collision = null;

	        // Follow along the current slope, if possible.
	        if(p.collisions !== undefined && p.collisions.length > 0 && (Q.inputs['left'] || Q.inputs['right'] || p.landed > 0)) {
	          if(p.collisions.length === 1) {
	            collision = p.collisions[0];
	          } else {
	            // If there's more than one possible slope, follow slope with negative Y normal
	            collision = null;

	            for(var i = 0; i < p.collisions.length; i++) {
	              if(p.collisions[i].normalY < 0) {
	                collision = p.collisions[i];
	              }
	            }
	          }

	          // Don't climb up walls.
	          if(collision !== null && collision.normalY > -0.3 && collision.normalY < 0.3) {
	            collision = null;
	          }
	        }

	        if(Q.inputs['left']) {
	          p.direction = 'left';
	          if(collision && p.landed > 0) {
	            p.vx = p.speed * collision.normalY;
	            p.vy = -p.speed * collision.normalX;
	          } else {
	            p.vx = -p.speed;
	          }
	        } else if(Q.inputs['right']) {
	          p.direction = 'right';
	          if(collision && p.landed > 0) {
	            p.vx = -p.speed * collision.normalY;
	            p.vy = p.speed * collision.normalX;
	          } else {
	            p.vx = p.speed;
	          }
	        } else {
	          p.vx = 0;
	          if(collision && p.landed > 0) {
	            p.vy = 0;
	          }
	        }

	        if(p.landed > 0 && (Q.inputs['action']) && !p.jumping) {

	          p.vy = p.jumpSpeed;
	          p.landed = -dt;
	          p.jumping = true;
	        } else if(Q.inputs['action']) {
	          this.entity.trigger('jump', this.entity);
	          p.jumping = true;
	        }

	        if(p.jumping && !(Q.inputs['action'])) {
	          //300this.entity.playedLanding = false;
	          p.jumping = false;
	          this.entity.trigger('jumped', this.entity);
	          //if(p.vy < p.jumpSpeed / 3) {
	           // p.vy = p.jumpSpeed / 3;
	          //}
	        }
	      }
	      p.landed -= dt;
	    }
  	});


////////////////////////////////////ANIMACIONES/////////////////////////////////////////////////////
	
	//Animaciones Megaman
	Q.animations('megaman_anim', {
		run_right: { frames: [3,4,5], rate: 1/4}, 
		jump_right: { frames: [6], rate: 1/2},
		shoot_still_right: { frames: [10], rate: 1/2, loop: false, trigger: "fired" },
		shoot_run_right: { frames: [11,12,13], rate: 1/4, loop: false, trigger: "fired" },
		shoot_jump_right: { frames: [14], rate: 1/2, loop: false, trigger: "fired" },
		shoot_ladder_right: { frames: [15], rate: 1/2, loop: false, trigger: "fired" },
		stand_ladder: {frames: [7], rate: 1/2 },
		climb: {frames: [7,8], rate: 1/4 },
		end_climb: {frames: [9], rate: 1/3, loop: false, trigger: "endClimb"},
		stand_right: { frames: [0,1], rate: 3, loop: true},
	});

	Q.animations('fall_anim', {
		fall: {frames: [0], rate: 1/2, loop: true},
		up: {frames: [1,0,2], rate: 1/8, loop:false, trigger: 'ready'}
	});

	Q.animations('megaDie_anim',{
		mega_die: {frames: [3,2,1,0], rate: 1/4, loop: false, trigger: 'endExplode'}
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
		explode: {frames: [0,1,2], rate: 1/4, loop:false, trigger:'exploded'}
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

	Q.animations('endingItem_Anim', {
		still: {frames: [0,1], rate: 1/3}
	})

	Q.animations('verticalFire_Anim', {
		still: {frames: [0,1,2], rate: 1/4}
	})

///////////////////////////////////SECCION NIVELES////////////////////////////////////////////////////



	//NIVEL 1
	Q.scene("level1", function(stage) {
		Q.audio.stop();
		Q.audio.play('fireMan.mp3',{ loop: true });

		Q.stageTMX("FiremanStage.tmx",stage);
		var x, y;
		//Q.audio.play('music_main.mp3',{ loop: true });
		if (Q.state.get("checkPoint")){
			var player = stage.insert(new Q.Megaman({x:2210, y:1100, vy: 200}));
		}
		else{
			var player = stage.insert(new Q.Megaman({x:250, y:400, vy: 200}));
		}
		stage.add("viewport").follow(Q("Megaman").first(), { x: true, y:false });
		/*stage.insert(new Q.Wheel({x:272, y:1280}));
		stage.insert(new Q.Wheel({x:512, y:1280}));
		stage.insert(new Q.Wheel({x:912, y:1280}));
		stage.insert(new Q.Wheel({x:752, y:1408}));
		stage.insert(new Q.FireBall({x:290, y:1300}));
		stage.insert(new Q.Shark({x:500, y:1400}));
		*/
		stage.insert(new Q.SpawnerFireBall({x:1200, y:1500}));
		stage.insert(new Q.SpawnerFireBall({x:2300, y:1500}));
		stage.insert(new Q.SpawnerFireBall({x:2430, y:2430}));
		stage.insert(new Q.SpawnerFireBall({x:2750, y:1500}));
		stage.insert(new Q.SpawnerShark({intervalTop: 0, intervalBottom: 663, intervalLeft: 3247,
			intervalRight: 4160}));
		stage.insert(new Q.SpawnerShark({intervalTop: 665, intervalBottom: 1059, intervalLeft: 3178,
			intervalRight: 3473}));
		stage.centerOn(120,1350);
	});

	//TITULO DEL JUEGO
	Q.scene("mainTitle", function(stage){
		Q.audio.play('pressStart.mp3',{ loop: true });
		stage.insert(new Q.Title());
		Q.state.reset({ health: 20, checkPoint: false, lives: 3});
		// Al pulsar enter o apretar el botón se va al nivel 1
		Q.input.on("confirm", function(){
			Q.clearStages();
			Q.audio.stop("pressStart.mp3");
			Q.stageScene('level1');
			Q.stageScene("HUD",1);
		});

	});

	//GAME OVER
	Q.scene('endGame',function(stage) {
		Q.audio.stop();
		Q.audio.play('ending.mp3',{ loop: true });
		Q.stageTMX("credits.tmx",stage);
		var player = stage.insert(new Q.WalkingMegaman({x:2508, y:258}));
		stage.add("viewport").follow(Q("WalkingMegaman").first(), { x: true, y:false });
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

