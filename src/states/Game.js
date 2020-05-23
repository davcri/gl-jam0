/* globals __DEV__ */
import Phaser, { Rectangle } from 'phaser-ce'
import lang from '../lang'
import Character from '../objects/Character'
import SFX from '../objects/SFX'
import Dungeon from '../objects/Dungeon'
import AtlasGraphic from '../utils/AtlasGraphic'
import Input from '../utils/InputMap'
import Globals from '../utils/Globals'

export default class extends Phaser.State {
  init() {
    AtlasGraphic.init(game)
    Input.init(game)
    this.game.stage.smoothed = false
      // this.camera.scale.set(4, 4)
    this.camera.roundPx = false
  }
  preload() {}

  create() {
    const gameSize = { x: 200, y: 150 }
    const gameContainer = this.gameContainer = new Phaser.Group(this.game)
    gameContainer.scale.set(this.game.width / gameSize.x, this.game.height / gameSize.y)
      // const sfx = new SFX()

    const chars = this.characters = []
    for (let index = 0; index < 3; index++) {
      const c = new Character({ game })
      if (chars.length > 0) {
        c.x = index * chars[chars.length - 1].width
      }
      chars.push(c)
    }

    const dungeon = this.dungeon = new Dungeon(this.game)

    this.characters.forEach((char) => {
      char.bottom = this.dungeon.terrain[0].top
    })

    gameContainer.addMultiple([
      dungeon,
      ...this.characters
    ])
    this.add.existing(gameContainer)
  }

  update() {
    if (Input.actioLeft()) {
      this.dungeon.move(this.moveSpeed)
    }
    if (Input.actionRight()) {
      this.dungeon.move(-this.moveSpeed)
    }
  }

  get moveSpeed() {
    return Globals.moveSpeed * game.time.elapsedMS / 1000
  }

  render() {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}