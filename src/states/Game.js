/* globals __DEV__ */
import Phaser from 'phaser-ce'
import Mushroom from '../objects/Mushroom'
import lang from '../lang'
import Button from '../objects/button'

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    let banner = this.add.text(this.world.centerX, this.game.height - 120, lang.text('welcome'), {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    const button = new Button(this.game, this.parent)
    this.game.add.existing(button)
    
    button.pressed.add(() => {
      if (this.animTwn && this.animTwn.isRunning) return
      const duration = 600
      this.animTwn = this.game.add.tween(this.mushroom).to({ 
        angle: 360
       }, duration, 'Quad', true, 0);
       this.game.add.tween(this.mushroom).to({
         y: '-100',
       }, duration / 2, Phaser.Easing.Quadratic.Out, true).onComplete.add(() => {
         this.game.add.tween(this.mushroom).to({
          y: '+100',
        }, duration / 2, Phaser.Easing.Bounce.Out, true)
       })
    })
    
    button.centerX = this.world.centerX
    button.bottom = this.game.height
    
    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom'
    })

    this.game.add.existing(this.mushroom)
  }

  render() {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
