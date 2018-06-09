module.exports = {

  create: function () {

  	var world = this.world;
    // set the velocity to which the level moves
		var speed = this.speed = 2;
		this.music = this.sound.play('song');
		this.score = 0;

		this.enableCollision = true;

    // start the arcade physics system
		this.physics.startSystem(Phaser.Physics.ARCADE);

		// start song


		var background = this.background = this.add.tileSprite(0,0, world.width, world.height, 'background');

    // define player and its properties
    var duck = this.duck = this.add.sprite(world.width * 0.15, world.centerY, 'duck');
    duck.anchor.set(0.5);
		this.physics.enable(duck, Phaser.Physics.ARCADE);
		duck.body.collideWorldBounds = true;
    duck.scale.set(2);
    duck.animations.add('walk', null, 5, true);
    duck.animations.play('walk');

    // tileset creation
		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('tiles_spritesheet', 'tiles');
		this.map.addTilesetImage('Enemy', 'bee_tiles');

		// Import the tileset layers
		var scenarioLayer = this.scenarioLayer = this.map.createLayer('Scenario');
		var groundLayer = this.groundLayer = this.map.createLayer('Ground');

		// Import enemies as objects
		this.enemies = this.add.group();
		this.enemies.enableBody = true;
		// load enemies from tiled map
		this.map.createFromObjects('Enemies', 157, 'bee', 0, true, false, this.enemies);
		// create animation for all children of enemies group
		this.enemies.callAll('animations.add', 'animations', 'fly', [0,2], 10, true);
		this.enemies.callAll('animations.play', 'animations', 'fly');

		// Import coins
		this.coins = this.add.group();
		this.coins.enableBody = true;
		// load enemies from tiled map
		this.map.createFromObjects('Coins', 161, 'coin', 0, true, false, this.coins);
		// create animation for all children of coins group
		this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
		this.coins.callAll('animations.play', 'animations', 'spin');


		this.map.setCollisionBetween(1, 200, true, 'Scenario');
		this.map.setCollisionBetween(1, 200, true, 'Ground');

		groundLayer.resizeWorld();

		var cursors = this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function () {

    // make the background scroll
    this.background.tilePosition.x -= this.speed;

    // keep scrolling the level
		this.camera.x += this.speed;

		// keep background and player at the same position while the camera moves
		this.background.x += this.speed;

		/*
		*
		* COLLISIONS
		*
		* */

		this.physics.arcade.collide(this.duck, [this.groundLayer, this.scenarioLayer, this.enemies], this.duckCollision, this.duckProcessCallback, this);

		// overlap with coins
		this.physics.arcade.overlap(this.duck, this.coins, this.collectCoin, null, this);


		/*
		*
		* CONTROLS
		*
		* */

    // set velocity to 0 when player stops pressing keys, but keep moving forward
		this.duck.body.velocity.setTo(120, 0);

		if (this.cursors.up.isDown)
		{
			this.duck.body.velocity.y = -200;
		}
		else if (this.cursors.down.isDown)
		{
			this.duck.body.velocity.y = 200;
		}
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
		// this.time.events.add(Phaser.Timer.SECOND * 3, fadePicture, this);
		this.enableCollision = false;
		this.duck.alpha = 0.2;
  	console.log("AHHHHHH");
	},
	
	collectCoin: function (player, coin) {
		this.score += 10;
		console.log("score: " + this.score);
  	coin.kill();
	}

};
