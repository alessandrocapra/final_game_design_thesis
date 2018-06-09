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
  },

  preload: function () {
    this.load.setPreloadSprite(this.bar);
    this.load.image('background', 'assets/sprites/bg_desert.png');
    this.load.spritesheet('duck', 'assets/sprites/chick.png', 16, 18);
		this.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);


		// loading bee animation
		this.load.spritesheet('bee', 'assets/sprites/bee.png', 56, 48);

    // loading tileset
		// this.load.tilemap('tilemap', 'assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('tilemap', 'assets/tilemaps/fast_exhalations.json', null, Phaser.Tilemap.TILED_JSON);
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
