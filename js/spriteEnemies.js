
var initializeSpriteEnemies = function(Q){
	//SPRITE ROOMBA
	Q.Sprite.extend("Roomba",{

	 
		init: function(p) {

		 
		    this._super(p, {
		    	type: Q.SPRITE_ALL,
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

				if (this.p.x - 250 < this.stage.x && this.p.x + 250 >= this.stage.x &&
				 this.p.y - 450 < this.stage.y && this.p.y + 450 >= this.stage.y){
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

				if (this.p.x - 250 < this.stage.x && this.p.x + 250 >= this.stage.x &&
				 this.p.y - 400 < this.stage.y && this.p.y + 400 >= this.stage.y){
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
				asset: "shark.png",
				vx: -100,
				tick: 100,
				sensor: true,
				collisionMask: Q.SPRITE_FRIENDLY

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
			collisionMask: Q.SPRITE_FRIENDLY,
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
			if (this.p.x > this.stage.x)
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
			sprite: "flame_anim",
			sheet: "bigFlame",
			sensor: true,
			vx: -30
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
			this.play('throw_flame');
			if (this.p.x < this.stage.x - 40){
				this.destroy();
			}
		},
	});

	//ENEMIGO FINAL
	Q.Sprite.extend("FireMan", {

		init: function(p){
			this._super(p, {
			sprite: "fireman_anim",
			sheet: "fireStill",
			sensor: true,
			shoot: 0
		});
			this.add('2d, animation, DefaultEnemy, Stats');
			this.setStats(20, 1, false);
			
		},

		step: function(dt){

			this.play('stand_left');
			if (this.p.x <= this.stage.x + 200){
				if (this.p.shoot > 3){
					this.play('fight_left');
					++this.p.shooted;
					this.stage.insert(new Q.BigFlame({x: this.p.x - 20, y: this.p.y}));
					this.p.shoot = 0;
				}
				this.p.shoot += dt;
			}
		},

		Dead: function(){
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
        			&& this.stage.x > this.p.intervalLeft && this.stage.x < this.p.intervalRight){
        			this.stage.insert(new Q.Shark({x:this.stage.x + 300, y: this.stage.y}))
        			this.p.time = this.p.frec;
        		}
        	}
        }
	});
}
