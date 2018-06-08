
var initializeSpriteEnemies = function(Q){

	
	//SPRITE ROOMBA
	Q.Sprite.extend("Roomba",{

	 
		init: function(p) {

		 
		    this._super(p, {
		    	type: Q.SPRITE_ENEMY,
		    	sheet: "rotationRoomba",
		    	sprite: "armadilloAnim",
		    	vx: 100,
		    	h: 16
		    });
		    this.on("hit",function(collision){
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
	      this.p.vx = -col.impact;
	      if(this.p.defaultDirection === 'right') {
	          this.p.flip = 'x';
	      }
	      else {
	          this.p.flip = false;
	      }
	    },

	    goRight: function(col) {
	      this.p.vx = col.impact;
	      if(this.p.defaultDirection === 'left') {
	          this.p.flip = 'x';
	      }
	      else 
	          this.p.flip = false;
	     },

		step: function(dt) {

			if(this.alive){
				if(this.stage.y >= this.p.y -16 && this.stage.y <= this.p.y +16){
					this.vx = 500;
					this.play("fast");
				}
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

			this.setStats(4, 2, false);

			},

		step: function(dt){
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

			this.setStats(4, 2, false);

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

	Q.Sprite.extend("Shark", {
		init: function(p){
			this._super(p, {
				asset: "shark.png",
				vx: -100,
				tick: 100,
				sensor: true,
				collisionMask: Q.SPRITE_FRIENDLY,
				type: Q.SPRITE_ENEMY,

			});
			this.add('2d, animation, DefaultEnemy, Stats');
			this.setStats(2, 3, false);
			this.on("hit", function(collision){
		    	if(collision.obj.isA("Megaman")){
					this.Dead();
		    	}
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
				collisionMask: Q.SPRITE_FRIENDLY,
				type: Q.SPRITE_PARTICLE
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
			collisionMask: Q.SPRITE_FRIENDLY,
			type: Q.SPRITE_ENEMY,
			sprite: "fireball_anim",
			sheet: "fireBall",
			sensor: true,
			dx: 0,
			timeascending:1.6,
			ascending: true,
			gravity:0
		});
			this.add('2d,animation, DefaultEnemy, Stats');
			this.setStats(1, 1, false);
			this.on("hit", function(collision){
		    	if(collision.obj.isA("Megaman")){
					this.AutoDestruct();
					this.stage.insert(new Q.Explosion({x: this.p.x + 20, y: this.p.y}));
		    	}
		    });
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
			if (this.p.x > Q.state.get("camera"))
				this.p.x -= 0.2;
			else
				this.p.x += 0.2;
			if (this.p.y > this.stage.y + 430)
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

	//LLAMA QUE LANZA EL ENEMIGO FINAL
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
			this.setStats(40, 1, false);
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
					if ((Math.abs(this.relativePos) <= 180 )){
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
					else if((Math.abs(this.relativePos) > 180 )|| this.moving){
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
						this.p.vy = -400;
						if (this.relativePos >= 0){
							this.p.vx = -300;
						}
						else
							this.p.vx = 300;
					}
						 
				}
				else{
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
			this.TimeToMove = Math.floor((Math.random() * 5) + 1);
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
				this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y, originalvx: -300}));
			}
			//Movemos a la derecha
			else if (this.relativePos < 0){
				this.stage.insert(new Q.BigFlame({x: this.p.x + 20, y: this.p.y, originalvx: 300}));
			}

			this.p.shoot = 0;
			++this.p.shooted;
		},

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

		Dead: function(){
			Q.state.set({ healthF: this.health = 0});
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
        		var time = 2;
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
        			&& Q.state.get("camera") > this.p.intervalLeft && Q.state.get("camera") < this.p.intervalRight){
        			this.stage.insert(new Q.Shark({x:Q.state.get("camera") + 300, y: this.stage.y}))
        			this.p.time = this.p.frec;
        		}
        	}
        }
	});
}
