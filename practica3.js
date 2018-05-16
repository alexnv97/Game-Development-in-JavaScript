


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
		"explosion.png", "explosion.json", "shark.png"], function() {

		Q.compileSheets("megaman.png", "megaman.json");
		Q.compileSheets("roomba.png", "roomba.json");
		Q.compileSheets("wheel.png", "wheel.json");
		Q.compileSheets("fireball.png", "fireball.json");
		Q.compileSheets("explosion.png", "explosion.json");

	});

	//Constantes
	const MAX_BULLETS = 3;

	//Variables globales
	var numBullets = 0;

	//SPRITE MEGAMAN
	Q.Sprite.extend("Megaman",{

		init: function(p) {
		    this._super(p, {
		      	sheet: "megaStill",
		      	sprite:  "megaman_anim",
		      	shooting: false,
		      	onLadder: false,
		    	jumpSpeed: -1000,
		    	exploding:false,
		    	speed: 300

		    });

		    this.add('2d, platformerControls, animation, tween');
		    Q.input.on("fire", this, "shoot");
		    this.on("fired", this, "endShoot");
		    this.on("megaExplosion", this, "destroy");
		},

		step: function(dt) {
			if (!this.p.exploding){
				if(this.p.direction == "left")
					this.p.flip = "x";
				else
					this.p.flip = "";
				if(this.p.onLadder) {
			      	this.p.gravity = 0;
				    if(Q.inputs['up']) {
				        this.p.vy = -this.p.speed;
				        this.play("climb");
				    } 
				    else if(Q.inputs['down']) {
				        this.p.vy = this.p.speed;
				        this.play("climb");
				    }
				    else{
				        this.p.vy = 0;
				        this.play("stand_ladder");
				    }
			    }
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
			this.p.shooting = true;
			if(this.p.onLadder)
				this.play("shoot_ladder_right");
			else if (this.p.landed < 0)
				this.play("shoot_jump_right");
			else if (this.p.vx != 0)
				this.play("shoot_run_right");
			else{
				this.play("shoot_still_right");
			}
			if(numBullets < MAX_BULLETS){
				if(this.p.direction == "right")
					this.stage.insert(new Q.Bullet({x:this.p.x + 30, y:this.p.y, vx:330, mx: this.p.x}));
				else
					this.stage.insert(new Q.Bullet({x:this.p.x - 30, y:this.p.y, vx:-330, mx: this.p.x}));
			}
		},

		endShoot: function(){
			this.p.shooting = false;
		},

		die: function(){


		},

		explode: function(collision){
			this.p.exploding = true;
			this.p.sprite = "megamanHit_anim";
			this.sheet("megaDie",true);
			this.play("megaHit");
		},

		changeToDead : function(){
			
			this.destroy();	
			
		},


		extralife: function(){

		}

	
	});


/*

NOT FULLY IMPLEMENTED YET
	//SPRITE ROOMBA
	Q.Sprite.extend("Roomba",{

	 
		init: function(p) {

		 
		    this._super(p, {
		    	sheet: "armadillo",
		    	sprite: "armadilloAnim",
		    	vx: 100
		    });

		    this.add('2d, aiBounce, animation, DefaultEnemy');


		},


		step: function(dt) {

			if(Q.pPlayer.py = this.p.py){
				this.vx = 200;
				this.play("fast");
			}
			else if(this.alive){
				this.play("slow");
			}
		}
		// Listen for a sprite collision, if it's the player,
		// end the game unless the enemy is hit on top
	
	});

*/
	//SPRITE STAIRS 
	Q.Sprite.extend("Stairs",{

	 
		init: function(p) {

		    this._super(p, {
		    	asset: "Stairs.png",
		    	sensor: true
		    });
		}
	
	});

	//SPRITE LAVA 
	Q.Sprite.extend("Lava",{

		//Este sprite representa la parte de arriba de la lava, y actua como sensor, si megaman la toca, muere

		init: function(p) {

		    this._super(p, {
		    	sensor: true
		    });

		    this.on("hit.sprite",function(collision) {
				if(collision.obj.isA("Megaman")) {
					/*
					if(collision.obj.isAlive){
						collision.obj.Die();
					}
					*/
				}
			});
		}
	});

	Q.Sprite.extend("Bullet", {
		init: function(p) {
			this._super(p, {
			asset: "bullet.png",
			vx: 330,
			gravity: 0,
			exploding:false,
			collisionMask: Q.SPRITE_NONE
		});
			this.add("2d, animation");
			this.on("exploded", this, "destroy");	//una vez mostrada la animacion se destruye la bala
			numBullets +=1;
		},

		step: function(dt){
			if(this.p.x > this.p.mx + 250 || this.p.x < this.p.mx - 250 || (this.p.vx == 0 && !this.p.exploding)){
				this.destroy();
				numBullets -=1;
			}
			if(this.p.exploding){
				this.p.vx = 0;
			}
		},

		explode: function(){
			this.p.exploding = true;
			this.p.sprite = "explosion_anim";
			this.sheet("enemiesExplosion",true);
			this.play("explode");
			numBullets -= 1;
		}
	});

	Q.Sprite.extend("WheelBullet", {
		init: function(p){
			this._super(p, {
			sheet: "bulletWheel",
			gravity:0,
			time: 0,
			exploding:false,
			collisionMask: Q.SPRITE_NONE
		});
			this.add('2d,animation');
		    this.on("bump.top, bump.bottom, bump.left, bump.right", function(collision){
		    	if(collision.obj.isA("Megaman")) {
					collision.obj.explode();
					this.destroy();
		    	}
		    });

		},

		step: function(dt){
			this.p.time += dt;
			if (this.p.time >= 0.5){this.destroy();}

			if (this.p.exploding){
				this.p.vx = 0; this.p.vy = 0;
			}
			if(this.p.vx == 0 && !this.p.exploding){
				this.destroy();
			}
		}
	});

	Q.Sprite.extend("Wheel", {
		init: function(p){
			this._super(p, {
				sprite: "wheel_anim",
				sheet: "wheelDown",
				time: 0,
				activated: false,	//si esta activado, esta arriba
				shoot: true,		//indica si esta preparado para disparar o no
				shoots: 0			//numero de disparos dado
			});

			this.add('2d,animation, DefaultEnemy');
			},

			step: function(dt){
				if(this.p.activated){
					this.p.sprite = "wheel_anim";
					this.sheet("wheelUp", true);
					this.play("spin");
					this.p.time +=dt;
					if (this.p.time >= 2 && this.p.shoots < 2){this.p.shoot = true;}

					if (this.p.time >= 3){
						this.p.activated = false;
						this.p.time = 0;
						this.p.shoot = true;
						this.p.shoots = 0;
					}
					if (this.p.shoots < 2 && this.p.shoot){
						++this.p.shoots;
						this.p.shoot = false;
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 300}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -300}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 300, vy: -300}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -300, vy: -300}))
						this.stage.insert(new Q.WheelBullet({x: this.p.x, y: this.p.y-20, vy: -300}));
						
					}
				}
				else{
					this.p.time += dt;
					if (this.p.time <= 1){
						this.p.sprite = "wheel_down";
						this.sheet("wheelDown", true);
						this.play("down");
					}
					else{
						this.p.time = 0;
						var random_number = Math.floor(Math.random()*10) + 1;
						if (random_number <= 5){
							this.p.activated = true;
						}
					}
					
				}
			}
	});

	Q.Sprite.extend("Shark", {
		init: function(p){
			this._super(p, {
				asset: "shark.png",
				vx: -100,
				tick: 100,
				collisionMask: Q.SPRITE_NONE

			});
			this.add('2d,animation, DefaultEnemy');
			},

			step: function(dt){
				++this.p.tick;
				this.p.vy = 150 * Math.sin(this.p.tick * 0.1);
			}
	});

	Q.Sprite.extend("FireBall", {
		init: function(p){
			this._super(p, {
			sprite: "fireball_anim",
			sheet: "fireBall"

		});
			this.add('2d,animation');
		},

		step: function(dt){
			this.play("fly");
		}
	});

