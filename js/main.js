// main.js

'use strict';

var app = app || {};

app.main = {
    
	//  properties
    WIDTH : 660, 
    HEIGHT: 480,
    canvas: undefined,
    ctx: undefined,
   	lastTime: 0, 
    debug: true,
    
    gameState: undefined,
    //sound: undefined, // requires - loaded by main.js
    
    paused: false,
    animationID: 0,
    debug: true,
    
    GAME_STATE: {
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
    
    walls: [], // temporarily hardcoded, to be read from file (not working) later /*
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
    ],/**/
    CELL_WIDTH: 30, // grid cell size in px
    MAP_COLORS: [ // maybe not use this? not needed right now since colors are hardcoded: see drawWalls
        'rgba(0,0,0,0)',    // (0) empty space
        '#000',             // (1) wall (black)
        '#fff',             // (2) panel (unpressed- once pressed, can only be let up by reaching a door or pressing another panel)
        '#0041aa'           // (3) Door/exit
    ],
    
    // image stuff
    imagePaths: undefined,
    playerImage: undefined,
    
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
        this.gameState = this.GAME_STATE.BEGIN;
        
        
        // load images // need onload
        /*var image = new Image();                                      // animatedsprite loading
        image.onload = function() {
          console.log("img loaded");  
        };
        image.src = this.imagePaths.playerImage;
        this.playerImage = image;*/
        
        // load sprites
        this.loadSprites();
        //this.createPlayerSprite(this.WIDTH/2, this.HEIGHT/2);         // animatedsprite loading
        
        // hook up events
        this.canvas.onmousedown = this.doMousedown.bind(this);
        
        // load level
        //this.reset();                                                   // map loading in from external
        
		// start the game loop
		this.update();
	},
    
    reset: function(){
        // read in map
        this.loadMap('maps/map_0.txt');
    },
	
	update: function () {
	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	
	 	// PAUSE SCREEN - TO DO
 	 
	 	// UPDATE
        
        // CHECK FOR COLLISIONS
        this.checkCollisions();

		// DRAWING GOES UNDER HERE
		// Redraw background
		this.ctx.fillStyle = "#6495ED";
        this.ctx.fillRect(0,0,this.WIDTH, this.HEIGHT);
        
        // TITLE SCREEN
        if (this.gameState == this.GAME_STATE.BEGIN)  {
            this.panelPressToggle = false;
            this.drawStartScreen();
        }
        
        // DURING GAME
        if (this.gameState == this.GAME_STATE.PLAYING){
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
            this.drawGrid(); // does not draw unless called after wall draw call

            // INSTRUCTIONS:
            this.ctx.save();
            this.ctx.globalAlpha = .7;
            this.ctx.font = "20px Arial";
            this.ctx.textAlign='center';
            this.ctx.fillStyle = "white";
            this.ctx.fillText("You're the red square.", this.WIDTH/2, 80);
            this.ctx.fillText("Move with WASD or Arrow Keys.", this.WIDTH/2, 110);
            this.ctx.fillText("White blocks - switch panel.", this.WIDTH/2, 145);
            this.ctx.fillText("Blue block -  exit.", this.WIDTH/2, 170);
            this.ctx.fillText("You can only exit once you hit all the switches.", this.WIDTH/2, 265);
            this.ctx.fillText("But once you hit a switch you'll have to traverse in the dark", this.WIDTH/2, 295);
            this.ctx.fillText("until you find a different switch to turn it back on, or the exit", this.WIDTH/2, 325);
            this.ctx.fillText("so try to remember the path.", this.WIDTH/2, 355);

            this.ctx.font = "12px Arial";
            this.ctx.fillText("Wall collision... still yet to work", this.WIDTH/2, 405);
            this.ctx.restore();

            // Draw sprites
            this.drawSprites();
            //this.drawPlayerSprite();                                      // animatedsprite loading
            
        }      
        
        // ROUND OVER
        if (this.gameState == this.GAME_STATE.ROUND_OVER) {
            this.drawRoundOverScreen();
        }
        
		// Draw HUD	
	},
    
    ///////////////////////////////////////////////////////
    ///             SPRITE STUFF                        ///
    ///////////////////////////////////////////////////////
    loadSprites: function() {   // mock-up blocks
        // call function constructors here    
        this.player.position.x = this.WIDTH / 2;
        this.player.position.y = this.HEIGHT / 2;
    },
    
    drawSprites: function(){     // mock-up blocks   
        // drawing square as player for now
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.position.x,this.player.position.y,30,30);     
    },
    
    createPlayerSprite: function(x, y) { // loading sprites from spritesheets
        // AnimatedSprite(image, width, height, frameWidth, frameHeight, frameDelay)
        var spr = new app.AnimatedSprite(this.playerImage,128,192,32,48,1/3);
        spr.x = x;
        spr.y = y;
    },
    
    drawPlayerSprite: function() { // loading sprites from spritesheets
        spr.draw(this.ctx);
        
    },
    
    
    
    
    ///////////////////////////////////////////////////////
    /// MAP LOADING & DRAWING(transfer to utlities?)    ///
    ///////////////////////////////////////////////////////
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
    ///////////////////////////////////////////////////////
    ///              END MAP LOADING                    ///
    ///////////////////////////////////////////////////////
    
    
    
    
    
    checkCollisions: function() {
        for (var i=0; i<this.walls.length;i++) {
            
            var wallXPos = (i%22)*this.CELL_WIDTH;
            var wallYPos = (Math.floor(i/22)) * this.CELL_WIDTH;
            
            ////////////////////////////////////////////////////////////////WALL PROBLEMS
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
            } // END WALL CHECK
            
            // PANEL CHECK
            if (this.walls[i] == 2 || this.walls[i] == 3){
                // when player position equals this panel execute toggle panel stuff (turn off lights)
                if (this.player.position.x == wallXPos && this.player.position.y == wallYPos) {
                    console.log("on a panel");
                    
                    // if panel is not the same as the last or undefined, toggle
                    if ((this.lastPressedPanel.x == undefined && this.lastPressedPanel.y == undefined) || (this.player.position.x != this.lastPressedPanel.x || this.player.position.y != this.lastPressedPanel.y)) {
                        
                        
                        // if this is a door set game state to round over
                        if (this.walls[i] == 3 && this.lastPressedPanel.x == 120 && this.lastPressedPanel.y == 210) {
                            // SET HERE RULES THAT ALL PANELS MUST BE PRESSED FIRST (hardcoded in if statement for now)
                            
                            
                            this.gameState = this.GAME_STATE.ROUND_OVER;
                            // reset last panels and player pos 
                            // THIS WILL BE CHANGED LATER, different start locations for different levels
                            this.lastPressedPanel.x = undefined;
                            this.lastPressedPanel.y = undefined;
                            this.player.position.x = Math.floor(this.WIDTH/2);
                            this.player.position.y = Math.floor(this.HEIGHT/2);
                        }
                        
                        if (this.walls[i] != 3) {
                            // only toggle on enter
                            this.panelPressToggle = !this.panelPressToggle;
                            // otherwise set this as last pressed panel
                            this.lastPressedPanel.x = wallXPos;
                            this.lastPressedPanel.y = wallYPos;
                            console.log("Last pressed: " + this.lastPressedPanel.x + "," + this.lastPressedPanel.y);
                        }
                        
                    }
                }
            }// end if            
        } // end for 
    },
    
    lightsOff: function() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
    },
    
    drawStartScreen: function() {
        this.ctx.save();
        this.ctx.font = "30px Arial";
        this.ctx.textAlign='center';
        this.ctx.fillStyle = "white";
        this.ctx.fillText("PUZZLE PANEL ESCAPE!!!", this.WIDTH/2, this.HEIGHT/2);
        this.ctx.fillText("Click to start.", this.WIDTH/2, this.HEIGHT/2 + 50);
        this.ctx.restore();
    },
    
    drawRoundOverScreen: function() {
        this.ctx.globalAlpha = .5;
        this.ctx.fillStyle = "#6495ED";
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
        
        this.ctx.globalAlpha = 1;
        this.ctx.font = "20px Arial";
        this.ctx.textAlign='center';
        this.ctx.fillStyle = "white";
        this.ctx.fillText("You've escaped!", this.WIDTH/2, 80);
    },
    
    doMousedown: function(e) {
        if (this.gameState == this.GAME_STATE.BEGIN) {
            this.gameState = this.GAME_STATE.PLAYING;
            return;
        }
        
        if (this.gameState == this.GAME_STATE.ROUND_OVER) {
            // reset for now
            this.gameState = this.GAME_STATE.BEGIN;
            return;
        }
    }
    
    
}; // end app.main
