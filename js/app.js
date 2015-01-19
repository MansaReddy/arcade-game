/**
 * @file overview HTML5 Canvas game project for Udacity's FEND.
 * @author contact@mikejoyce.me (Mike Joyce) and the Udacity FEND instuctors.
 */

/* TODO:
 * - Add local storage leader board
 * - Add mute button for game music
 * - Add pause button
 */

/* Enemies Array.
 * All enemies generated by the Enemies.spawn() method are pushed
 * into this array.
 */
var allEnemies = [];

/* Pause the game by default to prevent the player moving around
 * when arrow keys are pressed
 */
var paused = true;

// Contants
var constants = {
		FONT : '20pt ArcadeClassic',
		FONT_COLOR: 'white',
		ENTITY_HEIGHT : 50,
		ENTITY_WIDTH : 50,
		MIN_SPEED : 50,
		MAX_SPEED : 400,
		PLAYER_START_X : 300,
		PLAYER_START_Y : 470,
		POSITION_X : [0, 100, 200, 300, 400, 500, 600],
		POSITION_Y : [160, 230, 310, 390]
};


$(document).ready(function() {

		// Play Background Music
		gameMusic.play();
		gameMusic.volume(0.3);

		// Hide the start screen on button click
		$("#playGame").click(function() { 
				// Hide the start screen
				$("#startScreen").fadeOut('fast'); 
				// Play the select sound effect
				gameSelect.play();
				// Fade in the game music
				gameMusic.fade(0.3, 0.7, 2000);
				/* Unpause the game to allow the player to move around
				 * when arrow keys are pressed
				 */
				paused = false;
		});

		// Hide the game over screen on button click
		$("#playAgain").click(function() {
				// Hide the game over screen
				$("#gameOver").hide()
				// Play the select sound effet
				gameSelect.play();
				// Fade in the game music
				gameMusic.fade(0.3, 1.0, 1000);
				/* Unpause the game to allow the player to move around
				 * when arrow keys are pressed
				 */		
				paused = false;
		});

});


/* Enemy Class
 * Accepts two arguments. The y position on the canvas and the speed. 
 */
var Enemy = function(positionY, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = getRandomInt(-1000, -100);
    this.y = positionY;
		this.height = constants.ENTITY_HEIGHT;
		this.width = constants.ENTITY_WIDTH;
    this.speed = speed;
};
/* Update the enemies position on the canvas.
 * Accepts one argument. The dt speed is multiplied by the dt parameter 
 * to ensure the game runs at the same speed for all computers
 */
Enemy.prototype.update = function(dt) {
		/* Give the illusion of animation. Multiply the position and speed
		 * of the enemy object by dt (delta time).
		 */
		this.x = this.x + this.speed * dt;
		/* If the enemy goes off the right most side of the canvas,
		 * reset it's position at a randgom negative position off
		 * the left side of the canvas.
		 */
		if(this.x > canvas.width) {
			this.x = getRandomInt(-2000, -100);
		}
};
/* Draw the enemy on the canvas.
 * The enemies y position on the canvas is determined by 
 * the argument passed into the Enemy constructor function
 */
