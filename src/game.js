 
var game = function(){

var Q = Quintus({development: true, audioSupported: ['ogg','mp3']})
        .include("Scenes, Input, Sprites, UI, Touch, TMX, Anim, 2D, Audio")
        .setup({width: 320, height:480})
        .controls().touch()
        .enableSound();

//************
// Collision mask
//*********************
Q.SPRITE_PLAYER = 1;
Q.SPRITE_ENEMY = 2;
Q.SPRITE_PRINCESS = 4;
Q.SPRITE_COLLECTABLE = 8;

//************
// Load assets
//*********************
Q.load(["mario_small.png","mario_small.json",
        "goomba.png","goomba.json",
        "bloopa.png","bloopa.json",
        "princess.png",
        "mainTitle.png",
        "coin.png", "coin.json",
        "music_die.mp3", "music_die.ogg",
        "coin.mp3", "coin.ogg",
        "music_level_complete.mp3", "music_level_complete.ogg",
        "music_main.mp3", "music_main.ogg",
        "kill_enemy.mp3", "kill_enemy.ogg",
        "jump_small.mp3", "jump_small.ogg",
        "koopa.gif"], function(){
  Q.compileSheets("mario_small.png", "mario_small.json");
  Q.compileSheets("goomba.png", "goomba.json");
  Q.compileSheets("bloopa.png", "bloopa.json");
  Q.compileSheets("coin.png", "coin.json");
  Q.sheet("mainTitle", "mainTitle.png", {tilew: 320, tileh:480});
  Q.sheet("koopa", "koopa.gif", {tilew: 32, tileh:48});
  Q.stageScene("mainTitle");
});

//************
// Load TMX level
//*********************
Q.loadTMX("level.tmx, level2.tmx, tiles.png", function(){
  Q.stageScene("mainTitle");
});

//************
// Scene main title
//*********************
Q.scene("mainTitle", function(stage){
  var mainTitle = new Q.Sprite({ sheet: "mainTitle" });
  var button = stage.insert(new Q.UI.Button({ x: 0, y: 0, w:320, h:480,keyActionName: "confirm"}));
  Q.state.reset({ score: 0, level:1, lives: 2 });

  mainTitle.center();
  button.center();
  stage.insert(mainTitle);

  button.on("click", function(e){
      Q.clearStages();
      Q.stageScene("level1");
  });

  Q.audio.play("music_main.mp3", {loop:true});
});

//************
// Scene level1
//*********************
Q.scene("level1", function(stage){
  Q.stageTMX("level2.tmx", stage);
  var mario = stage.insert(new Q.Mario());
  stage.add("viewport");
  stage.follow(mario);
  stage.viewport.offset(-100,155);

  //Enemies
  stage.insert(new Q.Koopa({x: 741,y: 528}));
  stage.insert(new Q.Goomba({x: 1240,y: 528}));
  stage.insert(new Q.Princess({x: 1981, y:528}));

  //Coins
  stage.insert(new Q.Coin({x: 508, y:430}));
  stage.insert(new Q.Coin({x: 642, y:350}));
  stage.insert(new Q.Coin({x: 761, y:290}));

  stage.insert(new Q.Coin({x: 1514, y:528}));
  stage.insert(new Q.Coin({x: 1614, y:528}));  
  stage.insert(new Q.Coin({x: 1714, y:528}));

  //Hud
  Q.stageScene("hud",2);

});

//************
// Scene level2
//*********************
Q.scene("level2", function(stage){
  Q.stageTMX("level.tmx", stage);
  var mario = stage.insert(new Q.Mario());
  stage.add("viewport");
  stage.follow(mario);
  stage.viewport.offset(-100,155);

  //Enemies
  stage.insert(new Q.Koopa({x: 761,y: 528}));
  stage.insert(new Q.Koopa({x: 1117,y: 528}));
  stage.insert(new Q.Goomba({x: 310,y: 500}));
  stage.insert(new Q.Goomba({x: 1850,y: 324}));
  stage.insert(new Q.Bloopa({x: 500, y:290}));
  stage.insert(new Q.Princess({x: 2000, y:290}));

  //Coins
  stage.insert(new Q.Coin({x: 200, y:450}));
  stage.insert(new Q.Coin({x: 300, y:450}));
  stage.insert(new Q.Coin({x: 400, y:450})); 

  //Hud
  Q.stageScene("hud",2);

});

//************
// Scene endGame
//*********************
Q.scene("dialog", function(stage){
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: stage.options.labelButton }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene(stage.options.sceneToGo);
  });
  box.fit(20);
});

