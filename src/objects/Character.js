import Phaser from 'phaser-ce'
import Globals from '../utils/Globals'
import Atlas from '../utils/AtlasGraphic'
import Stats from './Stats'

export default class extends Phaser.Group {
  constructor({ game }) {
    super(game, null)

    this.signals = {
      statsUpdated: new Phaser.Signal() // dispatched when stats are updated because a new piece was added to the totem
    }

    this.data = {
      lastExplorationPos: new Phaser.Point()
    }

    /**
     * Base stats, they change only on level up.
     * Used as a base for combat stats
     */
    this.stats = new Stats({
      attack: 8 + this.game.rnd.integerInRange(0, 4),
      defense: 2 + this.game.rnd.integerInRange(0, 4),
      hp: 13 + this.game.rnd.integerInRange(1, 5),
      speed: this.game.rnd.integerInRange(4, 15)
    })

    /**
     * Used in combat. They are modified during combat thanks to totem pieces and buffs
     */
    this.combatStats = new Stats({
      attack: 0,
      defense: 0,
      speed: 0
    });

    this.name = "Player"

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
  }

  // update() {}

  getCurrentStats() {
    return new Stats({
      attack: this.stats.attack + this.combatStats.attack,
      defense: this.stats.defense + this.combatStats.defense,
      speed: this.stats.speed + this.combatStats.speed
    })
  }

  updateSpeed(value) {
    this.combatStats.speed = value
    this.signals.statsUpdated.dispatch('speed')
  }

  updateAttack(value) {
    this.combatStats.attack = value
    this.signals.statsUpdated.dispatch('attack')
  }

  updateDefense(value) {
    this.combatStats.defense = value
    this.signals.statsUpdated.dispatch('defense')
  }

  resetCombatStats() {
    this.combatStats.speed = 0
    this.combatStats.attack = 0
    this.combatStats.defense = 0
    this.signals.statsUpdated.dispatch()
  }

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

  /**
   * @returns {Phaser.Tween[]}
   */
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