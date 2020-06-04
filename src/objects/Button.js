import Atlas from "../utils/AtlasGraphic"

export default class Button extends Phaser.Group {
  constructor(game, parent, { text="ATTACK", btnColor = 0xDADADA } = {}) {
    super(game, parent);

    this.pressed = new Phaser.Signal()
    this.released = new Phaser.Signal()

    const buttonSpr = Atlas.getWhiteSquare()
    buttonSpr.anchor.set(0.5, 0.5)
    buttonSpr.width = 40
    buttonSpr.height = 16

    const label = this.label = new Phaser.Text(this.game, 0, 0, text)
    label.anchor.set(0.5, 0.5)
    label.setStyle({
      // backgroundColor: 'rgba(1, 1, 1, 0.2)',
      font: 'Squarebit',
      fontSize: 32,
      font: 'Squarebit',
      fill: '#101A10',
    })
    label.scale.set(0.5)
    // label.scale.y = label.scale.x
    label.alignIn(buttonSpr, Phaser.CENTER)
    // label.padding.set(10, 10)
    buttonSpr.width = label.width + 10

    this.data = {
      originalScale: new Phaser.Point(this.scale.x, this.scale.y)
    }

    this.addMultiple([
        buttonSpr,
        label
    ])

    // enable input
    buttonSpr.inputEnabled = true
    buttonSpr.events.onInputDown.add(() => {
      this.data.originalScale = new Phaser.Point(this.scale.x, this.scale.y)
      this.scale.set(this.scale.x * 0.95)
      this.pressed.dispatch()
    })
    buttonSpr.events.onInputUp.add(() => {
      this.scale.set(this.data.originalScale.x)
      this.released.dispatch()
    })
  }
}