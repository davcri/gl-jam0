import Enemy from "./Enemy";
import Globals from "../../utils/Globals";
import CombatUI from "./CombatUI";
import Totem from "./Totem/Totem";
import Pieces from "../../data/Pieces";
import Piece from "./Totem/Piece";
import Button from "../Button";

class PlayerStatsUI extends Phaser.Group {
  constructor(game, { vSeparation = 12, valueX = 30 } = {}) {
    super(game)
    
    this.buffLabel = new Phaser.Text(this.game, 0, 0, 'buff', Globals.fontStyles.normal)
    this.buffLabel.scale.set(0.3)
    this.buff = new Phaser.Text(this.game, valueX, 0, 'none', Globals.fontStyles.normal)
    this.buff.scale.set(0.3)

    this.atkLabel = new Phaser.Text(this.game, 0, vSeparation, 'atk', Globals.fontStyles.normal)
    this.atkLabel.scale.set(0.3) 
    this.atck = new Phaser.Text(this.game, valueX, this.atkLabel.y, 'none', Globals.fontStyles.normal)
    this.atck.scale.set(0.3)

    this.defLabel = new Phaser.Text(this.game, 0, vSeparation*2, 'def', Globals.fontStyles.normal)
    this.defLabel.scale.set(0.3) 
    this.def = new Phaser.Text(this.game, valueX, this.defLabel.y, 'none', Globals.fontStyles.normal)
    this.def.scale.set(0.3)

    this.alpha = 0

    this.addMultiple([
      this.buffLabel,
      this.atkLabel,
      this.defLabel,
      this.buff,
      this.atck,
      this.def
    ])
  }

}

export default class extends Phaser.Group {
  /**
   * @param {Phaser.Game} game 
   * @param {import("../Character").default[]} characters 
   */
  constructor(game, characters) {
    super(game);

    this.signals = {
      piecePlacedInTotem: new Phaser.Signal(), // Piece, Position 
      pieceRemoveFromTotem: new Phaser.Signal(),
    }

    // this.characters = characters
    this.player = characters[0]
    /**
     * Pieces obtained during this run
     * @type {Piece[]}
     */
    this.availabledPieces = this.makePieces()
    /**
     * 
     */
    this.enemies = []

    this.totem = new Totem(game)
    this.gui = new CombatUI(this.game, this.availabledPieces)
    
    this.buffText = new Phaser.Text(this.game, 0, 0, 'buff', Globals.fontStyles.normal)
    this.buffText.scale.set(0.3)
    this.attackText = new Phaser.Text(this.game, 0, 0, 'atk', Globals.fontStyles.normal)
    this.attackText.scale.set(0.3)
    this.defenseText = new Phaser.Text(this.game, 0, 0, 'def', Globals.fontStyles.normal)
    this.defenseText.scale.set(0.3)

    this.playerStatsUI = new PlayerStatsUI(this.game)

    this.popButton = new Button(this.game, this, { text: 'POP' })
    this.popButton.visible = false

    this.setPositions()
    this.connectSignals()
    this.addMultiple([
      this.totem,
      this.gui,
      this.buffText,
      this.attackText,
      this.defenseText,
      this.playerStatsUI,
      this.popButton
    ])
  }

  connectSignals() {
    this.gui.signals.piecePressed.add(this.onPiecePressed, this)
    this.totem.signals.totemBuilt.add(this.onTotemBuilt, this)
  }

  /**
   * @param {Piece} piece 
   */
  onPiecePressed(piece) {
    if (piece.data.isInTotem) {
      // if (this.game.tweens.isTweening(piece)) return
      // console.log(piece.name);
      
      // const moveTwn = this.game.add.tween(piece).to({
      //   x: piece.data.previousGuiPos.x,
      //   y: piece.data.previousGuiPos.y
      // }, 300, Phaser.Easing.Exponential.InOut, true)
      // moveTwn.onComplete.addOnce(() => {
      //   piece.data.isInTotem = false
      // })
      // this.signals.pieceRemoveFromTotem.dispatch()
      // this.totem.pop()
    } else {
      if (this.game.tweens.isTweening(piece)) return;
      else console.log('Dai non cliccare come un forsennato');
      
      // save current position in data.previousGuiPos
      piece.data.previousGuiPos.copyFrom(piece)
      const target = this.totem.getNextPiecePosition()
      const placeTwn = this.game.add.tween(piece).to({
        x: target.x,
        y: target.y
      }, 300, Phaser.Easing.Exponential.InOut, true)
      placeTwn.onComplete.addOnce(() => {
        piece.data.isInTotem = true
        const totemPosition = this.totem.addPiece(piece)
        this.signals.piecePlacedInTotem.dispatch(piece, totemPosition)
        this.showPopButton()
      })
    }
    this.totem.debugPieces()
  }

  onTotemBuilt() {
    this.gui.showActions()
  }

  setPositions() {
    this.buffText.position.set(40, 32)
    this.attackText.position.set(40, 46)
    this.defenseText.position.set(40, 60)

    this.popButton.scale.set(0.5)

    this.playerStatsUI.position.set(40, 80)
    // this.gui.bottom = Globals.height - 8
    // this.gui.centerX = Globals.width / 2
  }

  makeTurns() {
    return [this.player].concat(this.enemies).sort((a, b) => {
      return (b.stats.speed - a.stats.speed)
    })
  }

  makePieces() {
    const pieces = []
    for (let index = 0; index < Pieces.startingPieces.length; index++) {
      const pieceData = Pieces.startingPieces[index];
      pieces.push(new Piece(game, pieceData))
    }
    return pieces
  }

  start() {
    const enemiesAmount = this.game.rnd.integerInRange(1, 3)
    // create enemies
    for (let index = 0; index < enemiesAmount; index++) {
      const enemy = new Enemy(this.game, 0)
      enemy.alpha = 0.5
      enemy.x = Globals.width - 40 - index * 30
      enemy.y = 50 + index * 5
      this.enemies.push(enemy)
      this.add(enemy)
      if (index === enemiesAmount - 1) {
        enemy.alpha = 1
      }
    }

    this.game.add.tween(this.playerStatsUI).to({
      alpha: 1,
    }, 200, 'Linear', true, 500)

    // this.turns = this.makeTurns()
    // this.turns.forEach((el) => {
    //   console.log(el.name, el.stats.speed);
    // })

    this.game.add.tween(this.gui).to({ alpha: 1 }, 200, 'Quad', true, 500);
  }

  showPopButton() {
    this.popButton.visible = true
    this.popButton.centerY = this.totem.topPiece.centerY
    this.popButton.left = this.totem.topPiece.right + 5
  }
}