
var initializeStageSprites = function(Q){

////////////////////////////////////SPRITES DEL ESCENARIO/////////////////////////////////////////////////
	
	// Sprite de las escaleras
	Q.Sprite.extend("Stairs",{
		init: function(p) {
		    this._super(p, {
		    	type: Q.SPRITE_ACTIVE,
		    	asset: "Stairs.png",
		    	sensor: true
		    });
		    this.on("hit", this, "collide");
		},
		// Al colisionar con Megaman, hace que suba a la escalera
		collide: function(collision){
			if(collision.obj.isA("Megaman") && !collision.obj.p.shooting && !collision.obj.p.gettingOff 
				&& (((Q.inputs['up'])) || // si se pulsa el botón Arriba
					(collision.obj.p.landed < 0 && (Q.inputs['down'])))) { // o Abajo sin estar en el suelo
				collision.obj.p.onLadder = true;
				collision.obj.p.x = this.p.x;
			}
		}
	});

	// Sprite Lava
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

	// Sprite de lava sin colision (lava de abajo)
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

	// Barras de fuego horizontales
	Q.Sprite.extend("HorizontalFlame",{

		init: function(p) {

		    this._super(p, {
		    	type: Q.SPRITE_PARTICLE,
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
					this.p.x += 56; //movemos su posición en función de lo grande del sprite
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

	// Barras de fuego verticales
	Q.Sprite.extend("barraFuego",{

		init: function(p) {

			this.hidden = false;

		    this._super(p, {
		    	type: Q.SPRITE_ENEMY,
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
			});


			this.setStats(100, 2, true);
			
			this.animate({y: this.p.y - 75}, 1, {callback: this.wait4Down})
		},
		// Animaciones arriba y abajo del sprite
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

////////////////////////////////////SPRITES OCULTOS/////////////////////////////////////////////////////////////////////////

	// Sprite Tilechecker
	Q.Sprite.extend("TileChecker",{
		/*
		Este sprite va a valer para que el Roomba no se vaya de donde tiene que estar y tambien estan colocados en las partes de 
		arriba y abajo de las escaleras.
		*/
	 
		init: function(p) {

		    this._super(p, {
		    	type: Q.SPRITE_ACTIVE,
		    	sensor: true,
		    	asset: "Stairs.png",
		    	w: 32,
		    	h: 32
		    });
		 this.on("hit", this, "collide");
		},

		collide: function(collision){
			//Si toca a Megaman cuando está en una escalera, provoca que se baje
			if(collision.obj.isA("Megaman") && collision.obj.p.onLadder) {
				collision.obj.getOffLadder();
			}
		}
	
	});


	// Sprite Black
	Q.Sprite.extend("Black",{
		// Se usa para que la barra de fuego no se vea donde no nos interesa
	 
		init: function(p) {

		    this._super(p, {
		    	type: Q.SPRITE_ALL,
		    	collisionMask: Q.SPRITE_ALL,
		    	sensor: true,
		    	asset: "blackTile.png",
		    	w: 32,
		    	h: 32,
		    	z:1
		    });
		}

	});

	// Sprite de las primeras puertas del nivel
	Q.Sprite.extend("Puertas", {

		init: function(p){

			this._super(p, {
				type: Q.SPRITE_ACTIVE,
				sheet: "openingDoors",
				sprite: "doors_anim",
				closed: false
			});

			this.add('animation, tween, Doors');
			this.on('hit', function(collision){
				if(collision.obj.isA("Megaman") && !this.p.closed && !Q.state.get("checkPoint2"))
					this.abrir(collision);
			});
			this.on('opened', this, 'cerrar'); //Cuando terminan de abrirse (Megaman ya ha pasado) se vuelven a cerrar
		},

		cerrar: function(){
				this.animate({x: this.p.x}, 1, Q.Easing.Linear, {callback: this.close})	
		},

	});

	// Sprite de las segundas puertas del nivel
	Q.Sprite.extend("PuertasFinales", {

		init: function(p){

			this._super(p, {
				type: Q.SPRITE_ACTIVE,
				sheet: "finalDoor",
				sprite: "doors_anim",
				closed: false
			});

			this.add('animation, tween, Doors');
			this.on('hit', function(collision){
				if(collision.obj.isA("Megaman") && !this.p.closed)
					this.abrir(collision);
			});
			this.on('opened', this, 'cerrar');
			//this.on('closed', this, 'finalBoss');
		},

		cerrar: function(){
			this.animate({x: this.p.x}, 1, Q.Easing.Linear, {callback: this.close})
			this.finalBoss();
		},

		finalBoss: function(){
			Q.audio.stop();
			Q.audio.play("bossTheme.mp3", {loop: true});
			Q.stageScene("HUDFire",2);
			this.stage.insert(new Q.FireMan({x:6780, y: 543}));

		}

	});
}