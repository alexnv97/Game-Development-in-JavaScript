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

	Q.animations('fall_anim', {
		fall: {frames: [0], rate: 1/2, loop: true},
		up: {frames: [1,0,2], rate: 1/8, loop:false, trigger: 'ready'}
	});

	Q.animations('megaDie_anim',{
		mega_die: {frames: [3,2,1,0], rate: 1/4, loop: false, trigger: 'endExplode'}
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
		explode: {frames: [0,1,2], rate: 1/4, loop:false, trigger:'exploded'}
	});

	Q.animations('megamanHit_anim',{
		megaHit: {frames: [0,1,0,1], rate: 1/4, loop: false, trigger:"endHit"}
	});

	Q.animations('armadilloAnim',{
		slow: {frames: [0,1], rate:1/2},
		fast: {frames: [0,1], rate:1/4}
	});

	Q.animations('lava_anim',{
		move: {frames: [0,1,2], rate: 1/2, loop: true}
	});

	Q.animations('fireBar_anim',{
		miniFlame: {frames: [0,1], rate: 1/2}
	});

	Q.animations('fireH_anim', {
		flameH: {frames: [0,1], rate: 1/5}
	});

	Q.animations('powerUp_Anim', {
		still: {frames: [0,1], rate: 1/3}
	});

	Q.animations('endingItem_Anim', {
		still: {frames: [0,1], rate: 1/3}
	});

	Q.animations('verticalFire_Anim', {
		still: {frames: [0,1,2], rate: 1/4}
	});

	Q.animations('doors_anim', {
		open: {frames: [0,1,2,3,4], rate: 1/2, loop:false, trigger: 'opened'},
		close: {frames: [4,3,2,1,0], rate: 1/2, loop: false}
	});

	Q.animations('fireman_anim', {
		stand_left: { frames: [0,1], rate: 1/4, loop: true}, 
		run_left: { frames: [5,6,7], rate: 1/4},
		jump_left: {frames: [4], rate: 1/2},
		fight_left: {frames: [2,3], rate: 1/2, loop: false},
		punch_left: {frames:[8,9], rate: 1/2, loop: false},
		defense: {frames:[10], rate:1/4}
	});

	Q.animations('flame_anim', {
		throw_flame: {frames:[0,1,2], rate:1/3, loop: true}
	});
}