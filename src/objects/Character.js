import Phaser from 'phaser-ce'
import Globals from '../utils/Globals'
import Atlas from '../utils/AtlasGraphic'

export default class extends Phaser.Group {
  constructor({ game }) {
    super(game, null)

    // head
    this.head = this.makeHead()

    // torso
    this.torso = Atlas.getRandomTorso()
    this.torso.scale.set(1, this.game.rnd.pick([0.9, 1.1, 1.0]))
    this.torso.anchor.set(0.5)

    // helmet
    if (this.game.rnd.normal() > 0) {
      this.helmet = this.makeHelmet()
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

    this.currentAnim = null
      // avoid strange issue with positioning after creation
    this.updateTransform()
    this.anims = {
      idle: this.makeIdleAnims(),
      walk: this.makeWalkAnim()
    }

    // this.play(this.anims.idle)
    // this.stop()
    // this.play(this.anims.walk)

    //	Create our BitmapData object at a size of 32x64
    this.bmd = game.add.bitmapData(32, 64);

    //  And apply it to 100 randomly positioned sprites
    for (var i = 0; i < 100; i++) {
      this.game.add.sprite(game.world.randomX, game.world.randomY, this.bmd);
    }
  }

  update() {}

  makeHead() {
    const spr = Atlas.getRandomHead()
    spr.anchor.set(0.5, 1)
    return spr
  }

  makeHelmet() {
    const spr = Atlas.getRandomHelmet()
    spr.anchor.set(0.5, 1)
    return spr
  }

  stop() {
    if (this.currentAnim === null) return
    this.currentAnim.forEach(twn => {
      twn.pause()
    })
  }

  /**
   * @param {Phaser.Tween[]} anims 
   */
  play(anims) {
    // if (this.currentAnim === anims && this.currentAnim[0].isPlaying) return
    this.currentAnim = anims
    anims.forEach(twn => {
      if (twn.isPaused) {
        twn.resume()
      } else {
        twn.start()
      }
    })
  }

  makeWalkAnim() {
    const walkAnims = []
    const duration = this.game.rnd.integerInRange(100, 200)

    const characterTwn = this.game.add.tween(this).to({
      y: '-1',
    }, duration, Phaser.Easing.Quadratic.InOut, false, 0, -1, true)
    walkAnims.push(characterTwn)
    return walkAnims
  }

  makeIdleAnims() {
    const idleAnims = []
    const idleTime = this.game.rnd.integerInRange(700, 1000)

    const ease = this.game.rnd.weightedPick([
      Phaser.Easing.Quadratic.InOut,
      Phaser.Easing.Cubic.InOut,
    ])
    const randomAngle = this.game.rnd.integerInRange(-4, 1)
    const headTwn = this.game.add.tween(this.head).to({
      y: '-.5',
      angle: randomAngle
    }, idleTime, ease, false, 0, -1, true)
    if (this.helmet) {
      const helmetTwn = this.game.add.tween(this.helmet).to({
        y: '-.5',
        angle: randomAngle
      }, idleTime, ease, false, 0, -1, true)
      idleAnims.push(helmetTwn)
    }
    const torsoTwn = this.game.add.tween(this.torso.scale).to({
      x: '-0.05',
    }, idleTime, ease, false, 0, -1, true)
    const weaponTwn = this.game.add.tween(this.weapon).to({
      x: '-1',
      y: '-1',
      angle: -5,
    }, idleTime, ease, false, 0, -1, true)

    idleAnims.push(headTwn)
    idleAnims.push(torsoTwn)
    idleAnims.push(weaponTwn)
    return idleAnims
  }
}