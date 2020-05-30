/**
 * @typedef {Object} PieceDataConf
 * @property {string} name
 * @property {import('./PieceStats').default} stats
 * @property {number} tileId
 */

 /**
  * Used to inizialize Piece.js
  */
 export default class PieceData {
    /**
     * @param {PieceDataConf} data 
     */
    constructor(data) {
      this.name = data.name
      this.tileId = data.tileId
      this.stats = data.stats
    }
  }