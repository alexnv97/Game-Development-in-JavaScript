


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

	Q.load(["megaman.png", "fireman.png", "megaman.json", "bullet.png", "enemies.png", "enemies.json"], function() {

		Q.compileSheets("megaman.png", "megaman.json");
		Q.compileSheets("enemies.png", "enemies.json");

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
		    	speed: 300,
		    	w: 32,
		    	h: 32

		    });

		    this.add('2d, platformerControls, animation, tween');
		    Q.input.on("fire", this, "shoot");
		    this.on("fired", this, "endShoot");

		},

		step: function(dt) {
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
			collisionMask: Q.SPRITE_NONE
		});
			this.add("2d, animation");
			numBullets +=1;
		},

		step: function(dt){
			if(this.p.x > this.p.mx + 250 || this.p.x < this.p.mx - 250 || this.p.vx == 0){
				this.destroy();
				numBullets -=1;
			}
		},
	});

	Q.Sprite.extend("Torno", {
		init: function(p){
			this._super(p, {
				sprite: "torno_anim",
				sheet: "enemies"
			})
		}
	})
////////////////////////////////////COMPONENTES////////////////////////////////////////////////////
	//COMPONENTE ENEMIGOS
	Q.component("DefaultEnemy", {
		
		added: function(){

		},

		extend: {
			DEAD: function() {

			},

			die: function(){

			}
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
		die: {frames: [16,17], loop: true}
	});

	Q.animations('torno_anim',{
		down: {frames: [0], loop:true},
		spin: { frames: [1,2,3], rate: 1/7, loop: true}
	})

	Q.animations('armadilloAnim',{
		slow: {frames: [5,6], rate:1/2},
		fast: {frames: [5,6], rate:1/4}}
	})

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

