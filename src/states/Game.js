/* globals __DEV__ */
import Phaser, { Rectangle } from 'phaser-ce'
import lang from '../lang'
import Character from '../objects/Character'
import SFX from '../objects/SFX'
import Dungeon from '../objects/Dungeon'
import AtlasGraphic from '../utils/AtlasGraphic'
import Input from '../utils/InputMap'
import Globals from '../utils/Globals'
import Combat from '../objects/Combat'

export default class extends Phaser.State {
  init() {
    AtlasGraphic.init(this.game)
    Input.init(this.game)
    // make the canvas fit the available space
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.stage.smoothed = false
    this.camera.roundPx = false
    
    this.mode = 'exploration'
  }
  preload() {}

  create() {
    // const sfx = new SFX()
    const gameContainer = this.gameContainer = new Phaser.Group(this.game)

    this.characters = this.makeCharacters()
    this.dungeon = new Dungeon(this.game)
    this.combat = new Combat(this.game, this.characters)

    gameContainer.addMultiple([
      this.dungeon,
      this.combat,
      ...this.characters
    ])
    this.add.existing(gameContainer)
    this.setPositions()

    // camera config
    this.camera.scale.setTo(4)
      // this.camera.bounds.setTo(0, 0, this.dungeon.right, Globals.height)
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
      } else if (Input.actionRight() && this.rightMostCharacter.right < this.dungeon.right) {
        this.dungeon.move(-this.moveSpeed)
        this.characters.forEach(c => {
          c.play(c.anims.walk)
        })
      } else {
        this.characters.forEach(c => {
          c.stop();
          c.play(c.anims.idle)
        })
      }

      if (this.dungeon.terrain[0].x < -50 && this.mode === 'exploration') {
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
      c.inputDir = new Phaser.Point()
      this.game.camera.flash()
      this.game.add.tween(this.dungeon).to({ alpha: 0 }, 150, Phaser.Easing.Quartic.Out, true)
      this.game.add.tween(c).to({
        x: 50 - idx * 15,
        y: 25 + 32 * idx
      }, 800, Phaser.Easing.Exponential.Out, true, 200 + idx * 130)
    })
  }

  makeCharacters(characterCount = 3) {
    const chars = []
    for (let index = 0; index < characterCount; index++) {
      const c = new Character({ game })
      c.left = 4
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

  render() {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.dungeon.terrain[0], 32, 32)
      // this.game.debug.cameraInfo(this.game.camera, 32, 32);
    }
  }
}