var loadStages = function(Q){
	

	//NIVEL 1
	Q.scene("level1", function(stage) {
		Q.audio.stop();
		Q.audio.play('fireMan.mp3',{ loop: true });

		Q.stageTMX("FiremanStage.tmx",stage);
		var x, y;
		if (Q.state.get("checkPoint2")){
			var player = stage.insert(new Q.Megaman({x:5170, y:0, vy: 200}));
			stage.add("viewport").follow(Q("Megaman").first(), { x: false, y:false });
			stage.centerOn(5395,450);
		}
		else if (Q.state.get("checkPoint")){
			var player = stage.insert(new Q.Megaman({x:2210, y:1100, vy: 200}));
			stage.add("viewport").follow(Q("Megaman").first(), { x: false, y:false });
			stage.centerOn(2320,1350);
		}
		else{
			var player = stage.insert(new Q.Megaman({x:250, y:400, vy: 200}));
			stage.add("viewport").follow(Q("Megaman").first(), { x: false, y:false });
			stage.centerOn(300,1350);
		}

		stage.insert(new Q.SpawnerFireBall({x:1200, y:1700}));
		stage.insert(new Q.SpawnerFireBall({x:2300, y:1700}));
		stage.insert(new Q.SpawnerFireBall({x:2800, y:1700}));
		stage.insert(new Q.SpawnerFireBall({x:4400, y:750}));
		stage.insert(new Q.SpawnerFireBall({x:4500, y:750}));
		stage.insert(new Q.SpawnerShark({intervalTop: 0, intervalBottom: 663, intervalLeft: 3247,
			intervalRight: 4160}));
		stage.insert(new Q.SpawnerShark({intervalTop: 665, intervalBottom: 1059, intervalLeft: 3178,
			intervalRight: 3473}));
		stage.insert(new Q.Puertas({x: 5120, y:448}));
		stage.insert(new Q.PuertasFinales({x: 6416, y: 448}));
	});

	//TITULO DEL JUEGO
	Q.scene("mainTitle", function(stage){
		Q.audio.play('pressStart.mp3',{ loop: true });
		stage.insert(new Q.Title());
		Q.state.reset({ health: 20, healthF: 20, checkPoint: false, checkPoint2: false, lives: 3, camera: 300});
		// Al pulsar enter o apretar el botón se va al nivel 1
		Q.input.on("confirm", function(){
			Q.clearStages();
			Q.audio.stop("pressStart.mp3");
			Q.stageScene('level1');
			Q.stageScene("HUD",1);
		});

	});

	//GAME OVER
	Q.scene('endGame',function(stage) {
		Q.audio.stop();
		Q.audio.play('ending.mp3',{ loop: true });
		Q.stageTMX("credits.tmx",stage);
		var player = stage.insert(new Q.WalkingMegaman({x:2508, y:258}));
		stage.add("viewport").follow(Q("WalkingMegaman").first(), { x: true, y:false });
	});

	//HUD
   Q.scene("HUD", function(stage) {
		var container = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0)" 
		}));
		stage.insert(new Q.Lives(),container);
	});

 	//HUD FIREMAN

 	Q.scene("HUDFire", function(stage){
 		var container = stage.insert(new Q.UI.Container({
 			x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0)"
 		}));
 		stage.insert(new Q.FireLives(), container);
 	})

}