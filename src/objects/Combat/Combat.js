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
    this.turns = []

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

    if (this.game == null) {
      return
    }
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
  constructor(game, characters, parent) {
    super(game, parent);

    this.signals = {
      piecePlacedInTotem: new Phaser.Signal(), // Piece, Position 
      pieceRemovedFromTotem: new Phaser.Signal(),
      attackButtonPressed: new Phaser.Signal(),
      combatEnded: new Phaser.Signal()
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
    this.onDestroy.addOnce(this.onDestroyCalled, this)
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
      
      Globals.sounds.uiPress.play()
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
    Globals.sounds.totemPiece.play()
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
    Globals.sounds.pieceRemoved.play()
    this.totem.pop()
    this.gui.confirmTotemButton.visible = false
    this.updatePopButton()
    this.updatePlayerStats()
  }

  onTotemConfirmed() {
    Globals.sounds.uiPress.play()
    this.popButton.visible = false
    this.gui.confirmTotemButton.visible = false
    
    // calculate who starts
    const turns = this.turns = this.makeTurns()
    this.isPlayerTurn = turns[0] === this.player
    this.changeTurn(this.isPlayerTurn)
  }

  /**
   * @param {boolean} isPlayerTurn 
   */
  changeTurn(isPlayerTurn) {
    this.turnInfo = Atlas.getWhiteSquare()
    this.turnInfo.y = 20
    let turnMessage = ''
    if (isPlayerTurn) {
      turnMessage = `${this.player.name}'s turn`
      this.turnInfo.tint = Globals.palette[4]
    } else {
      turnMessage = `${this.enemy.name}'s turns`
      this.turnInfo.tint = Globals.palette[3]
    }
    this.turnInfoText = new Phaser.Text(this.game, 0, 0, turnMessage, Globals.fontStyles.normal)
    this.add(this.turnInfo)
    this.add(this.turnInfoText)
    // config and animate it
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
    const showTwn = this.game.add.tween(this.turnInfo).from({
      angle: this.game.rnd.integerInRange(-30, 30),
      alpha: 0,
      width: '+100',
      height: '+70'
    }, 230, Phaser.Easing.Quadratic.In, true)
    showTwn.onComplete.add(() => {
      Globals.sounds.explosion.play()
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
          if (isPlayerTurn) {
            this.onPlayerTurnStarted()
          } else {
            this.onEnemyTurnStarted()
          }
          this.turnInfoText.destroy()
        })
      })
    })
  }

  onPlayerTurnStarted() {
    this.gui.attackButton.fns.show()
    this.gui.attackButton.pressed.addOnce(() => {
      this.signals.attackButtonPressed.dispatch()
      this.onAttackButtonPressed()
    })
  }

  onAttackButtonPressed() {
    this.doPlayerAttack()
  }

  doPlayerAttack() {
    const damage = Math.max(0, this.player.getCurrentStats().attack - this.enemy.stats.defense)
    this.enemy.currentHp = Math.max(0, this.enemy.currentHp - damage)
    this.enemyHpValue.text = this.enemy.currentHp
    this.showDamage(damage)
    // flash
    this.game.add.tween(this.enemy).to({
      alpha: 0
    }, 40, Phaser.Easing.Quadratic.InOut, true, 0, 3, true)
    Globals.sounds.hit.play()

    if (this.enemy.currentHp <= 0) {
      // player won!
      this.onPlayerWon()
    } else {
      // start enemy turn
      this.game.time.events.add(1000, () => {
        this.isPlayerTurn = false
        this.changeTurn(this.isPlayerTurn)
      });
    }
  }

  showDamage(damage) {
    if (this.isPlayerTurn) {
      this.game.camera.shake(0.001, 200)
    } else {
      this.game.camera.shake(0.003, 300)
    }
    // TODO
  }

  onPlayerWon() {
    const defeatTwn = this.game.add.tween(this.enemy).to({
      x: '-0.3',
      angle: '-2',
      alpha: 0
    }, 100, Phaser.Easing.Quadratic.InOut, true, 0, 7)
    defeatTwn.onComplete.addOnce(() => {
      this.enemy.destroy()
      this.game.time.events.add(500, () => {
        this.onCombatEnded()
      });
    })
  }

  onCombatEnded() {
    Globals.sounds.jump.play()
    this.game.add.tween(this).to({
      alpha: 0,
    }, 300, 'Quad', true).onComplete.addOnce(() => {
      this.signals.combatEnded.dispatch()
    })
  }

  onEnemyTurnStarted() {
    this.game.time.events.add(600, () => {
      const damage = Math.max(0, this.enemy.stats.attack - this.player.getCurrentStats().defense)
      this.showDamage(damage)
      Globals.sounds.hit.play()
      this.player.stats.hp = Math.max(0, this.player.stats.hp - damage)
      this.playerStatsUI.hp.text = this.player.stats.hp
      this.game.add.tween(this.player).to({
        alpha: 0
      }, 40, Phaser.Easing.Quadratic.InOut, true, 0, 3, true)

      if (this.player.stats.hp <= 0) {
        this.game.camera.flash(Globals.paletteExtra.red)
        this.game.time.events.add(1800, () => {
          this.onGameOver()
        });
      } else {
        this.game.time.events.add(600, () => {
          this.isPlayerTurn = true
          this.changeTurn(this.isPlayerTurn = true)
        });
      }
    });
  }

  onGameOver() {
    Globals.music.stop()
    Globals.sounds.gameover.play()
    const overlay = Atlas.getWhiteSquare()
    overlay.tint = Globals.paletteExtra.red
    overlay.width = Globals.width
    overlay.height = Globals.height
    overlay.alpha = 0
    this.add(overlay)
    this.bringToTop(overlay)
    this.parent.bringToTop(this)

    const gameovertext = new Phaser.Text(this.game, 0, 0,
      'GAME OVER', Globals.fontStyles.normal)
    gameovertext.scale.set(0.6)
    gameovertext.centerX = Globals.center.x
    gameovertext.centerY = Globals.center.y

    const touchText = new Phaser.Text(this.game, 0, 0,
      'touch to restart', Globals.fontStyles.normal)
    touchText.scale.set(0.3)
    touchText.alpha = 0.5
    touchText.top = gameovertext.bottom + 10
    touchText.centerX = Globals.center.x
    
    this.add(touchText)
    this.add(gameovertext)

    this.game.add.tween(touchText).to({ alpha: 1 }, 500, 'Quad', true, 0);
    this.game.add.tween(gameovertext).to({ alpha: 1 }, 500, 'Quad', true, 0);
    
    this.game.add.tween(overlay).to({
      alpha: 1
    }, 500, 'Quad', true).onComplete.addOnce(() => {
      overlay.inputEnabled = true
      overlay.events.onInputDown.addOnce(() => {
        Globals.music.stop()
        this.game.state.restart()
      })
    })
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
  }

  makeTurns() {
    const activeEnemy = this.getActiveEnemy()
    if (activeEnemy == undefined) {
      console.error('No active enemy');
    }

    if (this.player.getCurrentStats().speed >= this.enemy.stats.speed) {
      return [this.player, this.enemy]
    } else {
      return [this.enemy, this.player]
    }
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
    Globals.sounds.battleStart.play()
    const enemy = this.enemy = new Enemy(this.game, 0)
    enemy.scale.set(1.2)
    enemy.x = Globals.width - 60
    enemy.y = 40
    this.enemies.push(enemy)
    this.add(enemy)

    // update enemy stats
    this.enemyAttackValue.text = enemy.stats.attack
    this.enemySpeedValue.text = enemy.stats.speed
    this.enemyDefValue.text = enemy.stats.defense
    this.enemyHpValue.text = enemy.currentHp

    this.game.add.tween(this.playerStatsUI).to({
      alpha: 1,
    }, 200, 'Linear', true, 500)

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

  onDestroyCalled() {
    // attempt to fix a bug in order to remove a workaround.
    this.player.signals.statsUpdated.remove(this.playerStatsUI.updateStats)
  }
}