 
var game = function(){

var Q = Quintus({development: true})
        .include("Sprites, Scenes, Input, Touch, UI, Anim, TMX")
        .setup("canvasGame")
        .controls().touch()




// Create a scene
Q.scene("level1", function(stage){
  Q.stageTMX("mario.tmx", stage);
  stage.add("viewport").centerOn(150,380);
});

// Load tmx level
Q.loadTMX("mario.tmx, mario1.png, mario2.png", function(){
  /*Q.sheet("tiles","tiles.png", {
    tilew: 34,
    tileh: 34,
  });*/
  Q.sheet("mario1","mario1.png", {
    tilew: 32,
    tileh: 32,
  });
  Q.sheet("mario2","mario2.png", {
    tilew: 32,
    tileh: 32,
  });
  Q.stageScene("level1");
});

};