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
        1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,1,
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
    MAP_COLORS: [ // maybe not use this? not needed right now since colors are hardcoded: see drawWalls
        'rgba(0,0,0,0)',    // (0) empty space
        '#000',             // (1) wall (black)
        '#fff',             // (2) panel (unpressed- once pressed, can only be let up by reaching a door or pressing another panel)
        '#0041aa'           // (3) Door/exit
    ],
    
    panelPressToggle: false, // false - off, true - on
    lastPressedPanel: { x: undefined, y: undefined },
    previousNonCollidingPos: { x: undefined, y: undefined },

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
	 	
	 	// PAUSE SCREEN
 	 
	 	// UPDATE
        
        // CHECK FOR COLLISIONS
        this.checkCollisions();
        // TO DO CHECK IF WALLS OR DOORS NEXT TO PLAYER

		// DRAWING GOES UNDER HERE
		// 1-Background
		this.ctx.fillStyle = "#6495ED";
        this.ctx.fillRect(0,0,this.WIDTH, this.HEIGHT);
        
        // Draw map
        //this.drawMap(this.walls); // ERROR:? executing before loadMap is done?
        // for now hardcode all the walls
        if (!this.panelPressToggle) {
            this.drawWalls();
        }
        
        // check lights off
        if (this.panelPressToggle) {
            this.lightsOff();
        }
        
        // Draw Grid lines
        this.drawGrid(); // Grid would not draw unless it was after walls??
	   
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
        // drawing square as player for now
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
    
    drawWalls: function(){ // misnomer: this also draws panels and doors for now
        for (var i=0; i<this.walls.length; i++){
            this.ctx.save();
            switch(this.walls[i]){ // block type
                case 0: // nothing
                    break;
                case 1: // Black Walls
                    this.ctx.fillStyle =  '#000'; 
                    break;
                case 2: // white panels
                    this.ctx.fillStyle =  '#fff'; 
                    break;
                case 3: // white unpressed panels
                    this.ctx.fillStyle =  '#0041aa'; 
                    break;
            } // end switch
            
            // draw
            // x Pos = (i%22)*this.CELL_WIDTH
            // y Pos = (Math.floor(i/22)) * this.CELL_WIDTH
            this.ctx.fillRect((i%22)*this.CELL_WIDTH, (Math.floor(i/22)) * this.CELL_WIDTH, this.CELL_WIDTH, this.CELL_WIDTH);
            this.ctx.restore();
        }
    },
    
    drawGrid: function() {
      this.ctx.strokeStyle = "#888";
        this.ctx.lineWidth="1";
        for (var i=0;i<this.HEIGHT;i++) { // horizantal
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * (this.CELL_WIDTH));
            this.ctx.lineTo(this.WIDTH, i * (this.CELL_WIDTH));
            this.ctx.closePath();
            this.ctx.stroke();
        }
        for (var i=0;i<this.WIDTH;i++) { // vertical
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.CELL_WIDTH, 0);
            this.ctx.lineTo(i * this.CELL_WIDTH, this.HEIGHT);
            this.ctx.closePath();
            this.ctx.stroke();
        }  
    },
    
    checkCollisions: function() {
        for (var i=0; i<this.walls.length;i++) {
            
            var wallXPos = (i%22)*this.CELL_WIDTH;
            var wallYPos = (Math.floor(i/22)) * this.CELL_WIDTH;
            
            // WALL CHECK
            if (this.walls[i] == 1) {
                // otherwise go on to check
                // (1) if x or y  is within CELL_WIDTH (30px) of the wall at i, disable that direction in keys.js
                // (2) check:
                //      LEFT-RIGHT: Y's must be the same
                //      UP-DOWN: X's must be the same
                
                if (this.player.position.x + this.CELL_WIDTH == wallXPos && this.player.position.y == wallYPos) { // checks RIGHT
                    console.log("Cannot go RIGHT!");
                    // save this current position in case tries to go on wall
                    //this.previousNonCollidingPos.x = this.player.position.x;
                    //this.previousNonCollidingPos.y = this.player.position.y;
                }
                else if (this.player.position.x - this.CELL_WIDTH == wallXPos && this.player.position.y == wallYPos) { // checks LEFT
                    // disable right 'A' 
                    console.log("Cannot go LEFT!");
                }
                else if (this.player.position.y + this.CELL_WIDTH == wallYPos && this.player.position.x == wallXPos) { // checks DOWN
                    // disable down 'S'   
                    console.log("Cannot go DOWN!");
                }
                else if (this.player.position.y - this.CELL_WIDTH == wallYPos && this.player.position.x == wallXPos) { // checks UP
                    // disable down 'W'   
                    console.log("Cannot go UP!");
                }
                
                // if player tries to move onto wall, go to previous position
                //if (this.player.position.x == wallXPos || this.player.position.x == wallYPos) {
                //    this.player.position.x = this.previousNonCollidingPos.x;
                //    this.player.position.x = this.previousNonCollidingPos.x;
                //}
                
                
                
                // how can I optimize this? maybe check if y/x's align first, then within that check for CELL_WIDTH space?
                // Test: GPU load +1-2% NVIDIA GeForce GTX960
                
                // TRY: when play position EQUALS wall position, move position to previous!!!!!!!!!!!!!!!!
            } // END WALL CHECK
            
            // PANEL/DOOR CHECK
            if (this.walls[i] == 2 || this.walls[i] == 3){
                // when player position equals this panel execute toggle panel stuff (turn off lights)
                if (this.player.position.x == wallXPos && this.player.position.y == wallYPos) {
                    console.log("on a panel");
                    
                    // if panel is not the same as the last or undefined, toggle
                    if ((this.lastPressedPanel.x == undefined && this.lastPressedPanel.y == undefined) || (this.player.position.x != this.lastPressedPanel.x || this.player.position.y != this.lastPressedPanel.y)){
                        // only toggle on enter
                        this.panelPressToggle = !this.panelPressToggle;
                        
                        // set this as last pressed panel
                        this.lastPressedPanel.x = wallXPos;
                        this.lastPressedPanel.y = wallYPos;
                        console.log("Last pressed: " + this.lastPressedPanel.x + "," + this.lastPressedPanel.y);
                    }
                    
                }
                
            }
        } // end for 
    },
    
    lightsOff: function() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
    }
    
    
    
}; // end app.main

// Add later: 
//      timers to complete level
//      Switches with different effects
//      tutorial level
//      restart button (too hacky?)