//************
// Scene Hud
//*********************
Q.scene("hud", function (stage){

  var score = stage.insert(new Q.Score());
  score.p.label = "Coins: " + Q.state.p.score;
  score.p.x = 90;
  score.p.y = 30;
  var lives = stage.insert(new Q.Lives());
  lives.p.label = "Lives: " + Q.state.p.lives;
  lives.p.x = 210;
  lives.p.y = 30;

});

//************
// Coins Text
//*********************
Q.UI.Text.extend("Score",{
  init: function(p) {
    this._super({
      label: "Coins: 0",
      x: 0,
      y: 0
    });

    Q.state.on("change.score",this,"score");
  },

  score: function(score) {
    this.p.label = "Coins: " + score;
  }

});

//************
// Lives Text
//*********************
Q.UI.Text.extend("Lives",{
  init: function(p) {
    this._super({
      label: "Lives: value",
      x: 0,
      y: 0
    });

    Q.state.on("change.lives",this,"score");
  },

  score: function(lives) {
    this.p.label = "Lives: " + lives;
  }

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
      y: 500,
      jumpSpeed: -400,
      type: Q.SPRITE_PLAYER,
      collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_PRINCESS | Q.SPRITE_COLLECTABLE
    });

    this.add('2d, platformerControls, animation');
    
    Q.input.on("keydown", this, "move");
    this.on("jump", this, "jump");
    this.on("jumped", this, "jumped");
    this.on("hit.sprite", this, "hitObject");
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
    if (this.p.landed > -0.035){
      Q.audio.play("jump_small.mp3");
    }
    if (this.p.direction == "left"){
      this.play("jump_left");
    }
    else if (this.p.direction == "right"){
      this.play("jump_right");
    }
  },

  jumped: function(){
    if (this.p.direction == "left"){
      if (this.p.moved){
        this.play("walk_left");
      }
      else{
        this.play("stand_left"); 
      }
    }
    else if (this.p.direction == "right"){
      if (this.p.moved){
        this.play("walk_right");
      }
      else{
        this.play("stand_right"); 
      }
    }
  },

  hitObject: function(collision){
    if (collision.obj.isA("Princess")){
      Q.audio.stop();
      Q.audio.play("music_level_complete.mp3");
      if (Q.state.p.level == 1){
        Q.stageScene("dialog",1, { label: "Level 1 Completed!", sceneToGo: "level2", labelButton: "Next level"});
        Q.state.p.level++; 
      }
      else if (Q.state.p.level == 2){
       Q.stageScene("dialog",1, { label: "You win!", sceneToGo: "mainTitle", labelButton: "Play again"});  
      }
      
      this.del('platformerControls');
    }
    else if (collision.obj.isA("Coin")){
      Q.audio.play("coin.mp3");
      collision.obj.destroy();
      Q.state.inc("score",1);
    }
  },

  die: function(){
    if (!this.p.die){
      if (Q.state.p.lives > 0){
        if (Q.state.p.level == 1){
          Q.stageScene("dialog",1, { label: "You Died", sceneToGo: "level1", labelButton: "Try again"});
        }
        else if (Q.state.p.level == 2){
          Q.stageScene("dialog",1, { label: "You Died", sceneToGo: "level2", labelButton: "Try again"});  
        }
        Q.state.dec("lives",1);
      }
      else{
        Q.stageScene("dialog",1, { label: "You Died", sceneToGo: "mainTitle", labelButton: "Play again"});  
      }
      this.play("die");
      this.p.deadTimer = 0;
      this.del('platformerControls');
      this.p.ax = 100;
      Q.stage().unfollow();
      Q.audio.stop();
      Q.audio.play("music_die.mp3");
    }
    this.p.die = true;
  },

  step: function(dt){
    console.log("x: " + this.p.x);
    console.log("y: " + this.p.y);

    if (this.p.y > 600){
      //Q.stageScene("mainTitle");
      this.die();
    }

    if (this.p.die){
      this.p.deadTimer++;
      this.del('2d');
      if (this.p.deadTimer < 20){
        this.p.y -= 3;
      }
      else if (this.p.deadTimer >= 20 && this.p.deadTimer <= 60){
        this.p.y += 3;
      }
      if (this.p.deadTimer > 100){
        this.destroy();
      }
    }

    if (this.p.bounceTimer < 20){
      this.p.bounceTimer++;
      this.p.y -= 3;
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
  die: {frames: [12], loop:false}
});

