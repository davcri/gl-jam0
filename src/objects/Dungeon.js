import Globals from "../utils/Globals";
import Atlas from "../utils/AtlasGraphic";

/**
 * @typedef {Object} DungeonConfig
 * @property {number} hTiles dungeon width in tiles
 */

export default class extends Phaser.Group {
  /**
   * @param {Phaser.Game} game 
   * @param {DungeonConfig}
   */
  constructor(game, { hTiles = Globals.dungeon.length } = {}) {
    super(game, null);

    this.terrain = this.makeTerrain(hTiles)
    this.helpText = this.makeHelpText()

    this.addMultiple([
      ...this.terrain,
      this.helpText
    ])

    this.setPosition()
  }

  makeHelpText() {
    const helpText = new Phaser.Text(this.game, 0, 0, 'Press "RIGHT ARROW" or "D" to move forward', Globals.fontStyles.normal)
    helpText.scale.set(0.3)
    helpText.alpha = 0.4
    return helpText
  }

  /**
   * @return {Phaser.Sprite[]}
   */
  makeTerrain(hTiles) {
    const terrain = []
    for (let index = 0; index < hTiles; index++) {
      if (index === 0) {
        const tile = Atlas.getTileById(Atlas.TILES.TERRAIN_LEFT)
        terrain.push(tile)
      } else if (index === 19) {
        const tile = Atlas.getTileById(Atlas.TILES.TERRAIN_RIGHT)
        tile.left = terrain[terrain.length - 1].right
        terrain.push(tile)
      } else {
        const tile = Atlas.getTileById(Atlas.TILES.TERRAIN_CENTER)
        tile.left = terrain[terrain.length - 1].right
        terrain.push(tile)
      }
    }
    return terrain
  }

  setPosition() {
    this.terrain.forEach((tile) => {
      tile.bottom = Globals.height - 20
    })
    this.helpText.position.set(50, 30)
  }

  move(amount) {
    this.terrain.forEach(tile => {
      tile.x += amount
        // m.x -= this.speed * this.game.time.physicsElapsed
      if (tile.x < -tile.width) {
        tile.x += amount
          // m.x += this.topMarkers.length * (m.width + this.separation)
      }
    });
    this.helpText.position.x += amount * 0.95
  }
}