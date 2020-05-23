import Phaser, { Rectangle, Input, Keyboard } from 'phaser-ce'
import Globals from '../utils/Globals'
import Atlas from '../utils/AtlasGraphic'

export default class extends Phaser.Group {
  constructor({ game }) {
    super(game, null)
    this.speed = 100

    // head
    this.head = Atlas.getRandomHead()

    // torso
    this.torso = Atlas.getRandomTorso()
    this.torso.scale.set(1, this.game.rnd.pick([0.9, 1.1, 1.0]))
    this.torso.anchor.set(0.5)
      // helmet
    if (this.game.rnd.normal() > 0) {
      this.helmet = Atlas.getRandomHelmet()
    }
    // weapon
    this.weapon = Atlas.getRandomWeapon()

    // position body parts
    this.add(this.head)
    this.add(this.torso)
    this.add(this.weapon)
    this.torso.centerX = this.head.centerX
    this.torso.top = this.head.bottom - 4
    this.weapon.left = this.torso.right - 5
    this.weapon.centerY = this.torso.top + 4

    if (this.helmet) {
      this.helmet.centerX = this.head.centerX
      this.helmet.centerY = this.head.centerY - this.game.rnd.integerInRange(1, 3)
      this.helmet.alpha = 1
      this.add(this.helmet)
    }

    // avoid strange issue with positioning after creation
    this.updateTransform()
    this.setIdleAnim()
  }

  setIdleAnim() {
    const idleTime = this.game.rnd.integerInRange(700, 1000)
    this.game.add.tween(this.head).to({
      y: '-.5',
    }, idleTime, Phaser.Easing.Quadratic.InOut, true, 0, -1, true)
    if (this.helmet) {
      this.game.add.tween(this.helmet).to({
        y: '-.5',
      }, idleTime, Phaser.Easing.Quadratic.InOut, true, 0, -1, true)
    }
    this.game.add.tween(this.torso.scale).to({
      x: '-0.05',
    }, idleTime, Phaser.Easing.Quadratic.InOut, true, 0, -1, true)
    this.game.add.tween(this.weapon).to({
      x: '-1',
      y: '-1',
      angle: -5,
    }, idleTime, Phaser.Easing.Quadratic.InOut, true, 0, -1, true)
  }

  update() {

  }
}