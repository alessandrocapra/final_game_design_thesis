module.exports = {

  init: function () {
    this.input.maxPointers = 1;
    this.game.renderer.renderSession.roundPixels = true;
    this.tweens.frameBased = true;

    this.whitePixel = this.add.bitmapData(1, 1);
    this.whitePixel.fill(255, 255, 255);
    
    this.bar = this.whitePixel.addToWorld();
    this.bar.width = 100;
    this.bar.height = 10;
    this.bar.alignIn(this.world.bounds, Phaser.CENTER);

		// importing plugin to handle input boxes
		this.add.plugin(PhaserInput.Plugin);
  },

  preload: function () {

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.setScreenSize = true;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.forceSingleUpdate = true;

		// load UI elements
		this.load.atlasJSONHash('button', 'assets/sprites/button.png', 'assets/sprites/button.json');

		// load general assets
    this.load.setPreloadSprite(this.bar);
    this.load.image('background', 'assets/sprites/bg_desert.png');
    this.load.spritesheet('duck', 'assets/sprites/chick.png', 16, 18);
		this.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
		this.load.image('heartFull', 'assets/sprites/hud_heartFull.png');
		this.load.image('heartEmpty', 'assets/sprites/hud_heartEmpty.png');
		this.load.image('overlay', 'assets/sprites/overlay.png');
		this.load.image('pauseButton', 'assets/sprites/pause_button.png');
		// this.load.image('arrowUp', 'assets/sprites/arrow.png');
		this.load.image('mouth', 'assets/sprites/mouth.png');
		this.load.image('nose', 'assets/sprites/nose.png');

		// loading bee animation
		this.load.spritesheet('bee', 'assets/sprites/bee.png', 56, 48);

    // loading tileset
		// this.load.tilemap('tilemap', 'assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('tilemap', 'assets/tilemaps/fast_exhalations_dolphin.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tiles', 'assets/tilemaps/tiles_spritesheet.png');
		this.load.image('bee_tiles', 'assets/sprites/bee.png');


		// load song
		this.load.audio('song', ['assets/audio/song.mp3', 'assets/audio/song.ogg']);
  },

  create: function () {
    this.state.start('menu');
  },
  
  shutdown: function () {
    this.whitePixel.destroy();
    this.whitePixel = null;
  }

};
