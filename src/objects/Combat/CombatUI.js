import Atlas from "../../utils/AtlasGraphic";

export default class extends Phaser.Group {
  /**
   * @param {*} game 
   * @param {import('./Totem/Piece').default[]} pieces 
   */
  constructor(game, pieces) {
    super(game)
    this.signals = {
      piecePressed: new Phaser.Signal()
    }

    this.pieces = pieces
    this.pieces[0].x = 30

    this.pieces.forEach((piece, index) => {
      if (index !== 0) {
        piece.x = this.pieces[index -1].right + 4
      }
      piece.sprite.inputEnabled = true
      piece.sprite.events.onInputDown.add(() => {
        if (this.game.tweens.isTweening(piece)) return
        this.signals.piecePressed.dispatch(piece)
      })
    });

    this.addMultiple(this.pieces)
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

  makeAttackButton() {
    const attack = this.makePanel()
    attack.anchor.set(0.5)

    const attackIcon = Atlas.getTileById(369)
    attack.addChild(attackIcon)
    attackIcon.centerX = attack.centerX
    attackIcon.centerY = attack.centerY

    return attack
  }
}