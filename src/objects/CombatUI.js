import Atlas from "../utils/AtlasGraphic";
import Globals from "../utils/Globals";

export default class extends Phaser.Group {
  constructor(game) {
    super(game);
    this.signals = {
      attackPressed: new Phaser.Signal()
    }

    this.attackButton = this.makeAttackButton()
    this.attackButton.inputEnabled = true
    this.attackButton.events.onInputDown.add(() => {
      //   console.log('attack');
      this.signals.attackPressed.dispatch()
      this.game.add.tween(this.attackButton.scale).to({
        x: '-.1',
        y: '-.1'
      }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, false)
    })

    this.add(this.attackButton)
  }

  makeAttackButton() {
    const attack = this.makePanel()
    attack.anchor.set(0.5)

    const attackIcon = Atlas.getTileById(369)
    attack.addChild(attackIcon)
    attackIcon.centerX = attack.centerX
    attackIcon.centerY = attack.centerY

    return attack
  }

  makePanel(width = 20, height = 20, lineWidth = 1) {
    const top = Atlas.getWhiteSquare()
    top.width = width
    top.height = lineWidth

    const bottom = Atlas.getWhiteSquare()
    bottom.width = width
    bottom.height = lineWidth

    const left = Atlas.getWhiteSquare()
    left.width = lineWidth
    left.height = height

    const right = Atlas.getWhiteSquare()
    right.width = lineWidth
    right.height = height

    // position
    bottom.bottom = height
    right.right = width

    const tmp = new Phaser.Group(this.game)
    tmp.addMultiple([top, bottom, left, right])
    tmp.cacheAsBitmap = true
    tmp.destroy()
    return new Phaser.Sprite(this.game, 0, 0, tmp._cachedSprite.texture)
  }
}