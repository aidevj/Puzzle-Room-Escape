"use strict";

var app = app || {};

// initialize image sources
app.imagePaths = [
    "assets/floor.png",
    "assets/wall.png",
    "assets/panel.png",
    "assets/door.png",
    "img/playerStill.png"
 ];

window.onload = function(){
	console.log("window.onload called");
    
    // hook up modules
    //app.sound.init();
    app.main.sound = app.sound;
    //app.main.myKeys = app.myKeys;
    app.main.AnimatedSprite = app.AnimatedSprite;
    app.main.imagePaths = app.imagePaths;
    
	app.main.init();
};
window.onblur = function() {
    console.log("blur at " + Date());
    app.main.paused = true;
    
    // stop the animation loop
    cancelAnimationFrame(app.main.animationID);
    
    // call update() once so taht our paused screen gets drawn
    app.main.update();
};

window.onfocus = function() {
    console.log("focus at " + Date());
     
    // stop the animation loop, just in case it's running
    cancelAnimationFrame(app.main.animationID);

    app.main.paused = false;
    
    // restart the loop
    app.main.update();
};