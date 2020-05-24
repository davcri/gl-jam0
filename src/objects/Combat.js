import Enemy from "../Enemy";
import Globals from "../utils/Globals";
import CombatUI from "./CombatUI";

export default class extends Phaser.Group {
  /**
   * @param {Phaser.Game} game 
   * @param {import("./Character").default[]} characters 
   */
  constructor(game, characters) {
    super(game);

    this.signals = {
      turnsCreated: new Phaser.Signal()
    }

    this.characters = characters
    this.enemies = []

    this.gui = new CombatUI(this.game)
    this.gui.alpha = 0

    this.setPositions()

    this.add(this.gui)
  }

  setPositions() {
    this.gui.bottom = Globals.height
    this.gui.centerX = Globals.width / 2
  }

  makeTurns() {
    return this.characters.concat(this.enemies).sort((a, b) => {
      return (b.stats.speed - a.stats.speed)
    })
  }

  start() {
    const enemiesAmount = this.game.rnd.integerInRange(1, 3)
      // create enemies
    for (let index = 0; index < enemiesAmount; index++) {
      const enemy = new Enemy(this.game, 0)
      enemy.x = Globals.width - 50 - index * 10
      enemy.y = 30 + index * 20
      this.enemies.push(enemy)
      this.add(enemy)
    }

    this.turns = this.makeTurns()
    console.log('TURNS');
    this.turns.forEach((el) => {
      console.log(el.name, el.stats.speed);
    })

    this.game.add.tween(this.gui).to({ alpha: 1 }, 200, 'Quad', true, 500);
  }
}