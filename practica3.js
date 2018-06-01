


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
			upsampleWidth: 256,  // Double the pixel density of the 
  			upsampleHeight: 250,
			downsampleWidth: 1024, // Halve the pixel density if resolution
			downsampleHeight: 1000, // is larger than or equal to 1024x768
			scaleToFit: true,
			maximize: true
		}).controls().touch().enableSound();


	//Inicializamos sprites
	initializeSprites(Q);
	initializeStageSprites(Q);
	initializeSpriteEnemies(Q);
	
	//Inicializamos componentes
	initializeComponents(Q);

	//Definimos las animaciones	
	startAnimations(Q);

	//Definimos las escenas
	loadStages(Q);

	//Finalmente empezamos a cargar los archivos. Una vez carguen empieza el juego
	Q.load(["megaman.png", "megaman.json", "fireman.png", "fireman.json", "bullet.png",
		"roomba.png", "roomba.json", "wheel.png", "wheel.json", "fireball.png", "fireball.json",
		"explosion.png", "explosion.json", "shark.png", "lives.png", "lives.json",
		"lava1.png", "lava1.json", "lava2.png", "lava2.json", "horizontalfire.png",
		"horizontalfire.json", "firebar.png", "firebar.json", "powerUpP.png", "powerUpG.png", 
		"powerUpG.json", "OneUp.png", "lanzallamas.png", "title-screen.png", "bigflame.png", "bigflame.json",
		"title-screen-noletters.png", "endingItem.png", "endingItem.json","megaExplosion.png", "megaExplosion.json", 
		"invertedWheel.png", "invertedWheel.json", "doors.png", "doors.json", "falling.png", "finaldoors.png", "finaldoors.json",
		"falling.json", "verticalfire.png", "verticalfire.json", "blackTile.png",
		"1up.mp3", "disparo.mp3", "ending.mp3", "endingItemJingle.mp3", "enemyDamage.mp3", "enemyShoot.mp3", "EnergyFill.mp3",
		"epicDoors.mp3", "megamanDamage.mp3", "megamanDeath.mp3", "pressStart.mp3", "fireMan.mp3", "entraMegaman.mp3", "megaJump.mp3"],
		 function() {


		Q.compileSheets("megaman.png", "megaman.json");
		Q.compileSheets("roomba.png", "roomba.json");
		Q.compileSheets("wheel.png", "wheel.json");
		Q.compileSheets("fireball.png", "fireball.json");
		Q.compileSheets("explosion.png", "explosion.json");
		Q.compileSheets("lives.png", "lives.json");
		Q.compileSheets("lava1.png", "lava1.json");
		Q.compileSheets("lava2.png", "lava2.json");
		Q.compileSheets("horizontalfire.png", "horizontalfire.json");
		Q.compileSheets("firebar.png", "firebar.json");
		Q.compileSheets("powerUpG.png", "powerUpG.json");
		Q.compileSheets("endingItem.png", "endingItem.json");
		Q.compileSheets("megaExplosion.png", "megaExplosion.json");
		Q.compileSheets("invertedWheel.png", "invertedWheel.json");
		Q.compileSheets("falling.png", "falling.json");
		Q.compileSheets("verticalfire.png", "verticalfire.json");
		Q.compileSheets("doors.png", "doors.json");
		Q.compileSheets("finaldoors.png", "finaldoors.json");
		Q.compileSheets("fireman.png", "fireman.json");
		Q.compileSheets("bigflame.png", "bigflame.json");
		//INICIALIZACION TMX
		Q.loadTMX(["FiremanStage.tmx", "credits.tmx"], function() {
			Q.state.reset({ health: 20, lives: 3});
			Q.stageScene("mainTitle");
			//Q.stageScene("level1");
		});


	});

	

}

