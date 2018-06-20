module.exports = {

  create: function () {

  	var world = this.world;
  	// keep reference of Scene scope
  	var self = this;
    // set the velocity to which the level moves
		var speed = this.speed = 3;

		this.music = this.sound.play('song');
		this.score = 0;
		this.health = 40;
		this.gameOver = false;

    // start the arcade physics system
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.enableCollision = true;

		var background = this.background = this.add.tileSprite(0,0, world.width, world.height, 'background');

    // tileset creation
		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('tiles_spritesheet', 'tiles');
		this.map.addTilesetImage('Enemy', 'bee_tiles');

		// Import the tileset layers
		var scenarioLayer = this.scenarioLayer = this.map.createLayer('Scenario');
		var foregroundLayer = this.foregroundLayer = this.map.createLayer('Foreground');
		var groundLayer = this.groundLayer = this.map.createLayer('Ground');
		this.map.setCollisionBetween(1, 200, true, 'Scenario');
		this.map.setCollisionBetween(1, 200, true, 'Foreground');
		this.map.setCollisionBetween(1, 200, true, 'Ground');

		// Import enemies as objects
		this.enemies = this.add.group();
		this.enemies.enableBody = true;

		// load enemies from tiled map
		this.map.createFromObjects('Enemies', 157, 'bee', 0, true, false, this.enemies);
		// create animation for all children of enemies group
		this.enemies.callAll('animations.add', 'animations', 'fly', [0,2], 10, true);
		this.enemies.callAll('animations.play', 'animations', 'fly');
		this.enemies.setAll('body.allowGravity', false);

		// make enemies pulse to rhythm
		this.add.tween(this.enemies.scale).to( {y: 1.2}, 480, Phaser.Easing.Back.InOut, true, 0, false);

		// Import coins
		this.coins = this.add.group();
		this.coins.enableBody = true;
		// load coins from tiled map
		this.map.createFromObjects('Coins', 161, 'coin', 0, true, false, this.coins);
		// create animation for all children of coins group
		this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
		this.coins.callAll('animations.play', 'animations', 'spin');
		this.coins.setAll('body.allowGravity', false);

		// Score text
		this.style = { font: "bold 24px Arial", fill: "#000"};
		this.scoreText = this.add.text(400, 40, "score: 0", this.style);
		this.scoreText.anchor.setTo(0.5, 0.5);

		// hearts for health
		this.hearts = this.add.group();
		for(let i=0; i < 4; i++){
			this.hearts.create(50 + i*45, 40, 'heartFull')
		}
		// change anchor and scale for all hearts
		this.hearts.forEach(function (heart) {
			heart.anchor.setTo(0.5, 0.5);
			heart.scale.setTo(0.7, 0.7);
		});

		// load overlay gameOver screen and hide it
		this.menu = this.add.sprite(this.camera.x, this.camera.y, 'overlay');
		this.playAgainText = this.add.text(this.camera.x, this.camera.y, 'Not bad! Play again' , { font: "bold 24px Arial", fill: "#fff"});
		this.menu.visible = false;
		this.playAgainText.visible = false;

		// Create pause button
		this.pauseButton = this.add.image(world.width - 40, 40, 'pauseButton');
		this.pauseButton.scale.setTo(0.1,0.1);
		this.pauseButton.anchor.setTo(0.5, 0.5);
		this.pauseButton.inputEnabled = true;

		this.pauseButton.events.onInputUp.add(function () {
			// When the pause button is pressed, we pause the game
			console.log('button pressed!');

			// stop camera
			if(!self.stopTheCamera){
				self.stopTheCamera = true;
			} else {
				self.music.resume();
				self.paused = false;
				self.physics.arcade.isPaused = (!self.physics.arcade.isPaused);
				self.menu.visible = false;

				self.stopTheCamera = false;
			}
		});

		// define player and its properties
		var duck = this.duck = this.add.sprite(80, world.centerY+50, 'duck');
		duck.anchor.setTo(0.5, 0.5);
		this.physics.enable(duck, Phaser.Physics.ARCADE);
		duck.body.collideWorldBounds = true;
		duck.scale.set(2);
		duck.animations.add('walk', null, 5, true);
		duck.animations.play('walk');

		duck.body.allowDrag = true;
		duck.body.drag.set(0, 100);
		duck.body.maxVelocity.set(0, 400);

		groundLayer.resizeWorld();

		var cursors = this.cursors = this.input.keyboard.createCursorKeys();

		cursors.down.onDown.add(() => {
			if(this.duck.body.y > this.world.centerY - 35 && this.duck.body.y < this.world.height - 50 )
				this.duck.body.velocity.y = 350;
		});

		cursors.up.onDown.add(() => {
			if( this.duck.body.y <= this.world.centerY + 50 && this.duck.body.y > 50 )
				this.duck.body.velocity.y = -600;
		});
  },

  update: function () {

  	var self = this;

  	/*
  	*
  	* MOVEMENT OF ELEMENTS
  	*
  	* */

		if(this.gameOver){
			// stop the whole scene
			this.physics.arcade.isPaused = true;
			this.paused = true;

			// stop the music, perhaps play another sound
			this.music.stop();

			// show overlay screen
			this.menu.x = this.camera.x;
			this.menu.y = this.camera.y;
			this.playAgainText.x = this.camera.x;
			this.playAgainText.y = this.camera.y;

			this.playAgainText.fixedToCamera = true;
			this.playAgainText.cameraOffset.setTo(400, 315);
			this.playAgainText.anchor.setTo(0.5,0.5);

			this.menu.visible = true;
			this.playAgainText.visible = true;
			this.playAgainText.inputEnabled = true;
			this.playAgainText.events.onInputUp.add(function(){
				self.state.restart();
			});
		} else if(this.stopTheCamera) {
			this.paused = true;
			this.physics.arcade.isPaused = true;
			this.music.pause();

			this.menu.x = this.camera.x;
			this.menu.y = this.camera.y;
			this.menu.visible = true;
		} else {
			// make the background scroll
			this.background.tilePosition.x -= this.speed;

			// keep scrolling the level
			this.camera.x += this.speed;

			// keep background and player at the same position while the camera moves
			this.background.x += this.speed;

			// Keep the score text at the same position
			this.scoreText.x += this.speed;

			// move hearts
			this.hearts.forEach(function (heart) {
				heart.x += self.speed;
			});

			//move pause button
			this.pauseButton.x += this.speed;
		}

		/*
		*
		* COLLISIONS
		*
		* */

		this.physics.arcade.collide(this.duck, [this.scenarioLayer, this.enemies], this.duckCollision, this.duckProcessCallback, this);

		// overlap with water
		// easier to check if duck is under a specific Y, instead of using overlap
		this.duck.y >	 this.world.centerY+60 ? this.duck.alpha = 0.3 : this.duck.alpha = 1;

		// overlap with coins
		this.physics.arcade.overlap(this.duck, this.coins, this.collectCoin, null, this);


		/*
		*
		* CONTROLS
		*
		* */

		this.duck.body.velocity.x = this.speed*60;

		if( this.duck.body.y > this.world.centerY + 50){
			this.physics.arcade.gravity.y = -800;
		}else if( this.duck.body.y < this.world.centerY + 20 && this.duck.body.y >= this.world.centerY + 25 ){
			this.physics.arcade.gravity.y = 0;
		}else if( this.duck.body.y < this.world.centerY + 20 ){
			this.physics.arcade.gravity.y = 1000;
		}else{
			this.physics.arcade.gravity.y = -120;
			const drag = (( Math.abs(this.duck.body.velocity.y) * 200 ) / 400) + 50;

			if(!this.cursors.down.isDown )
				this.duck.body.drag.set(0, drag);
		}

		if( this.cursors.up.isDown ){
			this.duck.body.acceleration.y = -400;
		}else if( this.cursors.down.isDown ){
			this.duck.body.acceleration.y = 600;
		}else{
			this.duck.body.acceleration.y = 0;
		}

			// this.physics.arcade.moveToXY(this.duck,this.duck.x+400,this.world.centerY+50, 180);
			// this.add.tween(this.duck).to( { y: this.world.centerY+50 }, 1000, Phaser.Easing.Bounce.Out, true);
  },

  restart: function () {
    this.state.restart();
  },

  quit: function () {
    this.state.start('menu');
  },

	duckProcessCallback: function(obj1, obj2){
		// disable physics, so player can avoid getting stuck
		if(this.enableCollision){
			return true;
		} else {
			return false;
		}
	},

	duckCollision: function () {

		this.health -= 10;
		if(this.health === 0){
			this.gameOver = true;
		}

		this.enableCollision = false;
		this.duck.alpha = 0.2;

  	for(let i = this.hearts.length-1; i >= 0; i--){
  		let currentHeart = this.hearts.getAt(i);
  		console.log("currentHeart, position " + i + ": ", currentHeart);

  		if(currentHeart.key === 'heartFull'){
  			console.log("Inside heartFull");
				currentHeart.loadTexture('heartEmpty');
				break;
			}
		}

		// set timer to put the collisions back to normal after a while
		this.time.events.add(Phaser.Timer.SECOND * 3, this.resetPlayer, this);
	},

	resetPlayer: function (){
		this.duck.alpha = 1;
		this.enableCollision = true;
	},
	
	collectCoin: function (player, coin) {
		this.score += 10;
		this.scoreText.setText('score: ' + this.score);
  	coin.kill();
	},

	togglePause: function (isPaused) {

	}

};
