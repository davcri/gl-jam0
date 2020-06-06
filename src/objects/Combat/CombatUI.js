import Atlas from "../../utils/AtlasGraphic"
import Globals from "../../utils/Globals"
import Button from "../Button"

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

    this.initPieces(pieces)
    this.initConfirmTotemButton()
    this.initAttackButton()

    this.bar = Atlas.getWhiteSquare()
    this.bar.alpha = 0.2
    this.bar.width = Globals.width
    this.bar.height = 1
    this.bar.y = Globals.height - 30

    this.addMultiple([
      ...this.pieces,
      this.attackButton,
      this.bar
    ])
  }

  initPieces(pieces) {
    this.pieces = pieces
    this.pieces[0].x = 50

    this.pieces.forEach((piece, index) => {
      if (index !== 0) {
        piece.x = this.pieces[index -1].right + 4
      }
      piece.bottom = Globals.height - 8
      piece.sprite.inputEnabled = true
      piece.sprite.events.onInputDown.add(() => this.onPiecePressed(piece))
    });
  }

  initConfirmTotemButton() {
    this.confirmTotemButton = new Button(this.game, this, { text: 'confirm' })
    this.confirmTotemButton.visible = false
    this.confirmTotemButton.buttonSpr.tint = Globals.palette[1]
  }

  initAttackButton() {
    this.attackButton = new Button(this.game, this, { text: 'attack'})
    this.attackButton.scale.set(0.6)
    this.attackButton.position.set(120, 20)
    this.attackButton.visible = false
    this.attackButton.pressed.add(() => {
      this.attackButton.visible = false
    })
    this.attackButton.fns = {
      show:
        () => {
          this.attackButton.alpha = 0
          this.attackButton.visible = true
          this.game.add.tween(this.attackButton).to({
            alpha: 1
          }, 200, 'Linear', true).onComplete.add(() => {
            this.game.add.tween(this.attackButton).to({ y: '-0.5' }, 
              500, 'Quad', true, 300, -1, true);
          })
      }
    }
  }

  onPiecePressed(piece) {
    if (this.alpha === 0) return
    if (this.game.tweens.isTweening(piece)) return
    this.signals.piecePressed.dispatch(piece)
  }

  showActions() {
    this.confirmTotemButton.visible = true
    this.confirmTotemButton.scale.set(0.5)
    this.add(this.confirmTotemButton)
    this.confirmTotemButton.centerX = 80
    this.confirmTotemButton.centerY = 15
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