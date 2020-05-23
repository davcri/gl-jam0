import Globals from "../utils/Globals";
import Atlas from "../utils/AtlasGraphic";

export default class extends Phaser.Group {
  constructor(game) {
    super(game, null);

    const topMarkers = this.topMarkers = []

    this.terrain = []
    for (let index = 0; index < 20; index++) {
      if (index === 0) {
        const tile = Atlas.getTileById(Atlas.TILES.TERRAIN_LEFT)
        this.terrain.push(tile)
      } else if (index === 19) {
        const tile = Atlas.getTileById(Atlas.TILES.TERRAIN_RIGHT)
        tile.left = this.terrain[this.terrain.length - 1].right
        this.terrain.push(tile)
      } else {
        const tile = Atlas.getTileById(Atlas.TILES.TERRAIN_CENTER)
        tile.left = this.terrain[this.terrain.length - 1].right
        this.terrain.push(tile)
      }
    }

    this.addMultiple([
      ...this.terrain,
      ...topMarkers
    ])

    this.setPosition()
  }

  setPosition() {
    this.terrain.forEach((tile) => {
      tile.bottom = Globals.height - 20
    })
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
  }
}