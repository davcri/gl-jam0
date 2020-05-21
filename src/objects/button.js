export default class Button extends Phaser.Group {
  constructor(game, parent, { btnColor = 0xDADADA } = {}) {
    super(game, parent);

    this.pressed = new Phaser.Signal()
    this.released = new Phaser.Signal()

    const button = this.button = new Phaser.Graphics(this.game)
    button.beginFill(btnColor)
    button.drawRect(0, 0, 200, 70)
    button.endFill()

    const buttonSpr = new Phaser.Sprite(game, 0, 0, button.generateTexture())
    buttonSpr.anchor.set(0.5, 0.5)

    const label = this.label = new Phaser.Text(this.game, 0, 0, 'PRESS ME!')
    label.anchor.set(0.5, 0.5)
    label.setStyle({
      backgroundColor: 'rgba(1, 1, 1, 0.2)',
      font: 'Quantico',
      fill: '#101A10',
      fontSize: 20,
    })

    buttonSpr.addChild(label)

    label.alignIn(buttonSpr, Phaser.CENTER)
    label.wordWrap = true
    label.wordWrapWidth = button.width
    // label.padding.set(10, 10)

    this.addMultiple([
        buttonSpr,
    ])

    buttonSpr.anchor.set(0.5)

    buttonSpr.inputEnabled = true
    buttonSpr.events.onInputDown.add(() => {
      this.scale.set(0.95)
      this.pressed.dispatch()
    })
    buttonSpr.events.onInputUp.add(() => {
      this.scale.set(1)
      this.released.dispatch()
    })
  }
}