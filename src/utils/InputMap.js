class InputMap {
  constructor() {}

  init(game) {
    this.touchEnabled = true
    /**
     * @type{Phaser.Game}
     */
    this.game = game

    this.touch = {
      rightAction: false,
      leftAction: false
    }
    this.activationWidth = 140
  }

  poll() {
    if (!this.touchEnabled) return

    if (this.game.input.activePointer.justPressed()) {
      const pos = this.game.input.activePointer.positionDown
      if (pos.x > 960 - this.activationWidth) {
        this.touch.rightAction = true
      } else if (pos.x < this.activationWidth) {
        this.touch.leftAction = true
      }
    }

    if (this.game.input.activePointer.justReleased()) {
      this.touch.rightAction = false
      this.touch.leftAction = false
    }
  }

  actionDown() {
    return this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
      this.game.input.keyboard.isDown(Phaser.Keyboard.S)
  }

  actionUp() {
    return this.game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
      this.game.input.keyboard.isDown(Phaser.Keyboard.W)
  }

  actioLeft() {
    return this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
      this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.touch.leftAction
  }

  actionRight() {
    return this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
      this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.touch.rightAction
  }

  actionJump() {
    return this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
  }
}

const Input = new InputMap()
export default Input