// main.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

'use strict';

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 
 */
app.main = {
    
    
	//  properties
    WIDTH : 660, 
    HEIGHT: 480,
    canvas: undefined,
    ctx: undefined,
   	lastTime: 0, // used by calculateDeltaTime() 
    debug: true,
    
    gameState: undefined,
    //sound: undefined, // requires - loaded by main.js
    
    paused: false,
    animationID: 0,
    debug: true,
    
    GAME_STATE: { //  fake enumeration
        BEGIN: 0,
        PLAYING: 1,
        PAUSE: 2,
        ROUND_OVER: 3,
        REPEAT_LEVEL: 4,
        END: 5
    },
    
    player: {
        position: { x: undefined, y: undefined },
        color: 'red'
    },
    
    //walls: [], // temporarily hardcoded, to be read from file (not working) later
    walls: [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ],
    CELL_WIDTH: 30, // grid cell size in px
    MAP_COLORS: [
        'rgba(0,0,0,0)',    // (0) empty space
        '#000',             // (1) wall (black)
        '#fff',             // (2) panel (unpressed)
        '#333'              // (3) panel (pressed - once pressed, can only be let up by reaching a door or pressing another panel)
    ],
    
    
    // methods
	init : function() {
		console.log("app.main.init() called");
		// initialize properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');        
        
       // load sprites
        this.loadSprites();
        
        // hook up events
       
        
        // load level
        //this.loadMap('map_0.txt');
        //this.reset();
        
		// start the game loop
		this.update();
	},
    
    reset: function(){
        // read in map
        this.loadMap('map_0.txt');
    },
	
	update: function () {
		// LOOP
		// schedule a call to update()
	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	
	 	// PAUSED?
	 	// if so, bail out of loop
        //if(this.paused){
        //    this.drawPauseScreen(this.ctx);
        //    return;
        //}
 	 
	 	// UPDATE
        
        
        // CHECK FOR COLLISIONS
        //this.checkForCollisions();
        // TO DO CHECK IF WALLS OR DOORS NEXT TO PLAYER

		// DRAWING GOES UNDER HERE
		// 1-Background
		this.ctx.fillStyle = "#6495ED";
        this.ctx.fillRect(0,0,this.WIDTH, this.HEIGHT);
        
        // Draw map
        //this.drawMap(this.walls); // ERROR:? executing before loadMap is done?
        // for now hardcode all the walls
        this.drawWalls();
	   
        // Draw sprites
        this.drawSprites();
        
		// Draw HUD
		
	},
    
    loadSprites: function() {
        // call function constructors here
        
        this.player.position.x = this.WIDTH / 2;
        this.player.position.y = this.HEIGHT / 2;
        
    },
    
    drawSprites: function(){
        // call draw functions here
        
        // drawing square for now
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.position.x,this.player.position.y,30,30);
        
    },
    
    // MAP LOADING (transfer to utlities?)
    loadMap: function(path){
        var xhr = new XMLHttpRequest();
        
        xhr.onload = function(){
            var response = xhr.responseText;
            var gridArray = response.split('\n');
            for(var i=0;i<gridArray.length;i++){
                var line = gridArray[i];
                gridArray[i]= line.split(',');
            }
            
            this.walls = gridArray;
            console.log(this.walls);
            //draw walls here?
        }
       
        
        xhr.open('GET',path,true);
        
        // try to prevent browser caching by sending a header to the server
        xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2010 00:00:00 GMT");
        xhr.send();
    },
    
    drawMap: function(map) {
        //debugger;
        for (var i=0; i<16; i++) { // hardcoded number of rows canvas HEIGHT / CELL_WIDTH
            var inner = map[i];
            for (var j=0; j<22; j++) {
                var value = inner[j]; // ERROR: map[i][j] = undefined (the j at that i)?? then bailing out
                
                this.ctx.fillStyle = this.MAP_COLORS[value]; // set to the correct color
                this.ctx.fillRect(i * this.CELL_WIDTH, j * this.CELL_WIDTH, this.CELL_WIDTH, this.CELL_WIDTH);
            } // end j for
        } // end i for
    },
    
    drawWalls: function(){
        for (var i=0; i<this.walls.length; i++){
            switch(this.walls[i]){ // block type
                case 0:
                    break;
                case 1:
                    this.ctx.fillStyle =  '#000'; // Black Walls
                    this.ctx.fillRect((i%22)*this.CELL_WIDTH, (Math.floor(i/22)) * this.CELL_WIDTH, this.CELL_WIDTH, this.CELL_WIDTH);
                    break;
                case 2:
                    this.ctx.fillStyle =  '#000'; // Black Walls
                    this.ctx.fillRect((i%22)*this.CELL_WIDTH, (Math.floor(i/22)) * this.CELL_WIDTH, this.CELL_WIDTH, this.CELL_WIDTH);
                    break;
            }
        }
    }
    
    
    
}; // end app.main

// Add later: 
//      timers to complete level
//      Switches with different effects
//      tutorial level