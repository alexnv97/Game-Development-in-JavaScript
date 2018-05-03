


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
			width: 256, // Set the default width to 800 pixels
			height: 250, // Set the default height to 600 pixels
		//	downsampleWidth: 640, // Halve the pixel density if resolution
		//	downsampleHeight: 960 // is larger than or equal to 1024x768
		}).controls().touch().enableSound();

	

///////////////////////////////sprites//////////////////////////////////////////////	
	
	//CARGA DE DATOS

	Q.load([], function() {

		Q.compileSheets("");

	});

	//SPRITE MEGAMAN
	Q.Sprite.extend("Megaman",{

	 	

		init: function(p) {

		    this._super(p, {
		      	
		      	sheet: "",
		      	sprite:  "",
		    	jumpSpeed: -400,
		    	speed: 300,
		    	w: 32,
		    	h: 32

		    });

		    this.add('2d, platformerControls, animation, tween');

		},


		Die: function(){


		},

		changeToDead : function(){
			
			this.destroy();	
			
		},


		extralife: function(){

		},

		step: function(dt) {
		  	
					
		}
	
	});

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
	Q.animations('Megaman_anim', {
		run_right: { frames: [], rate: 1/10}, 
		run_left: { frames: [], rate:1/10 },
		fire_right: { frames: [], rate: 1/30, trigger: "fired" },
		fire_left: { frames: [], rate: 1/30, trigger: "fired" },
		Stand_right: { frames: []},
		Stand_left: { frames: [] },
		fall_right: { frames: [], loop: false },
		fall_left: { frames: [], loop: false },
		die: {frames: [], loop: true}
	});



///////////////////////////////////AUDIOS///////////////////////////////////////////////////////////
	//CARGA DE AUDIOS
	Q.load([], function(){

	});
///////////////////////////////////CARGA NIVELES////////////////////////////////////////////////////

	//INICIALIZACION
	Q.loadTMX("", function() {
		Q.stageScene("mainTitle");
		//Q.stageScene("level1");
	});


	//NIVEL 1
	Q.scene("level1", function(stage) {

		Q.stageTMX("levelOK.tmx",stage);

		Q.audio.play('music_main.mp3',{ loop: true });


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

