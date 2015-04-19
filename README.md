# Mario Bros

Hello! these last weeks I've been developing Mario Bros game with the engine game Quintus.

I tell you the behaviours that I have Implemented.

* Firstly, I did a level with the map editor Tiled. If you want to create your level and after insert it into my game, you must create in the properties of the layer the follow variable "collision = true". Later I created a scene to insert the tmx level. For load the game I have to load with the loadtMX method with the TMX Quintus module.

* As you know, the main character of this game, is the red plumber called Mario and obviously he has to appear into the game. To do this, I extended to the Sprite class to create our main character and in the scene that I inserted the tmx before, I did that the viewport follows Mario with an offset.

* In the Mario world there are a lot of enemies that mario have to defeat, by this, I created Goombas and Bloopas to try the majority of the game. To do this I extended to the Sprite class ,like before, to create the Goomba class and the Bloopa class. This enemies have a lot of behavior in common, by this, I created a component called enemyDefault, that simulate the behaviour of die and hit mario. 

* The next behavior was the finish game screen and the win game screen. Mario can die by different ways: Falling to the void and hit by an enemy, in these cases it appears a dialog telling us that we've lose the game. To win the game, Mario has to arrive to the princess, that is to say, If mario hit the princess, you will win the game. To do this we used the UI quintus module to create a box and within it a text.

* All games in the present have a main title, then I created it also. The main title is a scene that listen two types of events, a click in the canvas, and press the enter key.

* The following was the animations in the characters (and objects posteriority) with the Anim Quintus module. This doesn't have any mistery, you can follow the steps that Quintus give you to do this. this is the URL if you want to have a look http://www.html5quintus.com/guide/animation.md#.VTKvGCe1FBd.

* To do something that mario could collect, I implemented the coins, that are very similar to the enemies and Mario. 

* To see the amount of coins that mario have been recollected, I did a scene that shows the value and it updates when the value changes.

* Finally, to finish the first revision, I inserted some sounds in the game. Maybe you discover some bug, because there are some times that the player hit an object or and enemy more than once, and for this could play the sound a lot of times.

# Improvements

When I finish more or less the game, I implemented other funcionalities:

* Two levels: I did two levels to simulate more or less a game. Now if I want to create more levels, only I will add some code to create other scene and the next level.

* Other enemy, Koopa: I think that is an enemy with a lot of funcionality, and by this reason I implemented it. Do it is very easy, like other enemies, but you have to think a little in its behaviour.

* In the hud before only appear the coins, now also appear the lives that mario has. If you died in the second level and you have lives, you appear in these level when you click to the button.

# Conclusion

I created this project because I will want to learn about component architecture and how must I use Quintus to develop my own games.

I hope that you like this game, and more important, that you learn something with my code. See you soon! Happy Coding!