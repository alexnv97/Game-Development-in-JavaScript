
var initializeSpriteEnemies = function(Q){

	
	// Sprite Roomba
	Q.Sprite.extend("Roomba",{

		init: function(p) {
			this.spedUp = false;
			this.goingBaseSpeed = true;
		 	this.relativePos = 0;
		 	this.timeFromTurn = 0;
		    
		    this._super(p, {
		    	type: Q.SPRITE_ENEMY,
		    	sheet: "rotationRoomba",
		    	sprite: "armadilloAnim",
		    	vx: 100,
		    	h: 16,
		    	collisionMask: Q.SPRITE_FRIENDLY | Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT
		    });

		    this.on("hit",function(collision){
		    	// Al colisionar con un TileChecker, cambia su dirección
		      	if(collision.obj.isA("TileChecker")){
		      		collision.impact = this.p.vx;
		      		 if(this.p.defaultDirection == "left")
		      		 	this.goRight(collision);
		      		 else
		      		 	this.goLeft(collision);
		      	}
		    });
				
		    this.add('2d, animation, DefaultEnemy, Stats');
			this.setStats(5, 2, false);
		},

	    goLeft: function(col) {
	   	 if(this.timeFromTurn > 1){	
	   	 	 this.timeFromTurn= 0;
		      this.p.vx = -col.impact;
		      if(this.p.defaultDirection === 'right') {
		          this.p.flip = 'x';
		      }
		      else {
		          this.p.flip = false;
		      }
		  }
	    },

	    goRight: function(col) {
	    	if(this.timeFromTurn > 1){	
	    		this.timeFromTurn = 0;
		      this.p.vx = col.impact;
		      if(this.p.defaultDirection === 'left') {
		          this.p.flip = 'x';
		      }
		      else 
		          this.p.flip = false;
		  }
	     },

		step: function(dt) {
			// Cuando Megaman está cerca, el Roomba aumenta su velocidad contra él
			this.timeFromTurn += dt;
			this.relativePos = this.p.y - this.stage.y;
			if(this.alive){
				if(Math.abs(this.relativePos) <= 16 && !this.spedUp && this.goingBaseSpeed){
					this.p.vx = this.p.vx * 2;
					this.play("fast");
					this.spedUp = true;
					this.goingBaseSpeed = false;
				}
				else if(Math.abs(this.relativePos) > 16 && this.spedUp && !this.goingBaseSpeed){
					this.p.vx = this.p.vx / 2;
					this.goingBaseSpeed = true;
					this.spedUp = false;
				}
				if(this.p.vx <= 90 && this.p.vx >= -90){
					if(this.p.defaultDirection === 'left'){
						if(this.goingBaseSpeed)
							this.p.vx = -100;
						else
							this.p.vx = -200;
					}
					else{
						if(this.goingBaseSpeed)
							this.p.vx = 100;
						else
							this.p.vx = 200;
					}

				}
			}
		},

		Dead: function(){
			this.dropItem();
			this.destroy();
		}
	});

	// Sprite Wheel
	Q.Sprite.extend("Wheel", {
		init: function(p){

			this._super(p, {
				type: Q.SPRITE_ENEMY,
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
			this.setStats(2, 2, false);

			},

		step: function(dt){
			// Si están activadps y Megaman está cerca se dispara
			if(this.p.activated){
				if (this.p.x - 250 < Q.state.get("camera") && this.p.x + 250 >= Q.state.get("camera") &&
				 this.p.y - 450 < this.stage.y && this.p.y + 450 >= this.stage.y){

					if(!this.p.up) {this.p.y -= 9; this.p.up = true;}
					this.p.sprite = "wheel_anim";
					this.sheet("wheelUp", true);
					this.play("spin");
					this.p.time +=dt;
					if (this.p.time >= 2 && this.p.shoots < 2){this.p.shoot = true;}
					if (this.p.shoots < 2 && this.p.shoot){
						Q.audio.play("enemyShoot.mp3");
						++this.p.shoots;
						this.p.shoot = false;
						// Se añaden todas las balas al escenario
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 250, vy: -250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -250, vy: -250}))
						this.stage.insert(new Q.WheelBullet({x: this.p.x, y: this.p.y-20, vy: -250}));
					}
					// Si ha pasado un tiempo de más de 3 segundos se desactiva
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
					// Activamos al enemigo si está en cámara
					this.p.time = 0;
					var random_number = Math.floor(Math.random()*10) + 1;
					if (random_number <= 5 || (this.p.x - 250 < Q.state.get("camera") && this.p.x + 250 >= Q.state.get("camera"))){
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

	// Sprite del enemigo InvertedWheel
	Q.Sprite.extend("InvertedWheel", {
		init: function(p){

			this._super(p, {
				type: Q.SPRITE_ENEMY,
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

			this.setStats(2, 2, false);

			},

		step: function(dt){
			if(this.p.activated){
				if (this.p.x - 250 < Q.state.get("camera") && this.p.x + 250 >= Q.state.get("camera") &&
				 this.p.y - 400 < this.stage.y && this.p.y + 400 >= this.stage.y){
				 	if(!this.p.up) {this.p.y += 9; this.p.up = true;}
					this.p.sprite = "wheel_anim";
					this.sheet("wheelUp", true);
					this.play("spin");
					this.p.time +=dt;
					if (this.p.time >= 2 && this.p.shoots < 2){this.p.shoot = true;}
					if (this.p.shoots < 2 && this.p.shoot){
						Q.audio.play("enemyShoot.mp3");
						++this.p.shoots;
						this.p.shoot = false;
						// Las balas se disparan en direcciones inversas
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x + 20, y: this.p.y, vx: 250, vy: 250}));
						this.stage.insert(new Q.WheelBullet({x: this.p.x - 20, y: this.p.y, vx: -250, vy: 250}))
						this.stage.insert(new Q.WheelBullet({x: this.p.x, y: this.p.y+20, vy: 250}));
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
					if (random_number <= 5 || (this.p.x - 250 < Q.state.get("camera") && this.p.x + 250 >= Q.state.get("camera"))){
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

	// Sprite del enemigo Shark
	Q.Sprite.extend("Shark", {
		init: function(p){
			this._super(p, {
				asset: "shark.png",
				vx: -100,
				tick: 100, //usado para el movimiento sinusoidal
				sensor: true,
				collisionMask: Q.SPRITE_FRIENDLY && Q.SPRITE_MEGAMAN,
				type: Q.SPRITE_ENEMY,

			});
			this.add('2d, animation, DefaultEnemy, Stats');
			this.setStats(2, 3, false);
			// Si choca con Megaman, explota
			this.on("hit", function(collision){
		    	if(collision.obj.isA("Megaman")){
					this.Dead();
		    	}
		    });
		},

			step: function(dt){
				++this.p.tick;
				this.p.vy = 170 * Math.sin(this.p.tick * 0.1); // creamos un movimiento sinusoidal
				if (this.p.vx == 0) // si choca contra algo y se para, explota
					this.Dead();
			},

			Dead: function(){
				this.dropItem();
				// Al morir, el enemigo explota en varias direcciones
				this.stage.insert(new Q.Explosion({x: this.p.x + 20, y: this.p.y, vx: 150}));
				this.stage.insert(new Q.Explosion({x: this.p.x - 20, y: this.p.y, vx: -150}));
				this.stage.insert(new Q.Explosion({x: this.p.x + 20, y: this.p.y, vx: 150, vy: -150}));
				this.stage.insert(new Q.Explosion({x: this.p.x - 20, y: this.p.y, vx: -150, vy: -150}))
				this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y-20, vy: -150}));
				this.destroy();
			}
	});

	// Sprite de explosión
	Q.Sprite.extend("Explosion", {
		init: function(p){
			this._super(p, {
				sensor: true,
				sprite: "explosion_anim",
				sheet:"enemiesExplosion",
				gravity:0,
				collisionMask: Q.SPRITE_FRIENDLY,
				type: Q.SPRITE_PARTICLE
			});
			this.add('2d,animation, Stats');
			this.on("exploded", this, "destroy"); // una vez termina la animacion de explotar, se destruye
		    this.setStats(100, 2, true);

		    this.on("hit", function(collision){
		    	// Si la explosion choca con Megaman, le quita vida
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

	// Sprite del enemigo Fireball
	Q.Sprite.extend("FireBall", {
		init: function(p){
			this._super(p, {
			collisionMask: Q.SPRITE_FRIENDLY && Q.SPRITE_MEGAMAN,
			type: Q.SPRITE_ENEMY,
			sprite: "fireball_anim",
			sheet: "fireBall",
			sensor: true,
			dx: 0,
			timeascending:1.6, // tiempo que asciende al ser creado
			ascending: true,
			gravity:0
		});
			this.add('2d,animation, DefaultEnemy, Stats');
			this.setStats(1, 1, false);
			this.on("hit", function(collision){
		    	if(collision.obj.isA("Megaman")){ // Al chocar con Megaman
					this.AutoDestruct(); // se destruye
					this.stage.insert(new Q.Explosion({x: this.p.x + 20, y: this.p.y})); // agrega una explosion
		    	}
		    });
		},

		step: function(dt){
			this.play("fly");
			this.p.timeascending -= dt; // se va restando dt al tiempo ascendiendo
			if(this.p.timeascending > 0)
				// si sigue siendo mayor que 0, asciende
				this.p.y -= 5;
			else{
				// Si se acaba el tiempo, se quita la condición
				if(this.p.ascending){
					this.p.ascending = false;
					this.p.x += this.p.dx; // se desplaza unos pixeles a la derecha para no quedar en linea horizontal
				}
				this.p.y += 1;
			}
			if (this.p.x > this.stage.x)
				this.p.x -= 0.4;
			else
				this.p.x += 0.4;
			if (this.p.y > this.stage.y + 430)
				// si se salen de pantalla, se destruyen los enemigos
				this.destroy();
		},

		AutoDestruct: function(){
			this.destroy();
		},

		Dead: function(){
			this.dropItem();
			this.destroy();
		}
	});

	// Sprite de la llama que lanza el enemigo final
	Q.Sprite.extend("BigFlame", {

		init: function(p){
			this._super(p, {
				megaAttack: false,
				type: Q.SPRITE_PARTICLE,
				sprite: "flame_anim",
				sheet: "bigFlame",
				sensor: true,
				gravity: 0,
				collisionMask: Q.SPRITE_FRIENDLY,
				time: 0,
				originalvx: 0
			});

			this.add('2d, animation, DefaultEnemy, Stats');
			this.setStats(1, 2, true);

			this.on("hit", function(collision){
		    	if(collision.obj.isA("Megaman")){
					collision.obj.HITTED(this.power);
					collision.obj.explode();
					this.destroy();
		    	}
		    });
		},

		step: function(dt){
			if(!this.p.megaAttack){
				this.p.time += dt;
				if(this.p.time < 1/2)
					this.p.vx = 0;
				else
					this.p.vx = this.p.originalvx;
				this.play('throw_flame');
				if(this.p.originalvx > 0)
					this.p.flip = 'x';
			}
			else{
				this.play('throw_flame');
			}
			if (this.p.x < Q.state.get("camera") - 250){
				this.destroy();
			}
		},

	});

	//ENEMIGO FINAL
	Q.Sprite.extend("FireMan", {

		init: function(p){
			this.nextMegaShoot = Math.floor((Math.random() * 8) + 5);
			this.relativePos = 0;	
			this.moving = false;
			this.timeMoving = 0;
			this.TimeToMove = 0;
			
			this._super(p, {
				gravity: 2/3,
				type: Q.SPRITE_FIREMAN,
				sprite: "fireman_anim",
				sheet: "fireStill",
				sensor: true,
				shooted: 0,
				shoot: 0,
				timeAlive: 0,
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE //Para que solo le toquen las balas y el escenario
			});
			this.add('2d, aiBounce, animation, DefaultEnemy, Stats');
			this.setStats(40, 3, false);
			this.on('shooted', this, 'shoot');
			
		},

		step: function(dt){
			
			Q.state.set({ healthF: Math.round(this.health/2)});
			this.p.timeAlive += dt;
			if(this.p.timeAlive > 2){
				this.p.shoot += dt;
				this.relativePos = this.p.x - this.stage.x;
				if(this.p.vy == 0){
					//Megaman esta cerca del enemigo
					if ((Math.abs(this.relativePos) <= 235) && !this.moving){
						this.p.vx = 0
						//Hacemos que mire hacia
						if (this.relativePos >= 0){
							this.p.flip = '';
						}
						else if (this.relativePos < 0){
							this.p.flip = 'x';
						}

						//Si esta quieto, dispara una bola de fuego cada 3 seg
						if (this.p.shoot > 1){
							this.play('punch_left');
						}	
						else{
							this.play('stand_left');
						}
					}
					//Megaman esta fuera del alcance del enemigo, luego movemos al fireman 
					else if((Math.abs(this.relativePos) > 235 ) || this.moving){
						this.timeMoving += dt;
						if(!this.moving)
							this.startMoving();

						if(this.timeMoving >= this.TimeToMove)
							this.stopMoving();
						//Movemos a la izquierda
						if (this.relativePos >= 0){
							this.p.flip = '';
							this.p.vx = -100;
						}
						//Movemos a la derecha
						else if (this.relativePos < 0){
							this.p.flip = 'x';
							this.p.vx = 100;
						}

						//Cuando fireman esta en movimiento, dispara una bola de fuego por segundo
						if (this.p.shoot > 2){
							this.play('punch_left');
						}
						else{
							this.play('run_left');
						}
					}
					if((Math.round(this.p.timeAlive%4) == 1) && (Math.floor((Math.random() * 5) + 1) == 4)){
						this.moving = false;
						this.p.vy = -400;
						if (this.relativePos >= 0){
							this.p.vx = -300;
						}
						else
							this.p.vx = 300;
					}
						 
				}
				else{
					if(this.p.vx >= 0 )
						this.p.flip = "x";
					else
						this.p.flip = "";
					this.play("jump_left");
				}

				
				//Cada 8 disparos, dispara llamas en todas direcciones
				if (this.p.shooted == this.nextMegaShoot){
					this.nextMegaShoot = Math.floor((Math.random() * 8) + 5);
					this.megaShoot();
				}		
			}
		},

		startMoving: function(){
			this.moving = true;
			this.TimeToMove = Math.floor((Math.random() * 3/2) + 1/2);
		},

		stopMoving: function(){
			this.moving = false;
			this.timeMoving = 0;
			this.TimeToMove = 0;
		},

		shoot: function(){
			Q.audio.play('fire.mp3');

			//Movemos a la izquierda
			if (this.relativePos >= 0){
				this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, originalvx: -350}));
			}
			//Movemos a la derecha
			else if (this.relativePos < 0){
				this.stage.insert(new Q.BigFlame({x: this.p.x + 20, y: this.p.y, originalvx: 350}));
			}

			this.p.shoot = 0;
			++this.p.shooted;
		},

		// Ataque especial
		megaShoot: function(){
			Q.audio.play('fire.mp3');
			this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, vx: -100, vy: -80, angle: 40, megaAttack: true}));
			this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, vx: -100, vy: -40, angle: 20, megaAttack: true}));
			this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, vx: -100, vy: -140, angle: 60, megaAttack: true}));
			this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, vx: 100, vy: -140, angle: 120, megaAttack: true}));
			this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, vx: 100, vy: -80, angle: 140, megaAttack: true}));
			this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, vx: 100, vy: -40, angle: 160, megaAttack: true}));
			this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, vx: 180, angle: 180, megaAttack: true}));
			this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, vx: -180, megaAttack: true}));
			this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, vy: -180, angle: 90, megaAttack: true}));
			this.p.shooted = 0;
		},

		// Al morir, crea explosiones en diversas direcciones
		Dead: function(){

			Q.state.set({ healthF: this.health = 0});
			Q.audio.stop();
			this.stage.insert(new Q.endingItem({x: this.p.x, y: this.p.y}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vx: 100, vy: -100}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vx: -100, vy: -100}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vx: -100, vy: 100}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vx: 100, vy: 100}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vx: 100}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vy: -100}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vx: -100}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vy: 100}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vx: 150}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vy: -150}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vx: -150}));
			this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y, vy: 150}));
			this.destroy();
		}
	});

	// Generador de enemigos Fireball
	Q.Sprite.extend("SpawnerFireBall",{
		init: function(p){
        	this._super(p, {
        		num: 3, // número de enemigos a generar de una vez
        		time:0, // variable utilizada para crearlos cada cierto tiempo
        		frec: 10 // frecuencia en segundos a la que se crean estos enemigos
        	});
        },
        step: function(dt){
        	this.p.time -=dt; // se resta el dt y cuando llegue a 0 volvemos a crear
        	if(this.p.time <= 0){
        		var i;
        		var j = 0;
        		var time = 2;
        		for(i= 0; i < this.p.num; ++i){
        			this.stage.insert(new Q.FireBall({x:this.p.x, y: this.p.y+j-100, timeascending: time , dx: j}))
        			j += 40; // una vez dejan de ascender se recolocan para que no estén todos en fila vertical
        			time += 0.1; // cada uno asciende una centésima más porque se inserta más abajo
        		}
        		this.p.time = this.p.frec;
        	}
        }
	});

	// Generador de enemigos Shark
	Q.Sprite.extend("SpawnerShark",{
		init: function(p){
        	this._super(p, {
        		// Con las siguientes 4 variables se crea una especie de rectángulo invisible
        		// Si Megaman se encuentra dentro de ese rectángulo se generarán enemigos contra él
        		intervalTop: 0, 
        		intervalBot: 0,
        		intervalLeft: 0,
        		intervalRight: 0,
        		time:0,
        		frec: 5 // frecuencia a la que se crean los enemigos
        	});
        },
        step: function(dt){
        	this.p.time -=dt;
        	if(this.p.time <= 0){
        		if(this.stage.y > this.p.intervalTop && this.stage.y < this.p.intervalBottom
        			&& Q.state.get("camera") > this.p.intervalLeft && Q.state.get("camera") < this.p.intervalRight){
        			// Los enemigos se generan a la derecha de la cámara y a la misma altura que Megaman
        			this.stage.insert(new Q.Shark({x:Q.state.get("camera") + 300, y: this.stage.y}))
        			this.p.time = this.p.frec;
        		}
        	}
        }
	});
}
