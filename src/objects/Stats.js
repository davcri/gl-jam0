/**
 * @typedef {Object} StatsConf
 * @property {number} hp
 * @property {number} speed
 * @property {number} attack
 * @property {number} defense
 */
export default class {
  /**
   * @param {StatsConf} data 
   */
  constructor(data) {
    this.hp = data.hp
    this.speed = data.speed
    this.attack = data.attack
    this.defense = data.defense
  }
}