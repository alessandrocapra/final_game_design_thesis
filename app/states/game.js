module.exports = {

  create: function () {
    var world = this.world;

    // variable used to set the velocity to which the level moves
		var speed = this.speed = 2;

    // start the arcade physics system
		this.physics.startSystem(Phaser.Physics.ARCADE);

    // var carrot = this.carrot = this.add.image(world.width * 0.75, world.centerY, 'carrot');
    // carrot.anchor.set(0.5);

		var background = this.background = this.add.tileSprite(0,0, world.width, world.height, 'background');

    // define player and its properties
    var duck = this.duck = this.add.sprite(world.width * 0.25, world.centerY, 'duck');
    duck.anchor.set(0.5);
		this.physics.enable(duck, Phaser.Physics.ARCADE);
		duck.body.collideWorldBounds = true;

		//record the initial position, can be used to go back to it after position changed
		this.startY = duck.y;
		this.startX = duck.x;

    duck.scale.set(2);
    duck.animations.add('walk', null, 5, true);
    duck.animations.play('walk');

    // tileset creation
		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('tiles_spritesheet', 'tiles');

		this.backgroundlayer = this.map.createLayer('Background');
		var groundLayer = this.groundLayer = this.map.createLayer('Ground');

		// set collision between tiles from index 1 to 100, true means collision enabled
		this.map.setCollisionBetween(1, 100, true, 'Ground');
		groundLayer.resizeWorld();

		//Make the camera follow the sprite
		// this.camera.follow(this.duck);

		var cursors = this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function () {

    // make the background scroll
    this.background.tilePosition.x -= this.speed;

    // keep scrolling the level
		this.camera.x += this.speed;

		// keep background and player at the same position while the camera moves
		this.background.x += this.speed;
		this.duck.x += this.speed;

    // make player always move forward
		// this.duck.x += 3;

    // set velocity to 0 when player stops pressing keys
		this.duck.body.velocity.setTo(0, 0);

		//Make the sprite collide with the ground layer
		this.physics.arcade.collide(this.duck, this.groundLayer);

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
  }

};
