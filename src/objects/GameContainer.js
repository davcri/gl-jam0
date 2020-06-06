import Atlas from '../utils/AtlasGraphic'
import Input from '../utils/InputMap'
import Globals from '../utils/Globals'
import Character from './Character'
import Dungeon from './Dungeon'
import Combat from './Combat/Combat'
import SFX from './SFX'

export default class GameContainer extends Phaser.Group {
  constructor(game) {
    super(game)

    this.fights = Array.from(Globals.dungeon.fights)

    this.sfx = new SFX()
    this.showStartScreen()
      // ms since a walk button was pressed. Used for audio
    this.pressedTime = 0
    this.hintTimer = 0
  }

  showStartScreen() {
    this.sfx.startGame()

    this.sprs = []
    const randomAnim = (spr, index) => {
      spr.anchor.set(0.5)
      spr.position.set(Globals.width / 2, Globals.height / 2)
      this.add(spr)
      this.sprs.push(spr)
        // from
      const rndX = this.game.rnd.integerInRange(-4, 4)
      const rndY = this.game.rnd.integerInRange(-2, -10)
        // to 
      spr.position.set(
        Globals.center.x + this.game.rnd.integerInRange(-14, 14),
        Globals.center.y + this.game.rnd.integerInRange(-14, 14)
      )
      spr.angle = this.game.rnd.integerInRange(-80, 80)
      const twn = this.game.add.tween(spr).to({
        alpha: 0,
        x: `${rndX}`,
        y: `${rndY}`,
        angle: this.game.rnd.integerInRange(-5, 5)
      }, 2000, Phaser.Easing.Exponential.InOut, true, index * 200, -1, true)
    }

    // LOGO
    // for (let index = 0; index < amount; index++) {
    //   const spr = Atlas.getRandomTile()
    //   randomAnim(spr, index)
    // }

    const touchText = this.game.add.text(Globals.center.x, Globals.height - 30, 'CLICK/TAP TO START', Globals.fontStyles.normal)
    touchText.scale.set(0.4)
    touchText.tint = Globals.palette[3]
    touchText.centerX = Globals.center.x

    const titleText = this.game.add.text(Globals.center.x, 15, 'TOT\'EM UP', Globals.fontStyles.normal)
    titleText.scale.set(0.9)
    titleText.tint = Globals.palette[1]
    titleText.centerX = Globals.center.x

    this.game.input.onDown.addOnce(() => {
      this.sfx.kick()
      this.game.camera.flash()
      titleText.destroy()
      touchText.destroy()
      this.sprs.forEach(spr => spr.destroy())
      this.startGame()
    })
  }

  startGame() {
    Globals.music = this.game.add.audio('music')
    Globals.music.play('', 0, 0.2, true)
    Globals.musicwin = this.game.add.audio('musicwin')

    Globals.sounds.hit = this.game.add.audio('hit')
    Globals.sounds.totemPiece = this.game.add.audio('totemPiece')
    Globals.sounds.pieceRemoved = this.game.add.audio('pieceRemoved')
    Globals.sounds.uiPress = this.game.add.audio('uiPress')
    Globals.sounds.explosion = this.game.add.audio('explosion')
    Globals.sounds.battleStart = this.game.add.audio('battleStart')
    Globals.sounds.gameover = this.game.add.audio('gameover')
    Globals.sounds.jump = this.game.add.audio('jump')

    this.mode = 'exploration'

    // hint
    this.arrow = Atlas.getTileById(985)
    this.arrow.visible = false

    // const sfx = new SFX()
    this.characters = this.makeCharacters()
    this.player = this.characters[0]
    this.dungeon = new Dungeon(this.game)
    this.combat = new Combat(this.game, this.characters, this)

    this.addMultiple([
      ...this.characters,
      this.dungeon,
      this.combat,
    ])
    this.setPositions()
    this.connectSignals()
  }

  connectSignals() {
    this.connectCombatSignals()
  }


  resetCombat() {
    this.player.combatStats.attack = 0
    this.player.combatStats.defense = 0
    this.player.combatStats.speed = 0

    this.combat.destroy()
    this.game.time.events.add(1, () => {
      this.combat = new Combat(this.game, this.characters, this)
      this.add(this.combat)
      this.connectCombatSignals()
    });
  }

  connectCombatSignals() {
    this.combat.signals.combatEnded.add(this.onCombatEnded, this)
  }

  onCombatEnded() {
    this.resetCombat()
      // position player
    const twn = this.game.add.tween(this.player).to({
      x: this.player.data.lastExplorationPos.x,
      y: this.player.data.lastExplorationPos.y
    }, 500, Phaser.Easing.Exponential.Out, true, 200)
    this.game.add.tween(this.dungeon).to({ alpha: 1 }, 150, Phaser.Easing.Quartic.Out, true)
    twn.onComplete.addOnce(() => {
      this.mode = 'exploration'
    })
  }

  setPositions() {
    this.characters.forEach((char) => {
      char.bottom = this.dungeon.terrain[0].top
    })
  }

