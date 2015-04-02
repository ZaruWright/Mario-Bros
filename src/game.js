 
var game = function(){

var Q = Quintus({development: true})
        .include("Scenes, Input, Sprites, UI, Touch, TMX, Anim, 2D")
        .setup({width: 320, height:480})
        .controls().touch()

//************
// Load assets
//*********************
Q.load("mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json", function(){
  Q.compileSheets("mario_small.png", "mario_small.json");
  Q.compileSheets("goomba.png", "goomba.json");
  Q.compileSheets("bloopa.png", "bloopa.json");
});

//************
// Load TMX level
//*********************
Q.loadTMX("level.tmx, tiles.png", function(){
  Q.stageScene("level1");
});

//************
// Scene level1
//*********************
Q.scene("level1", function(stage){
  Q.stageTMX("level.tmx", stage);
  var mario = stage.insert(new Q.Mario());
  stage.add("viewport").follow(mario);
  stage.viewport.offsetX = -100;
  stage.viewport.offsetY = 155;

  //Enemies
  stage.insert(new Q.Goomba());
  stage.insert(new Q.Bloopa({x: 500, y:290}));

});

/*Q.animations('marioAnimations', {
  stand_left: {frames: }
});*/

//************
// Mario
//*********************
Q.Sprite.extend("Mario", {
  init: function(p){
    this._super(p,{
      sheet: "marioR",
      x: 150,
      y: 500,
      
    });

    this.add('2d, platformerControls');
  }

});

//************
// Goomba
//*********************
Q.Sprite.extend("Goomba", {
  init: function(p){
    this._super(p,{
      sheet: "goomba",
      x: 310,
      y: 500,
      vx: 80
    });

    this.add('2d, aiBounce');
    this.on("bump.left, bump.right", function(collision){
      if (collision.obj.isA("Mario")){
        collision.obj.destroy();
      }
    });
    this.on("bump.top", function(collision){
      if (collision.obj.isA("Mario")){
        this.destroy();
      }
    });
  }
});

//************
// Bloopa
//*********************
Q.Sprite.extend("Bloopa", {
  init: function(p){
    this._super(p,{
      sheet: "bloopa",
      x: 330,
      y: 290,
      gravity: 0,
      vy: 80,
      direction: "down"
    });

    this.add('2d');
    this.on("bump.left, bump.right, bump.bottom", function(collision){
      if (collision.obj.isA("Mario")){
        collision.obj.destroy();
      }
    });
    this.on("bump.top", function(collision){
      if (collision.obj.isA("Mario")){
        this.destroy();
      }
    });
  },

  step: function(dt){
    if (this.p.y >= 500 && this.p.direction == "down"){
      this.p.vy = -this.p.vy;
      this.p.direction = "up";
    }
    else if (this.p.y <= 300 && this.p.direction == "up"){
      this.p.vy = -this.p.vy;
      this.p.direction = "down";
    }
  }
});

}; 