Enemy.prototype.render = function() {
	  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/* Generate Enemies
 * This class is responsible for spawning enemies and
 * removing enemies from the canvas.
 */
var Enemies = function() {
		this.enemiesArray = [];
};
/* Spawn Enemies
 * This method accepts on argument to determine the number of 
 * enemies to spawn and push into the allEnemies array.
 */
Enemies.prototype.spawn = function(number) {

		for(var i = 0; i < number; i++) {
			// Call the getRandomInt function and set the speed of the enemy.
			var speed = getRandomInt(constants.MIN_SPEED, constants.MAX_SPEED);
			// Call the getRandmoInt function and set the players y position on the canvas.
			var position = getRandomInt(0, 3);
			// Instatiate a new enemy object.
			this.enemiesArray[allEnemies.length] = new Enemy(constants.POSITION_Y[position], speed);
			// Push the new enemy into the allEnemies array.
			allEnemies.push(this.enemiesArray[allEnemies.length]);
		}

};
/* Reset Enemies
 * Clear all enemies from the canvas
 */
Enemies.prototype.reset = function() {
	   var enemyCount = allEnemies.length;
	   for(i = 0; i < enemyCount; i++) {
	   	allEnemies.splice(i, allEnemies.length);
	   }
};

// Instantiate a new Enemies object
var enemies = new Enemies();


/* Gem Class
 * This class is responsible for generating, clearing
 * and reseting a collectable gem.
 */
var Gem = function() {
		// Include all the blue, green and orange gem images in to an array
		var gemArray = ['gem-blue.png', 'gem-green.png', 'gem-orange.png'];
		this.sprite = 'images/' + gemArray[getRandomInt(0,2)];
		this.height = constants.ENTITY_HEIGHT;
		this.width = constants.ENTITY_WIDTH;
		// Set a random x position
		this.x = constants.POSITION_X[getRandomInt(0, 6)];
		// Set a random y position
		this.y = constants.POSITION_Y[getRandomInt(0, 3)];
};
/* Draw the Gem on the canvas
 * The gem's x and y positions are determined by random positions
 * generated by from the the POSITION_X and POSITION_Y contstant arrays.
 */
Gem.prototype.render = function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/* Clear Gem
 * Hide the gem off the canvas by setting its x position to a negative value
 */
Gem.prototype.clear = function() {
		this.x = -100;
		// Play gem collect sound effect
		gemCollect.play();
};
/* Reset Gem
 * Reseting the Gem will instantiate a new Gem object and in turn reset
 * it's color and position on the canvas.
 */
Gem.prototype.reset = function() {
		gem = new Gem();
};

// Instantiate a new Gem object
var gem = new Gem();


/* Player Class
 * This class is responsible for rendering the player, updating the 
 * player's position on the canvas and updating the player's lives. 
 */
var Player = function() {
		this.sprite = 'images/char-boy.png';
		this.x = constants.PLAYER_START_X;
		this.y = constants.PLAYER_START_Y; 
		this.height = constants.ENTITY_HEIGHT;
		this.width = constants.ENTITY_WIDTH;
		// Player starts the game with 3 lives
		this.lives = 3;
};
// Update player position on the canvas
Player.prototype.update = function() {
		this.xNow = this.x;
		this.yNow = this.y;
};
// Reset player position
Player.prototype.reset = function() {
		this.x = constants.PLAYER_START_X;
		this.y = constants.PLAYER_START_Y; 
};
Player.prototype.hit = function() {
		this.x = constants.PLAYER_START_X;
		this.y = constants.PLAYER_START_Y;
		playerHit.play(); 
};
/* Update player lives
 * Method takes two arguments. The action, which can be either 
 * add or remove and the value which indicates the the number 
 * of lives to add or remove. After adding/removing a life,
 * update the stats.
 */
Player.prototype.updateLives = function(action, value) {
		// Add a life
		if(action === "add") {
			this.lives = this.lives + value;
		}
		// Remove a life
		if(action === "remove") {
			this.lives = this.lives - value;	
		}
		stats.updateLives(this.lives);
};
// Draw the player on the canvas
Player.prototype.render = function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Handle the left, up, right & down keyboard arrow keys
Player.prototype.handleInput = function(key) {
		if(key === 'left' && this.x != 0) {
			this.x = this.xNow + -50;
		}
		if(key === 'up' && this.y != 20) {
			this.y = this.yNow + -50;
		}
		if(key === 'right' && this.x != 600) {
			this.x = this.xNow + 50;
		}
		if(key === 'down' && this.y != 470) {
			this.y = this.yNow + 50;
		}
};

// Instantiate new Player object
var player = new Player();


/* Level Class
 * This class is responsible for keeping track of and reseting the level.
 */
var Level = function() {
		this.level = 1;
		enemies.spawn(2);
};
/* Update the level: 
 * - increase level
 * - spawn enemies
 * - reset player position 
 * - reset the collectable gem
 * - update level stat
 * - update the score
 * - play level up sound
 */
Level.prototype.update = function() {
		this.level++;
		if(this.level % 2) {
	  	enemies.spawn(1);
	 	}
		player.reset();
		gem.reset();
		stats.updateLevel(this.level);
		stats.updateScore();
		levelUp.play();
};
/* Reset the level:
 * - Reset to level 1 
 * - reset player
 * - reset enemies
 * - reset gem
 * - reset stats 
 * - update player lives
 * - spawn enemies
 * - play game over sound
 * - pause the game to prevent player movement
 * - fade out the game music slightly
 */
Level.prototype.reset = function() {
		this.level = 1;
		player.reset();
		enemies.reset();
		gem.reset();
		stats.reset();
		player.updateLives('add', 2); 
		enemies.spawn(2);
		gameOver.play();
		gameMusic.fade(1.0, 0.3, 1000);
		paused = true;
		$("#gameOver").show();
};

// Instantiate a new level object
var level = new Level();


/* Stats Class
 * This class is responsible for rendering, updating and reseting the game statisitcs,
 * namely the current level and score.
 */
var Stats = function() {
		this.font = constants.FONT;
		this.fontColor = constants.FONT_COLOR;
		this.currentLevel = level.level;
		this.currentLives = player.lives;
		this.currentScore = 0;
		this.currentGems = 0;
};
// Render the stat bar, level text, score text, lives count and gems count
Stats.prototype.render = function() {
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.fillRect(0,50, 707, 45);
		this.level();
		this.score();
		this.lives();
		this.gems();
};
// Level text
Stats.prototype.level = function() {
		ctx.font = this.font;
		ctx.fillStyle = this.fontColor;
		ctx.textAlign = 'start';
		ctx.fillText('Level '+ this.currentLevel, 10, 82);
};
// Update level
Stats.prototype.updateLevel = function(level) {
		this.currentLevel = level;
};
// Score text
Stats.prototype.score = function() {
		ctx.font = this.font;
		ctx.fillStyle = this.fontColor;
		ctx.textAlign = 'end';
		ctx.fillText(this.currentScore, 700, 82);
};
// Update score stat
Stats.prototype.updateScore = function() {
		this.currentScore = this.currentScore + 600;
};
// Lives icon & text
Stats.prototype.lives = function() {
		ctx.drawImage(Resources.get('images/stat-heart.png'), 430, 62);
		ctx.font = this.font;
		ctx.fontStyle = this.fontColor;
		ctx.textAlign = 'start';
		ctx.fillText('x '+ this.currentLives, 465, 82);
};
// Update lives stat
Stats.prototype.updateLives = function(lives) {
		this.currentLives = lives;
};
// Gems icon & text
Stats.prototype.gems = function() {
		ctx.drawImage(Resources.get('images/stat-gem.png'), 340, 62);
		ctx.font = this.font;
		ctx.fontStyle = this.fontColor;
		ctx.textAlign = 'start';
		ctx.fillText('x '+ this.currentGems, 370, 82);
};
// Update gem stat
Stats.prototype.updateGems = function() {
		this.currentGems++;
		this.currentScore = this.currentScore + 300;
};
// Reset stats
Stats.prototype.reset = function() {
		this.currentScore = 0;
		this.currentGems = 0;
		this.currentLevel = level.level;
};

// Instatiate a new Stats object
var stats = new Stats();


// Helper Functions

/* Listen for key presses.
 * Sent to the player method handleInput.
 */
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if(!paused) {
    	player.handleInput(allowedKeys[e.keyCode]);
  	}
});

/* Returns a random integer. 
 * Accepts two arguments, a minimum and maximum number.
 */
function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Returns a console log.
 * Takes one or more expressions as parameters.
 * Just to make logging to the console that much more simple :)
 */
function log(log) {
	 return console.log(log);
}
