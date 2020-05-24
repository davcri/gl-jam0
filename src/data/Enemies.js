import Stats from '../objects/Stats'

/**
 * @typedef {Object} EnemyDataConf
 * @property {string} name
 * @property {number} tileId
 * @property {number} tier
 * @property {Stats} stats
 */
class EnemyData {
  /**
   * @param {EnemyDataConf} data 
   */
  constructor(data) {
    this.name = data.name
    this.tileId = data.tileId
    this.tier = data.tier
    this.stats = data.stats
  }
}

class _Enemies {
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
          dodge: 1
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
          dodge: 1
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


const Enemies = new _Enemies()
export default Enemies