////////////////////////////////////COMPONENTES////////////////////////////////////////////////////
	//COMPONENTE ENEMIGOS
	Q.component("DefaultEnemy", {
		
		added: function(){

			this.entity.on("bump.left, bump.right, bump.bottom, bump.top", function(collision){
				if (collision.obj.isA("Bullet")){
					collision.obj.explode();
					this.destroy();
				}
			});
		},

		extend: {
			/*DEAD: function() {

			},

			die: function(){

			}*/
		}

	});

	

////////////////////////////////////ANIMACIONES/////////////////////////////////////////////////////
	
	//Animaciones Mario
	Q.animations('megaman_anim', {
		run_right: { frames: [3,4,5], rate: 1/7}, 
		jump_right: { frames: [6], rate: 1/5},
		shoot_still_right: { frames: [10], rate: 1/5, loop: false, trigger: "fired" },
		shoot_run_right: { frames: [11,12,13], rate: 1/7, loop: false, trigger: "fired" },
		shoot_jump_right: { frames: [14], rate: 1/7, loop: false, trigger: "fired" },
		shoot_ladder_right: { frames: [15], rate: 1/7, loop: false, trigger: "fired" },
		stand_ladder: {frames: [7], rate: 1/10 },
		climb: {frames: [7,8], rate: 1/10 },
		stand_right: { frames: [0,1,2], rate: 1/2, loop: true},
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
		megaHit: {frames: [0,1], rate: 1/2, loop: false, trigger: 'megaExplosion'}
	});

	/*
	Not fully implemented yet
	Q.animations('armadilloAnim',{
		slow: {frames: [5,6], rate:1/2},
		fast: {frames: [5,6], rate:1/4}}
	})
	*/