//************
// Default enemy component
//*********************
Q.component("defaultEnemy", {
  added: function(){
    this.entity.on("bump.left, bump.right, bump.bottom", this, "hitPlayer");
    this.entity.on("bump.top", this, "die");
  },

  hitPlayer: function(collision){
    if (collision.obj.isA("Mario")){
      collision.obj.die();
    }
    else if (collision.obj.isA("Koopa") && collision.obj.p.hide && !collision.obj.p.stopped){
      this.die(collision);
    }
  },

  die: function(collision){
    if (collision.obj.isA("Mario") ||
        (collision.obj.isA("Koopa") && collision.obj.p.hide && !collision.obj.p.stopped)){
      this.entity.play("die");
      Q.audio.play("kill_enemy.mp3");
      this.entity.p.die = true;
      this.entity.p.deadTimer = 0;
      this.entity.p.bounceTimer = 0;
    }
  }
  

});

//************
// Goomba
//*********************
Q.Sprite.extend("Goomba", {
  init: function(p){
    this._super(p,{
      sheet: "goomba",
      sprite: "goombaAnimations",
      vx: 80,
      type: Q.SPRITE_ENEMY,
      collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY
    });

    this.add('2d, aiBounce, animation, defaultEnemy');

    this.play("walk");
    
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
      direction: "down",
      type: Q.SPRITE_ENEMY,
      collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY
    });

    this.add('2d, animation, defaultEnemy');

    this.play("move");
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
// Koopa
//*********************
Q.Sprite.extend("Koopa", {
  init: function(p){
    this._super(p,{
      sheet: "koopa",
      sprite:"koopaAnimations",
      x: 330,
      y: 290,
      vx: 80,
      invencibleTime: 0,
      type: Q.SPRITE_ENEMY,
      collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY
    });

    this.add('2d, animation, aiBounce');
    this.on("bump.top", this, "shell");
    this.on("bump.left, bump.right, bump.bottom", this, "hit");
    
  },

  hit: function(collision){
   if (collision.obj.isA("Mario") || 
       collision.obj.isA("Goomba") || 
       collision.obj.isA("Bloopa") || 
       collision.obj.isA("Koopa")){
      if (this.p.stopped){
        if (collision.obj.p.vx < 0){
          this.p.vx = -80;
        }
        else if (collision.obj.p.vx > 0){
          this.p.vx = 80;
        }
        this.p.stopped = false;
        this.p.invencibleTime = 0.2;
        Q.audio.play("kill_enemy.mp3");
      }
      else{
        if (this.p.invencibleTime <= 0 && collision.obj.isA("Mario")){
          collision.obj.die();
        }
      }
    }
  },

  shell: function(collision){
    Q.audio.play("kill_enemy.mp3");
    this.play("shell");
    this.p.vx = 0;
    this.p.stopped = true;
    this.p.hide = true;
    this.p.revive = 5;
    collision.obj.p.bounceTimer = 0;
  },

  step: function(dt){
    if (this.p.invencibleTime > 0){
      this.p.invencibleTime -= dt;
    }

    this.p.revive -= dt;
    if (this.p.revive <= 0 && this.p.hide && this.p.stopped){
      this.p.hide = false;
      this.p.stopped = false;
      this.p.vx = 80;
      this.play("revive");
    }

    if (this.p.vx < 0 && !this.p.hide){
      this.play("walk_left");
    }
    else if (this.p.vx > 0 && !this.p.hide){
      this.play("walk_right");
    }
    else if (this.p.hide){
      this.play("shell");
    }
  }
});

Q.animations('koopaAnimations', {
  walk_left: {frames: [4,5], rate: 1/2},
  walk_right: {frames: [0,1], rate: 1/2},
  shell: {frames : [8]},
  revive: {frames: [8,9], rate: 1/2}
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

//************
// Coin
//*********************
Q.Sprite.extend("Coin", {
  init: function(p){
    this._super(p,{
      sheet: "coin",
      sprite: "coinAnimation",
      gravity: 0,
      type: Q.SPRITE_COLLECTABLE,
      collisionMask: Q.SPRITE_PLAYER
    });
    this.add('2d, animation');
    this.play('rotate');

  }
});

Q.animations('coinAnimation', {
  rotate: {frames: [0,1,2], rate: 1/3}
});

}; 