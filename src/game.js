 
var game = function(){

var Q = Quintus({development: true})
        .include("Scenes, Input, Sprites, UI, Touch, TMX, Anim, 2D")
        .setup({width: 320, height:480})
        .controls().touch()

//************
// Load assets
//*********************
Q.load(["mario_small.png","mario_small.json",
        "goomba.png","goomba.json",
        "bloopa.png","bloopa.json",
        "princess.png",
        "mainTitle.png"], function(){
  Q.compileSheets("mario_small.png", "mario_small.json");
  Q.compileSheets("goomba.png", "goomba.json");
  Q.compileSheets("bloopa.png", "bloopa.json");
  Q.sheet("mainTitle", "mainTitle.png", {tilew: 320, tileh:480});
  Q.stageScene("mainTitle");
});

//************
// Load TMX level
//*********************
Q.loadTMX("level.tmx, tiles.png", function(){
  Q.stageScene("mainTitle");
});

//************
// Scene main title
//*********************
Q.scene("mainTitle", function(stage){
  var mainTitle = new Q.Sprite({ sheet: "mainTitle" });
  var button = stage.insert(new Q.UI.Button({ x: 0, y: 0, w:320, h:480}));

  //Queda hacer que pulsando enter tambien pueda entrar
  mainTitle.center();
  button.center();
  stage.insert(mainTitle);

  button.on("click", function(e){
      Q.clearStages();
      Q.stageScene("level1");
  });
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
  stage.insert(new Q.Princess({x: 700, y:500}));

});

//************
// Scene endGame
//*********************
Q.scene("dialog", function(stage){
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play Again" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene(stage.options.sceneToGo);
  });
  box.fit(20);
});



//************
// Mario
//*********************
Q.Sprite.extend("Mario", {
  init: function(p){
    this._super(p,{
      sheet: "marioR",
      sprite: "marioAnimations",
      x: 150,
      y: 500
      
    });

    this.add('2d, platformerControls, animation');
    
    Q.input.on("keydown", this, "move");
    this.on("jump", this, "jump");
    this.on("jumped", this, "jumped");
    this.on("hit.sprite", this, "arrivesToPrincess");
  },

  move: function(key){
    var keydown = Q.input.keys[key];
    if (keydown == "left"){
      this.play("walk_left");
    }
    else if (keydown == "right"){
      this.play("walk_right"); 
    }
  },

  jump: function(){
    if (this.p.direction == "left"){
      this.play("jump_left");
    }
    else if (this.p.direction == "right"){
      this.play("jump_right");
    }
  },

  jumped: function(){
    if (this.p.direction == "left"){
      this.play("stand_left");
    }
    else if (this.p.direction == "right"){
      this.play("stand_right");
    }
  },

  arrivesToPrincess: function(collision){
    if (collision.obj.isA("Princess")){
      Q.stageScene("dialog",1, { label: "You win", sceneToGo: "mainTitle"});
      this.del('platformerControls');
    }
  },

  step: function(dt){
    if (this.p.y > 600){
      Q.stageScene("mainTitle");
    }
  }

});

Q.animations('marioAnimations', {
  stand_right: {frames: [0], loop:false },
  stand_left: {frames: [14], loop:false },
  walk_right: {frames: [1,2,3], rate: 1/4, next: 'stand_right'},
  walk_left: {frames: [15,16,17], rate: 1/4, next: 'stand_left'},
  jump_right: {frames: [4], loop: false},
  jump_left: {frames: [18], loop: false},
  die: {frames: [13], loop:false}
});

//************
// Goomba
//*********************
Q.Sprite.extend("Goomba", {
  init: function(p){
    this._super(p,{
      sheet: "goomba",
      sprite: "goombaAnimations",
      x: 310,
      y: 500,
      vx: 80
    });

    this.add('2d, aiBounce, animation');

    this.play("walk");

    this.on("bump.left, bump.right", this, "hitPlayer");
    this.on("bump.top", this, "die");
    
  },

  hitPlayer: function(collision){
    if (collision.obj.isA("Mario")){
        Q.stageScene("dialog",1, { label: "You Died", sceneToGo: "mainTitle"});
        collision.obj.play("die");
        collision.obj.p.die = true;
        //collision.obj.p.ay = 2;
        //collision.obj.destroy();
      }
  },

  die: function(collision){
    if (collision.obj.isA("Mario")){
      this.play("die");
      this.p.die = true;
      this.p.deadTimer = 0;
    }
  },

  step: function(dt){
    if (this.p.die){
      this.p.deadTimer++;
      this.del('2d, aiBounce');
      if (this.p.deadTimer > 24){
        this.destroy();
      }
    }
  }


});

Q.animations('goombaAnimations', {
  walk: {frames: [0,1], rate: 1/2},
  die: {frames: [2], loop:false}
});

//************
// Bloopa
//*********************
Q.Sprite.extend("Bloopa", {
  init: function(p){
    this._super(p,{
      sheet: "bloopa",
      sprite:"bloopaAnimations",
      x: 330,
      y: 290,
      gravity: 0,
      vy: 80,
      direction: "down"
    });

    this.add('2d, animation');

    this.play("move");

    this.on("bump.left, bump.right, bump.bottom", this, "hitPlayer");
    this.on("bump.top", this, "die");
  },

  hitPlayer: function(collision){
    if (collision.obj.isA("Mario")){
      Q.stageScene("dialog",1, { label: "You Died", sceneToGo: "mainTitle"});
      collision.obj.play("die");
      collision.obj.p.die = true;
      collision.obj.p.ay = 2;
      //collision.obj.destroy();
      this.p.vy = this.p.vyAux;
    }
  },

  die: function(collision){
    if (collision.obj.isA("Mario")){
      this.play("die");
      this.p.die = true;
      this.p.deadTimer = 0;
    }
  },

  step: function(dt){

    if (this.p.die){
      this.p.deadTimer++;
      this.del('2d');
      if (this.p.deadTimer > 24){
        this.destroy();
      }
    }

    if (this.p.y >= 500 && this.p.direction == "down"){
      this.p.vy = -this.p.vy;
      this.p.direction = "up";
    }
    else if (this.p.y <= 300 && this.p.direction == "up" && !this.p.die){
      this.p.vy = -this.p.vy;
      this.p.direction = "down";
    }
    this.p.vyAux = this.p.vy;
  }
});

Q.animations('bloopaAnimations', {
  move: {frames: [0,1], rate: 1/2},
  die: {frames: [2], loop:false}
});

//************
// Princess
//*********************
Q.Sprite.extend("Princess", {
  init: function(p){
    this._super(p,{
      asset: "princess.png"
    });
    this.add('2d');
  }
});



}; 