///////////////////////////////////AUDIOS///////////////////////////////////////////////////////////
	//CARGA DE AUDIOS
	Q.load([], function(){

	});
///////////////////////////////////CARGA NIVELES////////////////////////////////////////////////////

	//INICIALIZACION
	Q.loadTMX("FiremanStage.tmx", function() {
		Q.stageScene("level1");
		//Q.stageScene("level1");
	});


	//NIVEL 1
	Q.scene("level1", function(stage) {

		Q.stageTMX("FiremanStage.tmx",stage);
		this.height = 10000;
		this.width = 10000;

		//Q.audio.play('music_main.mp3',{ loop: true });
		var player = stage.insert(new Q.Megaman({x:120, y:1500}));
		stage.add("viewport").follow(Q("Megaman").first(), { x: true, y:true });
		stage.insert(new Q.Wheel({x:272, y:1408}));
		stage.insert(new Q.Wheel({x:272, y:1280}));
		stage.insert(new Q.Wheel({x:512, y:1280}));
		stage.insert(new Q.Wheel({x:912, y:1280}));
		stage.insert(new Q.Wheel({x:752, y:1408}));
		//stage.insert(new Q.FireBall({x:272, y:1408}));
		stage.centerOn(120,1350);

	});

	//TITULO DEL JUEGO
	Q.scene("mainTitle", function(stage){
		


	});

	//GAME OVER
	Q.scene('endGame',function(stage) {


	});

	//HUD
    Q.scene("hud", function(stage) {



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
    Q.UI.Text.extend("LIVES", {
        init: function(p) {
            this._super(p, {
                label: "LIVES: " + Q.state.get("lives"),
                    color: "white",
                    size: "14"
                });
            /** Necesito extender porque quiero escuchar los cambios de la variable en el "State". */
            Q.state.on("change.lives", this, "update_label");
        },
 
        /**
        * Con esta función actualizo el label.
        */
        update_label: function(score) {
            this.p.label = "LIVES: " + Q.state.get("lives");
        }
    });


////////////////////////////////BUCLE PRINCIPAL//////////////////////////////////////////////



}

