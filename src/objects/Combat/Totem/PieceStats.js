/**
 * @typedef {Object} StatsConf
 * @property {number} evocationCost
 * @property {number} attack
 * @property {number} speed
 */

export default class PieceStats {
    /**
     * @param {StatsConf} statsConf
     */
    constructor(statsConf) {
        this.evocationCost = statsConf.evocationCost
        this.speed = statsConf.speed
        this.attack = statsConf.attack
        // this.buff = statsConf.buff
    }
  }