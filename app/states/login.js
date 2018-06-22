module.exports = {

  create: function () {

		var title = this.add.text(this.world.centerX, 200, 'Login', {
      fill: 'white',
      font: '80px Arial'
    });
    title.anchor.set(0.5);
    // title.alignIn(this.world, Phaser.CENTER);

		this.nameInput = this.add.inputField(this.world.centerX - 140, this.world.centerY - 50, {
			font: '20px Arial',
		  width: 250,
      padding: 16,
			borderWidth: 3,
			borderColor: '#2cc0ff',
			borderRadius: 6,
      placeHolder: 'Name'
    });

		this.passwordInput = this.add.inputField(this.world.centerX - 140, this.world.centerY + 25, {
			font: '20px Arial',
			width: 250,
			padding: 16,
			borderWidth: 3,
			borderColor: '#2cc0ff',
			borderRadius: 6,
			placeHolder: 'Password',
			type: PhaserInput.InputType.password
		});

		// login button and text
		var checkLoginBtn = this.checkLoginBtn= this.add.sprite(this.world.centerX, this.world.centerY+140, 'button', 'blue_button04.png');
		checkLoginBtn.anchor.set(0.5,0.5);
		checkLoginBtn.inputEnabled = true;
		checkLoginBtn.input.useHandCursor = true;

		var chechLoginText = this.add.text(0,0,'Login', {align: "center"});
		chechLoginText.anchor.set(0.5,0.5);

		checkLoginBtn.addChild(chechLoginText);
		checkLoginBtn.events.onInputDown.add(this.checkLogin, this);


    // this.input.onTap.add(this.startGame.bind(this));
  },

  startGame: function () {
    this.state.start('game');
  },

  checkLogin: function() {

  }

};