  update() {
    if (this.mode === 'exploration') {
      Input.poll()
      
      if (Input.actioLeft() && this.leftMostCharacter.left > this.dungeon.left) {
        this.dungeon.move(this.moveSpeed)
        this.characters.forEach(c => {
          c.play(c.anims.walk)
        })
        if (this.pressedTime >= this.characters[0].anims.walk[0].totalDuration * 2) {
          this.sfx.step()
          this.pressedTime = 0
        }
        this.pressedTime += this.game.time.elapsedMS
      } else if (Input.actionRight() && this.rightMostCharacter.right < this.dungeon.right) {
        this.dungeon.move(-this.moveSpeed)
        this.characters.forEach(c => {
          c.play(c.anims.walk)
        })
        if (this.pressedTime >= this.characters[0].anims.walk[0].totalDuration * 2) {
          this.sfx.step()
          this.pressedTime = 0
        }
        this.pressedTime += this.game.time.elapsedMS
      } else {
        this.characters.forEach(c => {
          c.stop();
          c.play(c.anims.idle)
        })
      }

      if (this.player.right > this.dungeon.exit.centerX) {
        this.wiiiiiin()
        return
      }

      if (this.mode === 'exploration' && this.fights.length > 0 && this.dungeon.terrain[0].x < -this.fights[0] * Globals.dungeon.tileSize) {
        this.fights.shift()
        this.mode = 'combat'
        this.setCombatPosition()
        this.combat.start()
        this.bringToTop(this.combat)
      }
    } else if (this.mode === 'combat') {
      this.hintTimer += this.game.time.elapsedMS
      if (this.hintTimer > 2000 && !this.hintWasShown && !this.arrow.visible) {
        this.showHint()
      }
      //
    }
  }

  wiiiiiin() {
    this.mode = "BIG VICTORY"
    if (this.gameWon) return
    Globals.music.stop()
    Globals.musicwin.play('', 0, 0.8, true)

    this.gameWon = true
    const animTwn = this.game.add.tween(this.scale).to({
      x: 1.4,
      y: 1.4
    }, 2500, Phaser.Easing.Cubic.In, true, 0);
    //  this.game.add.tween(this).to({ 
    //   alpha: 0
    //  }, 2000, Phaser.Easing.Cubic.In, true, 0);

    const overlay = Atlas.getWhiteSquare()
    overlay.width = Globals.width
    overlay.height = Globals.height
    overlay.alpha = 0
    const fadetwn = this.game.add.tween(overlay).to({
      alpha: 1
    }, 2000, 'Quad', true, 0);
    this.add(overlay)

    animTwn.onComplete.addOnce(() => {
      this.scale.set(1)
      const text = new Phaser.Text(this.game, 0, 0, 'CONGRATULATIONS', Globals.fontStyles.victory)
      const gameCompleted = new Phaser.Text(this.game, 0, 0, 'You escaped the dungeon!', Globals.fontStyles.victory)
      text.scale.set(0.6)
      gameCompleted.scale.set(0.6)
      text.centerX = Globals.center.x
      text.centerY = Globals.center.y - 30
      gameCompleted.centerX = Globals.center.x
      gameCompleted.top = text.bottom + 20

      this.game.add.tween(text).from({
        alpha: 0,
        y: 0,
        angle: 120
      }, 300, Phaser.Easing.Bounce.Out, true).onComplete.addOnce(() => {
        Globals.sounds.totemPiece.play()
      })

      this.game.add.tween(gameCompleted).from({
        alpha: 0,
        y: 400,
        angle: -30
      }, 300, Phaser.Easing.Bounce.Out, true, 220).onComplete.addOnce(() => {
        Globals.sounds.explosion.play()
      })

      this.game.time.events.add(1500, () => {
        overlay.inputEnabled = true
        overlay.events.onInputDown.addOnce(() => {
          this.game.state.restart()
          Globals.musicwin.stop()
        })
      });

      this.add(text)
      this.add(gameCompleted)
    })


  }

  showHint() {
    this.arrow.visible = true
    this.arrow.position.set(27, 134)
    this.game.add.tween(this.arrow).to({
      x: '+3',
    }, 150, 'Quad', true, 0, -1, true)
    this.add(this.arrow)
    this.game.input.onDown.addOnce(() => {
      this.arrow.visible = false
      this.hintWasShown = true
    })
  }

  setCombatPosition() {
    this.player.data.lastExplorationPos.copyFrom(this.player.position)
    this.player.stop()
    this.game.camera.flash()
      // hide dungeon
    this.game.add.tween(this.dungeon).to({ alpha: 0 }, 150, Phaser.Easing.Quartic.Out, true)
      // position player
    this.game.add.tween(this.player).to({
      x: 20,
      y: 100
    }, 500, Phaser.Easing.Exponential.Out, true, 200)
  }

  makeCharacters(characterCount = 1) {
    const chars = []
    for (let index = 0; index < characterCount; index++) {
      const c = new Character({ game })
      c.left = 10
      if (chars.length > 0) {
        c.x += index * chars[chars.length - 1].width
      }
      chars.push(c)
    }
    return chars
  }

  get moveSpeed() {
    return Globals.moveSpeed * game.time.elapsedMS / 1000
  }

  get leftMostCharacter() {
    return this.characters[0]
  }

  get rightMostCharacter() {
    return this.characters[this.characters.length - 1]
  }
}