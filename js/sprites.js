	
var initializeSprites = function(Q) {

	//Constantes
	const MAX_BULLETS = 3;

	//Variables globales
	var numBullets = 0;
	Q.SPRITE_MEGAMAN  = 128;
	Q.SPRITE_FIREMAN  = 256;

	//SPRITE MEGAMAN
	Q.Sprite.extend("Megaman",{
		init: function(p) {
			this.appear = 0;
			this.invFrames = false;
			this.timeInv = 0;
			this.playedEntered = false;
			this.dibuja = true;
			this.lastShot = 0;

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
		    	enPuerta: 0,
		    	cameraX: 300,
		    	cameraY: 1350,
		    	type: Q.SPRITE_FRIENDLY && Q.SPRITE_MEGAMAN,

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
			this.lastShot += dt;
			this.invencibleStep(dt);
			this.doorStep(dt);
			if (this.p.entering){ //Megaman entra en el nivel
				this.playEntranceStep(dt);
				if(Q.state.get("checkPoint2")){
					this.p.cameraX = 5395;
					this.p.cameraY = 450;
				}
				else if(Q.state.get("checkPoint")){
					this.p.cameraX = 2320;
					this.p.cameraY = 1350;
				}
			}
			else{ //Megaman ya ha entrado en el nivel
				if(!Q.state.get("checkPoint") && this.p.x > 2190 && this.p.y > 1150)
					Q.state.set({ checkPoint: true});
				if(!Q.state.get("checkPoint2") && this.p.x > 5150)
					Q.state.set({ checkPoint2: true});
				//Condicion necesaria para que el malo final no se vuelva loco cuando mate a megaman
				if(this.alive){
					this.stage.x = this.p.x;
					this.stage.y = this.p.y;
				}
				Q.state.set({ health: this.health});
				if(this.p.onLadder) this.p.vx = 0; // Cuando está en escalera no se puede mover horizontalmente
				this.controlCamaraStep(dt);
				this.stage.centerOn(this.p.cameraX,this.p.cameraY);
				Q.state.set({ camera: this.p.cameraX});
				if (!this.p.exploding && !this.invencible && !this.p.gettingOff){
					if(this.p.direction == "left")
						this.p.flip = "x";
					else
						this.p.flip = "";
					// Comportamiento cuando está subido a una escalera
					if(this.p.onLadder && !this.p.shooting) {
						this.megamanEnEscaleraStep(dt);
				    }
				    // Comportamiento cuando NO está subido a una escalera
				    else{
				    	this.megamanNormalStep(dt);
					}
				}
			}
		},

		shoot: function(){
			if(!this.p.exploding && !this.invencible && !this.p.gettingOff && !this.p.entering && this.lastShot > 1/6){
				this.lastShot = 0;
				newY = this.p.y+9/2;
				this.p.shooting = true;
				if(this.p.onLadder){
					this.play("shoot_ladder_right");
					 newY -= 11;
				}
				else if (this.p.landed < 0){
					this.playedLanding = false;
					this.play("shoot_jump_right");
				}
				else if (this.p.vx != 0){
					this.play("shoot_run_right");
				}
				else{
					this.play("shoot_still_right");
				}
				if(numBullets < MAX_BULLETS){
					Q.audio.play("disparo.mp3");
					if(this.p.direction == "right")
						this.stage.insert(new Q.Bullet({x:this.p.x + 30, y:newY, vx:330}));
					else
						this.stage.insert(new Q.Bullet({x:this.p.x - 30, y:newY, vx:-330}));
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
					this.animate({x: this.p.x+20}, 0.4, Q.Easing.Linear);
				else
					//this.p.vx = -100;
					this.animate({x: this.p.x-20}, 0.4, Q.Easing.Linear);
				this.p.exploding = true;
				this.p.sprite = "megamanHit_anim";
				this.sheet("megaDie",true);
				this.play("megaHit");

				//Cambiamos el atributo shooting a false en el caso de que estemos explotando mientras estamos disparando
				if(this.p.shooting){
					this.p.shooting = false;
				}
				this.golpe();
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
		},

		muevete: function(){
			this.p.enPuerta = 1;
		},

		golpe: function() {
			this.appear = 0;
			this.timeInv = 0;
			this.p.type = Q.SPRITE_MEGAMAN;
			this.p.collisionMask = Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT; 
			this.invFrames = true;
		},

		invencibleStep: function(dt){
			//Esta funcion se utiliza para establecer los frames de invencibilidad en el step
			if(this.invFrames){
				this.timeInv += dt;
				this.appear += dt;
				if( this.timeInv < 2 && Math.round((this.appear % 1)*10)/10 > 1/10 && this.invencible == false){
					this.appear = 0;
					this.dibuja = !this.dibuja;
					this.p.opacity == 0 ? this.p.opacity = 100 : this.p.opacity = 0;
					//this.play("dissapear");
				}
				if(this.timeInv >= 2){
					this.invFrames = false;
					this.p.type = Q.SPRITE_FRIENDLY&&Q.SPRITE_MEGAMAN;
					this.p.collisionMask = Q.SPRITE_ALL;
					this.dibuja = true;
					this.p.opacity = 100

				}
			}
		},

		doorStep: function(dt){

			//Esta funcion se utiliza para establecer cuando megaman pasa por una puerta
			if(this.p.enPuerta >= 1 && this.p.enPuerta <= 3.8){
				this.playedLanding = true;
				this.del('2d, platformerControlsMegaman');
				if (this.p.enPuerta >= 2.5 && this.p.enPuerta <= 3.4){
					this.stage.viewport.offsetX -= 2;
					this.p.x += 2.5;
					
				}
				if (this.p.enPuerta >= 3.5){this.add('2d, platformerControlsMegaman');}
				this.p.enPuerta += dt;		
			}
		},

		playEntranceStep: function(dt){
			var height = 1500;
			//Se ejecuta la entrada de megaman en el nivel
			if(Q.state.get("checkPoint2"))
				height = 479;
			if(this.p.y < height){
					this.p.collisionMask = Q.SPRITE_NONE;
					this.play("fall");
				}
				else{
					if(!this.playedEntered){
						this.playedEntered = true;
						Q.audio.play("entraMegaman.mp3");
					}
					this.p.y = height;
					this.p.vy = 0;
					this.play("up");
					this.p.collisionMask = Q.SPRITE_ALL;
				}
		},

		megamanEnEscaleraStep: function(dt){
			
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
					    	this.p.onLadder = false;
					    	this.p.gravity = 1;
					    }
					    else{
					        this.p.vy = 0;
					        this.play("stand_ladder");
					    }
		},

		controlCamaraStep: function(dt){

			//Esta funcion se encarga de controlar la camara en funcion de donde está megaman
				if(this.p.y > 1110) {
					if(this.p.cameraY < 1350)
						this.p.cameraY += 10;
					if(this.p.cameraY > 1350)
						this.p.cameraY -= 10;
					if((this.p.x > 300 && this.p.x < 1310) ||(this.p.x > 2320 && this.p.x < 3360))
						this.p.cameraX = this.p.x;
					else{
						if(this.p.x < 300)
							this.p.cameraX = 300;
						else if (this.p.x < 1500)
							this.p.cameraX = 1310;
						else if (this.p.x < 2320)
							this.p.cameraX = 2320;
						else
							this.p.cameraX = 3360;
					}
				}
				else if(this.p.y > 656) {
					if(this.p.cameraY < 900)
						this.p.cameraY += 10;
					if(this.p.cameraY > 900)
						this.p.cameraY -= 10;
					if(this.p.x < 1520)
						this.p.cameraX = 1310;
					else if(this.p.x < 2520)
						this.p.cameraX = 2320;
					else
						this.p.cameraX = 3360;
				}
				else {
					if(this.p.cameraY < 450)
						this.p.cameraY += 10;
					if(this.p.cameraY > 450)
						this.p.cameraY -= 10;
					if((this.p.x > 1310 && this.p.x < 2320) || (this.p.x > 3360 && this.p.x < 4896) ||
						(this.p.x > 5395 && this.p.x < 6173))
						this.p.cameraX = this.p.x;
					else{
						if(this.p.x < 1310)
							this.p.cameraX = 1310;
						else if(this.p.x < 2600)
							this.p.cameraX = 2320;
						else if(this.p.x < 3360)
							this.p.cameraX = 3360;
						else if (this.p.x < 5082)
							this.p.cameraX = 4896;
						else if (this.p.x < 5400){
							if(this.p.cameraX < 5395)
								this.p.cameraX += 3;
						}
						else if (this.p.x < 6438)
							this.p.cameraX = 6173;
						else{
							if(this.p.cameraX < 6663)
								this.p.cameraX += 10;
						}
					}
				}
		},

		megamanNormalStep: function(dt){
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


	});


	
	Q.Sprite.extend("MegamanExplosion", {
		init: function(p){
			this._super(p, {
				type: Q.SPRITE_NONE,
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
	    
	    if (obj.p.type == Q.SPRITE_MEGAMAN){
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

	     if(obj.p.type == Q.SPRITE_FIREMAN){

		    p.points = [
		      [ -p.w/2-30, -p.h/2-40 ],
		      [  p.w/2-30, -p.h/2-40 ],
		      [  p.w/2-30,  p.h/2 ],
		      [ -p.w/2-30,  p.h/2 ]
		      ];
	     }
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

	

////////////////////////////////////////////BALAS////////////////////////////////////////////////////////////////
	//Balas Megaman
	Q.Sprite.extend("Bullet", {
		init: function(p) {

			this._super(p, {
				type: Q.SPRITE_PARTICLE,
				sensor: true,
				asset: "bullet.png",
				vx: 500,
				gravity: 0,
				exploding:false,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_FIREMAN
			});
			this.add("2d, animation, Stats");
			this.on("exploded", this, "destroy");	//una vez mostrada la animacion se destruye la bala
			this.setStats(100, 1, true);
			this.on("hit", function(collision){
				if((collision.obj.isA("BigFlame") || collision.obj.isA("barraFuego")) && !this.p.exploding) {
						//Las balas desaparecen al chocar contra estas como en el juego original
						this.destroy();
						if(numBullets > 0)
							numBullets -= 1;
			    }
		    });

			numBullets +=1;

		},

		step: function(dt){
			if(!this.p.exploding && (this.p.vx == 0 || this.p.x > Q.state.get("camera") + 250 || this.p.x < Q.state.get("camera") - 250)){
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
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_FRIENDLY
			});
			this.add('2d, animation, Stats');
		    this.setStats(100, 2, true);
		    this.on("hit", function(collision){
		    		if(!collision.obj.invencible){
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
			if(this.p.time > 10)
				this.destroy();
		},


	});

///////////////////////////////////OBJETOS////////////////////////////////////////////////////////////////////////
	//SPRITE BOTIQUINP
	Q.Sprite.extend("BotiquinP",{

	 
		init: function(p) {

			this.taken = false;
		 
		    this._super(p, {
		    	collisionMask: Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
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
		    	collisionMask: Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
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
		    	collisionMask: Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
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
		    	collisionMask: Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
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

	//LIVES
    Q.Sprite.extend("Lives", {
        init: function(p) {
            this._super(p, {
                y: 90-Q.height/2,
      			x: 30-Q.width/2,
      			scale:0.22,
      			sheet: "20lives"
                });
        },

        step: function(dt){
        	this.sheet(Q.state.get("health") + "lives" ,true);
        },
    });

    //FIREMAN LIVES
    Q.Sprite.extend("FireLives", {
    	init: function(p) {
    		this._super(p, {
    			y: 90 - Q.height/2,
    			x: 70 - Q.width/2,
    			scale: 0.22,
    			sheet: "20livesF"
    		});
    	},

    	step: function(dt){
    		this.sheet(Q.state.get("healthF") + "livesF", true);
    	}
    });

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

}

