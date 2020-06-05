import Enemy from "./Enemy";
import Globals from "../../utils/Globals";
import CombatUI from "./CombatUI";
import Totem from "./Totem/Totem";
import Pieces from "../../data/Pieces";
import Piece from "./Totem/Piece";
import Button from "../Button";
import Atlas from "../../utils/AtlasGraphic";

class PlayerStatsUI extends Phaser.Group {
  /**
   * @param {*} game 
   * @param {import('../Character').default} player 
   * @param {*} param2 
   */
  constructor(game, player, { vSeparation = 12, valueX = 25 } = {}) {
    super(game)
    
    this.defLabel = new Phaser.Text(this.game, 0, 0, 'def', Globals.fontStyles.normal)
    this.defLabel.scale.set(0.3) 
    this.defLabel.alpha = 0.3
    this.def = new Phaser.Text(this.game, valueX, this.defLabel.y, player.stats.defense, Globals.fontStyles.normal)
    this.def.scale.set(0.3)

    this.atkLabel = new Phaser.Text(this.game, 0, vSeparation, 'atk', Globals.fontStyles.normal)
    this.atkLabel.scale.set(0.3)
    this.atkLabel.alpha = 0.3 
    this.atck = new Phaser.Text(this.game, valueX, this.atkLabel.y, player.stats.attack, Globals.fontStyles.normal)
    this.atck.scale.set(0.3)
    this.atck.bottom = this.atkLabel.bottom

    this.speedLabel = new Phaser.Text(this.game, 0, vSeparation*2, 'spd', Globals.fontStyles.normal)
    this.speedLabel.scale.set(0.3)
    this.speedLabel.alpha = 0.3 
    this.speed = new Phaser.Text(this.game, valueX, this.speedLabel.y + 2, player.stats.speed, Globals.fontStyles.normal)
    this.speed.scale.set(0.3)
    this.speed.bottom = this.speedLabel.bottom

    this.hpLabel = new Phaser.Text(this.game, 0, vSeparation*3, 'hp', Globals.fontStyles.normal)
    this.hpLabel.scale.set(0.3)
    this.hpLabel.alpha = 0.3
    this.hpLabel.tint = Globals.paletteExtra.green 
    this.hp = new Phaser.Text(this.game, valueX, this.hpLabel.y + 2, player.stats.hp, Globals.fontStyles.normal)
    this.hp.scale.set(0.3)
    this.hp.tint = Globals.paletteExtra.green
    this.hp.bottom = this.hpLabel.bottom

    this.alpha = 0

    this.addMultiple([
      // this.buffLabel,
      this.atkLabel,
      this.defLabel,
      this.speedLabel,
      this.hpLabel,
      // this.buff,
      this.atck,
      this.def,
      this.speed,
      this.hp
    ])

    player.signals.statsUpdated.add(this.updateStats, this)
    this.player = player
  }

  updateStats(what) {
    this.atck.text = this.player.stats.attack + this.player.combatStats.attack
    this.def.text = this.player.stats.defense + this.player.combatStats.defense
    this.speed.text = this.player.stats.speed + this.player.combatStats.speed

    this.animate(what)
  }

