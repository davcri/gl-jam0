/**
 * @typedef {Object} StatsConf
 * @property {number} evocationCost
 */

export default class PieceStats {
    /**
     * @param {StatsConf} statsConf
     */
    constructor(statsConf) {
        this.evocationCost = statsConf.evocationCost
        /**
         * Activated when the piece is pushed out of the totem
         */
        // this.specialEffect = {}
    }
  }