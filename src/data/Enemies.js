import Stats from '../objects/Stats'
import EnemyData from '../objects/Combat/EnemyData'


class Enemies {
  constructor() {
    const tier0 = [
      new EnemyData({
        tier: 0,
        tileId: 317,
        name: "Dark Bruschettona",
        stats: new Stats({
          attack: 10,
          hp: 10,
          speed: 10,
          defense: 1
        })
      }),
      new EnemyData({
        tier: 0,
        tileId: 319,
        name: "Oliva Dark",
        stats: new Stats({
          hp: 10,
          attack: 10,
          speed: 12,
          defense: 10
        })
      })
    ]

    this.enemyData = [
      tier0
    ]
  }

  //TODO: implement and use JSON instead of loading everything in ram
  toJSON() {}
}

export default new Enemies()