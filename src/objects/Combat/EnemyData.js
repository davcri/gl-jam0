/**
 * @typedef {Object} EnemyDataConf
 * @property {string} name
 * @property {number} tileId
 * @property {number} tier
 * @property {import('../Stats')} stats
 */

 /**
  * 
  */
export default class EnemyData {
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