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

    this.sfx = new SFX()
    this.showStartScreen()
    // ms since a walk button was pressed. Used for audio
    this.pressedTime = 0  
  }

  showStartScreen() {
    //TODO: IMPROVE
    const amount = 8
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
    for (let index = 0; index < amount; index++) {
      const spr = Atlas.getRandomTile()
      randomAnim(spr, index)
    }

    const touchText = this.game.add.text(Globals.center.x, Globals.height - 30, 'PRESS TO START', {      // fontSize: ,
      fontSize: 32,
      font: 'Squarebit'
    })
    touchText.scale.set(0.5)
    touchText.centerX = Globals.center.x

    this.game.input.onDown.addOnce(() => {
      this.sfx.startGame()
      this.game.camera.flash()
      touchText.destroy()
      this.sprs.forEach(spr => spr.destroy())
      this.startGame()
    })
  }

  startGame() {
    this.mode = 'exploration'

    // const sfx = new SFX()
    this.characters = this.makeCharacters()
    this.dungeon = new Dungeon(this.game)
    this.combat = new Combat(this.game, this.characters)

    this.addMultiple([
      this.dungeon,
      this.combat,
      ...this.characters
    ])
    this.setPositions()
  }

  setPositions() {
    this.characters.forEach((char) => {
      char.bottom = this.dungeon.terrain[0].top
    })
  }

  update() {
    if (this.mode === 'exploration') {
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

      if (this.dungeon.terrain[0].x < -150 && this.mode === 'exploration') {
        this.mode = 'combat'
        this.setCombatPosition()
        this.combat.start()
      }
    } else if (this.mode === 'combat') {

    }
  }

  setCombatPosition() {
    this.characters.forEach((c, idx) => {
      c.stop()
      this.game.camera.flash()
      // hide dungeon
      this.game.add.tween(this.dungeon).to({ alpha: 0 }, 150, Phaser.Easing.Quartic.Out, true)
      // position character
      this.game.add.tween(c).to({
        x: 20,
        y: 100
        // x: 50 - idx * 15,
        // y: 25 + 32 * idx
      }, 500, Phaser.Easing.Exponential.Out, true, 200 + idx * 130)
    })
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