 
var game = function(){

var Q = Quintus({development: true})
        .include("Scenes, Input, Sprites, UI, Touch, TMX, Anim, 2D")
        .setup({width: 320, height:480})
        .controls().touch()


// Load tmx level
Q.loadTMX("level.tmx, tiles.png", function(){
  Q.stageScene("level1");
});

// Create a scene
Q.scene("level1", function(stage){
  Q.stageTMX("level.tmx", stage);
  stage.add("viewport").centerOn(150,380);
});



}; 