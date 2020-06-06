import Stats from '../objects/Stats'
import EnemyData from '../objects/Combat/EnemyData'


class Enemies {
  constructor() {
    const tier0 = [
      new EnemyData({
        tier: 0,
        tileId: 317,
        name: "DarkBrusketta",
        stats: new Stats({
          attack: 10,
          hp: 10,
          speed: 10,
          defense: 8
        })
      }),
      new EnemyData({
        tier: 0,
        tileId: 318,
        name: "Skatelon",
        stats: new Stats({
          hp: 14,
          attack: 10,
          speed: 6,
          defense: 3
        })
      }),
      new EnemyData({
        tier: 0,
        tileId: 367,
        name: "Miya senza moto",
        stats: new Stats({
          hp: 6,
          attack: 12,
          speed: 999,
          defense: 5
        })
      }),
      new EnemyData({
        tier: 0,
        tileId: 811,
        name: "SAVE ME!",
        stats: new Stats({
          hp: 12,
          attack: 7,
          speed: 1,
          defense: 5
        })
      }),
      new EnemyData({
        tier: 0,
        tileId: 898,
        name: "PLZ try apple OS",
        stats: new Stats({
          hp: 12,
          attack: 5,
          speed: 10,
          defense: 7
        })
      }),
      new EnemyData({
        tier: 0,
        tileId: 948,
        name: "enne",
        stats: new Stats({
          hp: 20,
          attack: 6,
          speed: 6,
          defense: 6
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