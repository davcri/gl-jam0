class InputMap {
  constructor() {}

  init(game) {
    this.game = game
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
      this.game.input.keyboard.isDown(Phaser.Keyboard.A)
  }

  actionRight() {
    return this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
      this.game.input.keyboard.isDown(Phaser.Keyboard.D)
  }

  actionJump() {
    return this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
  }
}

const Input = new InputMap()
export default Input