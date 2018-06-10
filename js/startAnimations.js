var startAnimations = function(Q){
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
		dissapear: { frames: [16], rate: 1/3, loop: true},
	});

	// Animaciones de la entrada al nivel de Megaman
	Q.animations('fall_anim', {
		fall: {frames: [0], rate: 1/2, loop: true},
		up: {frames: [1,0,2], rate: 1/8, loop:false, trigger: 'ready'}
	});

	// Animaciones de Megaman al ser golpeado
	Q.animations('megaDie_anim',{
		mega_die: {frames: [3,2,1,0], rate: 1/4, loop: false, trigger: 'endExplode'}
	});

	// Animaciones del enemigo Wheel
	Q.animations('wheel_anim',{
		spin: { frames: [0,1,2], rate: 1/2, loop: false}
	});

	// Animaciones del enemigo Wheel cuando está bajo
	Q.animations('wheel_down',{
		down: {frames: [0],loop: true}
	});

	// Animaciones del enemigo Fireball
	Q.animations('fireball_anim',{
		fly: {frames: [0,1], rate: 1/2, loop: true}
	});

	// Animaciones de explosión
	Q.animations('explosion_anim', {
		explode: {frames: [0,1,2], rate: 1/4, loop:false, trigger:'exploded'}
	});

	// Animaciones de Megaman al ser golpeado
	Q.animations('megamanHit_anim',{
		megaHit: {frames: [0,1,0,1], rate: 1/4, loop: false, trigger:"endHit"}
	});

	// Animaciones del Roomba
	Q.animations('armadilloAnim',{
		slow: {frames: [0,1], rate:1/2},
		fast: {frames: [0,1], rate:1/4}
	});

	// Animaciones de la lava
	Q.animations('lava_anim',{
		move: {frames: [0,1,2], rate: 1/2, loop: true}
	});

	// Animaciones de la barra de fuego horizontal pequeña
	Q.animations('fireBar_anim',{
		miniFlame: {frames: [0,1], rate: 1/2}
	});

	// Animaciones de la barra de fuego horizontal activada
	Q.animations('fireH_anim', {
		flameH: {frames: [0,1], rate: 1/5}
	});

	// Animaciones de los botiquines
	Q.animations('powerUp_Anim', {
		still: {frames: [0,1], rate: 1/3}
	});

	// Animaciones del objeto que se coge al final del nivel para que salga la pantalla de créditos
	Q.animations('endingItem_Anim', {
		still: {frames: [0,1], rate: 1/3}
	});

	// Animaciones de la barra de fuego vertical
	Q.animations('verticalFire_Anim', {
		still: {frames: [0,1,2], rate: 1/4}
	});

	// Animaciones de las puertas
	Q.animations('doors_anim', {
		open: {frames: [0,1,2,3,4], rate: 1/2, loop:false, trigger: 'opened'},
		close: {frames: [4,3,2,1,0], rate: 1/2, loop: false, trigger: 'closed'}
	});

	// Animaciones del enemigo final
	Q.animations('fireman_anim', {
		stand_left: { frames: [0,1], rate: 1/4, loop: true}, 
		run_left: { frames: [5,6,7], rate: 1/4},
		jump_left: {frames: [4], rate: 1/2},
		fight_left: {frames: [2,3], rate: 1/2, loop: false},
		punch_left: {frames:[8,9], rate: 1/4, loop: false, trigger: 'shooted'},
		defense: {frames:[10], rate:1/4}
	});

	// Animaciones del atauqe del enemigo final
	Q.animations('flame_anim', {
		throw_flame: {frames:[0,1,2], rate:1/3, loop: true}
	});
}