/**
 * @typedef {Object} StatsConf
 * @property {number} evocationCost
 * @property {number} attack
 * @property {number} speed
 * @property {number} defense
 */

export default class PieceStats {
    /**
     * @param {StatsConf} statsConf
     */
    constructor(statsConf) {
        this.evocationCost = statsConf.evocationCost
        this.speed = statsConf.speed
        this.attack = statsConf.attack
        this.defense = statsConf.defense
        // this.buff = statsConf.buff
    }
  }