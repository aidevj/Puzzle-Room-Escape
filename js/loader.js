/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

// all source paths for assets
app.imagePaths = Object.freeze({
    playerImage: "img/samplesprite1.png",
    //tileImage: "img/tile.png"
 });

window.onload = function(){
	console.log("window.onload called");
    
    // hook up modules
    //app.sound.init();
    //app.main.sound = app.sound;
    //app.main.myKeys = app.myKeys;
	app.main.init();
};
/*
window.onblur = function() {
    console.log("blur at " + Date());
    app.main.pauseGame = true;
    
    // stop the animation loop
    cancelAnimationFrame(app.main.animationID);
    
    // call update() once so taht our paused screen gets drawn
    app.main.update();
};

window.onfocus = function() {
    console.log("focus at " + Date());
    app.main.resumeGame();
};*/