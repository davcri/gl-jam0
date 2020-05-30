import Atlas from "../../utils/AtlasGraphic";
import Enemies from "../../data/Enemies";

export default class Enemy extends Phaser.Group {
  constructor(game, tier = 0) {
    super(game);
    const enemyData = this.game.rnd.pick(Enemies.enemyData[tier])
    this.name = `Enemy - ${enemyData.name}`
    this.sprite = Atlas.getTileById(enemyData.tileId)
    this.add(this.sprite)

    this.stats = enemyData.stats
    this.currentHp = this.stats.hp
  }
}