  animate(what) {
    let elem 
    switch (what) {
      case 'attack':
        elem = this.atck
        break;
      case 'defense':
        elem = this.def
        break;
      case 'speed':
        elem = this.speed
        break;
      default:
        break;
    }
    if (elem == undefined) return
    this.game.add.tween(elem).to({
      alpha: 0,
      y: '-0.5'
    }, 80, Phaser.Easing.Quadratic.InOut, true, 0, 1, true)
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
      pieceRemovedFromTotem: new Phaser.Signal(),
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
    
    // totem labels
    this.defText = new Phaser.Text(this.game, 0, 0, 'def', Globals.fontStyles.normal)
    this.defText.scale.set(0.3)
    this.attackText = new Phaser.Text(this.game, 0, 0, 'atk', Globals.fontStyles.normal)
    this.attackText.scale.set(0.3)
    this.speedText = new Phaser.Text(this.game, 0, 0, 'spd', Globals.fontStyles.normal)
    this.speedText.scale.set(0.3)
    this.defText.alpha = 0.3
    this.attackText.alpha = 0.3
    this.speedText.alpha = 0.3

    // enemy def
    this.enemyDefText = new Phaser.Text(this.game, 0, 0, 'def', Globals.fontStyles.normal)
    this.enemyDefText.scale.set(0.3)
    this.enemyDefValue = new Phaser.Text(this.game, 0, 0, '-', Globals.fontStyles.normal)
    this.enemyDefValue.scale.set(0.3)
    // enemy atck
    this.enemyAttackText = new Phaser.Text(this.game, 0, 0, 'atk', Globals.fontStyles.normal)
    this.enemyAttackText.scale.set(0.3)
    this.enemyAttackValue = new Phaser.Text(this.game, 0, 0, '-', Globals.fontStyles.normal)
    this.enemyAttackValue.scale.set(0.3)
    // enemy speed
    this.enemySpeedText = new Phaser.Text(this.game, 0, 0, 'spd', Globals.fontStyles.normal)
    this.enemySpeedText.scale.set(0.3)
    this.enemySpeedValue = new Phaser.Text(this.game, 0, 0, '-', Globals.fontStyles.normal)
    this.enemySpeedValue.scale.set(0.3)
    // enemy hp
    this.enemyHpText = new Phaser.Text(this.game, 0, 0, 'hp', Globals.fontStyles.normal)
    this.enemyHpText.scale.set(0.3)
    this.enemyHpText.tint = Globals.palette[2]
    this.enemyHpValue = new Phaser.Text(this.game, 0, 0, '-', Globals.fontStyles.normal)
    this.enemyHpValue.scale.set(0.3)
    this.enemyHpValue.tint = Globals.palette[2]
    
    // set alpha 
    const elems = [this.enemyAttackText, this.enemySpeedText, this.enemyDefText, this.enemyHpText]
    elems.forEach(elem => {
      elem.alpha = 0.3
    })

    this.playerStatsUI = new PlayerStatsUI(this.game, this.player)

    this.popButton = new Button(this.game, this, { text: 'POP' })
    this.popButton.visible = false
    this.popButton.buttonSpr.tint = Globals.palette[2]

    this.arrow = Atlas.getTileById(1034)
    this.arrow.visible = false
    
    this.alpha = 0
    
    this.setPositions()
    this.connectSignals()
    this.addMultiple([
      this.totem,
      this.gui,
      this.defText,
      this.attackText,
      this.speedText,
      this.enemyDefText,
      this.enemySpeedText,
      this.enemyAttackText,
      this.enemySpeedValue, 
      this.enemyAttackValue,
      this.enemyHpText,
      this.enemyHpValue,
      this.enemyDefValue,
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
      if (this.placeTwn && this.placeTwn.isRunning) {
        console.log('Dai non cliccare come un forsennato')
        return
      }
      
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
        this.onPiecePlacedInTotem(piece, totemPosition)
      })
    }
    // this.totem.debugPieces()
  }

  onPiecePlacedInTotem(piece, totemPosition) {
    this.updatePopButton()
    this.updatePlayerStats()
  }


  onTotemBuilt() {
    this.gui.showActions()
  }

  onPopButtonReleased() {
    const piece = this.totem.topPiece
    if (this.game.tweens.isTweening(piece)) return
    
    const moveTwn = this.game.add.tween(piece).to({
      x: piece.data.previousGuiPos.x,
      y: piece.data.previousGuiPos.y
    }, 300, Phaser.Easing.Exponential.InOut, true)
    moveTwn.onComplete.addOnce(() => {
      piece.data.isInTotem = false
    })
    this.signals.pieceRemovedFromTotem.dispatch()
    this.onPieceRemovedFromTotem()
  }

  onPieceRemovedFromTotem() {
    this.totem.pop()
    this.gui.confirmTotemButton.visible = false
    this.updatePopButton()
    this.updatePlayerStats()
  }

  updatePlayerStats() {
    this.player.resetCombatStats()

    // if totem is empty
    if (this.totem.freeSlots === Totem.MAX_SIZE) {
      return
    }

    for (let index = 0; index < this.totem.pieces.length; index++) {
      const piece = this.totem.pieces[index];
      if (piece == null || piece.placeholder) {
        continue
      } else {
        switch (index) {
          case 0:
            // update speed
            this.player.updateSpeed(piece.stats.speed)
            break;
          case 1:
            // update atk
            this.player.updateAttack(piece.stats.attack)
            break
          case 2:
            // update def
            this.player.updateDefense(piece.stats.defense)
            break
          default:
            break;
        }
      }
    }
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
    const vSep = 12
    const yStart = 24
    // totem labels
    this.defText.position.set(50, yStart)
    this.attackText.position.set(50, yStart + vSep)
    this.speedText.position.set(50, yStart  + vSep + vSep)

    this.playerStatsUI.position.set(50, 75)

    // enemy labels
    this.enemyDefText.position.set(180, this.playerStatsUI.y)
    this.enemyAttackText.position.set(180, this.playerStatsUI.y + vSep)
    this.enemySpeedText.position.set(180, this.playerStatsUI.y + vSep*2)
    this.enemyHpText.position.set(180, this.playerStatsUI.y + vSep*3)
    const offsetx = 25
    this.enemyDefValue.position.set(180 + offsetx, this.enemyDefText.y)
    this.enemyAttackValue.position.set(180 + offsetx, this.enemyAttackText.y)
    this.enemySpeedValue.position.set(180 + offsetx, this.enemySpeedText.y)
    this.enemyHpValue.position.set(180 + offsetx, this.enemyHpText.y)

    this.popButton.scale.set(0.5)

    // this.gui.bottom = Globals.height - 8
    // this.gui.centerX = Globals.width / 2
  }

  makeTurns() {
    const activeEnemy = this.getActiveEnemy()
    if (activeEnemy == undefined) {
      console.error('No active enemy');
    }

    // TODO: remove forced player
    return [this.player, activeEnemy]
    this.player.combatStats.speed
    return [activeEnemy, this.player].sort((a, b) => {
      return (b.stats.speed - a.stats.speed)
    })
  }

  makePieces() {
    const pieces = []
    for (let index = 0; index < Pieces.startingPieces.length; index++) {
      const pieceData = Pieces.startingPieces[index];
      const piece = new Piece(game, pieceData)
      piece.sprite.tint = Globals.palette[2]
      pieces.push(piece)
    }
    return pieces
  }

  start() {
    const enemy = new Enemy(this.game, 0)
    enemy.scale.set(1.2)
    enemy.x = Globals.width - 60
    enemy.y = 40
    this.enemies.push(enemy)
    this.add(enemy)

    // update enemy stats
    this.enemyAttackValue.text = enemy.stats.attack
    this.enemySpeedValue.text = enemy.stats.speed
    this.enemyDefValue.text = enemy.stats.defense
    this.enemyHpValue.text = enemy.stats.hp

    this.game.add.tween(this.playerStatsUI).to({
      alpha: 1,
    }, 200, 'Linear', true, 500)

    // this.turns = this.makeTurns()
    // this.turns.forEach((el) => {
    //   console.log(el.name, el.stats.speed);
    // })

    this.game.add.tween(this.gui).to({ alpha: 1 }, 200, 'Quad', true, 500);
    this.game.add.tween(this).to({ alpha: 1 }, 200, 'Quad', true, 500);
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