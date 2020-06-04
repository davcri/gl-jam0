import Enemy from "./Enemy";
import Globals from "../../utils/Globals";
import CombatUI from "./CombatUI";
import Totem from "./Totem/Totem";
import Pieces from "../../data/Pieces";
import Piece from "./Totem/Piece";
import Button from "../Button";
import Atlas from "../../utils/AtlasGraphic";

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

    this.arrow = Atlas.getTileById(1034)
    this.arrow.visible = false
    
    this.setPositions()
    this.connectSignals()
    this.addMultiple([
      this.totem,
      this.gui,
      this.buffText,
      this.attackText,
      this.defenseText,
      this.playerStatsUI,
      this.popButton,
      this.arrow
    ])
  }

  connectSignals() {
    this.gui.signals.piecePressed.add(this.onPiecePressed, this)
    this.gui.confirmTotemButton.released.add(this.onTotemConfirmed, this)
    this.totem.signals.totemBuilt.add(this.onTotemBuilt, this)
    this.popButton.released.add(this.onPopButtonReleased, this)
  }

  /**
   * @param {Piece} piece 
   */
  onPiecePressed(piece) {
    if (piece.data.isInTotem) {
      return
    } else {
      if (this.placeTwn && this.placeTwn.isRunning) return
      else console.log('Dai non cliccare come un forsennato')
      
      // save current position in data.previousGuiPos
      piece.data.previousGuiPos.copyFrom(piece)
      const target = this.totem.getNextPiecePosition()
      this.placeTwn = this.game.add.tween(piece).to({
        x: target.x,
        y: target.y
      }, 300, Phaser.Easing.Exponential.InOut, true)
      this.placeTwn.onComplete.addOnce(() => {
        piece.data.isInTotem = true
        const totemPosition = this.totem.addPiece(piece)
        this.signals.piecePlacedInTotem.dispatch(piece, totemPosition)
        this.updatePopButton()
      })
    }
    // this.totem.debugPieces()
  }

  onTotemBuilt() {
    this.gui.showActions()
  }

  onPopButtonReleased() {
    const piece = this.totem.topPiece
    if (this.game.tweens.isTweening(piece)) return
    console.log(piece.name);
    
    const moveTwn = this.game.add.tween(piece).to({
      x: piece.data.previousGuiPos.x,
      y: piece.data.previousGuiPos.y
    }, 300, Phaser.Easing.Exponential.InOut, true)
    moveTwn.onComplete.addOnce(() => {
      piece.data.isInTotem = false
    })
    this.signals.pieceRemoveFromTotem.dispatch()
    this.totem.pop()
    this.gui.confirmTotemButton.visible = false
    this.updatePopButton()
  }

  onTotemConfirmed() {
    this.popButton.visible = false
    this.gui.confirmTotemButton.visible = false

    const turns = this.makeTurns()

    this.turnInfo = Atlas.getWhiteSquare()
    this.turnInfo.y = 20
    let turnMessage = ''
    if (turns[0] === this.player) {
      turnMessage = `${this.player.name}'s turn`
      this.turnInfo.tint = Globals.palette[4]
    } else {
      turnMessage = `${this.enemies[0].name}'s turns`
      this.turnInfo.tint = Globals.palette[3]
    }
    this.turnInfoText = new Phaser.Text(this.game, 0, 0, turnMessage, Globals.fontStyles.normal)
    this.add(this.turnInfo)
    this.turnInfo.width = Globals.width + 300
    this.turnInfo.height = Globals.height * 0.5
    this.turnInfo.angle = this.game.rnd.integerInRange(3, 7)

    this.turnInfoText.scale.set(0.65)
    this.turnInfoText.wordWrap = true
    this.turnInfoText.wordWrapWidth = Globals.width * 0.9
    this.turnInfoText.alpha = 0
    this.turnInfoText.angle = this.turnInfo.angle
    this.turnInfoText.centerX = Globals.center.x
    this.turnInfoText.centerY = this.turnInfo.centerY 
    this.add(this.turnInfoText)

    const showTwn = this.game.add.tween(this.turnInfo).from({
      angle: this.game.rnd.integerInRange(-30, 30),
      alpha: 0,
      width: '+100',
      height: '+70'
    }, 230, Phaser.Easing.Quadratic.In, true)
    showTwn.onComplete.add(() => {
      // TODO: add hide on click
      // TODO: prevent input when shown
      this.game.camera.shake(0.003, 180)
      this.game.add.tween(this.turnInfoText).to({
        alpha: 1,
      }, 200, Phaser.Easing.Cubic.Out, true).onComplete.addOnce(() => {
        // hide and destroy
        const delay = 1000
        this.game.add.tween(this.turnInfo).to({
          alpha: 0,
          y: '+70',
        }, 200, Phaser.Easing.Quadratic.Out, true, delay).onComplete.addOnce(() => {
          this.turnInfo.destroy()
        })
        this.game.add.tween(this.turnInfoText).to({
          alpha: 0,
          y: '+70',
        }, 200, Phaser.Easing.Quadratic.Out, true, delay).onComplete.addOnce(() => {
          this.turnInfoText.destroy()
        })
      })
    })

    // this.arrow.visible = true
    // this.arrow.bottom = turns[0].top
    // this.arrow.centerX = turns[0].centerX
    // this.game.add.tween(this.arrow).from({
    //   y: '-1',
    //   alpha: 0.8
    // }, 250, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
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
    const activeEnemy = this.getActiveEnemy()
    if (activeEnemy == undefined) {
      console.error('No active enemy');
    }

    // console.log(activeEnemy.name, 'speed', activeEnemy.stats.speed);
    // console.log('player speed', this.player.stats.speed);
    
    this.player.combatStats.speed
    return [activeEnemy, this.player].sort((a, b) => {
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

  /**
   * @returns {Enemy}
   */
  getActiveEnemy() {
    return this.enemies.find(enemy => enemy.alpha === 1)
  }

  updatePopButton() {
    if (this.totem.topPiece === null) {
      this.popButton.visible = false
      return
    }
    this.popButton.visible = true
    this.popButton.centerY = this.totem.topPiece.centerY
    this.popButton.left = this.totem.topPiece.right + 5
  }
}