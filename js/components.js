	
var initializeComponents = function(Q){
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
}