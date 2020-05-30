const W = 16 // tile width in pixels
const H = 16
const SEPARATION = 1
const ATLAS_W = 815 // width in pixels
const ATLAS_H = 373
const TILES_PER_ROW = (ATLAS_W + SEPARATION) / (W + SEPARATION)
const TILES_PER_COL = (ATLAS_H + SEPARATION) / (H + SEPARATION)
const LAST_TILE_ID = 1056

class AtlasGraphic {
  constructor() {}

  init(game) {
    /**
     * @type {Phaser.Game}
     */
    this.game = game
  }

  get TILES() {
    return {
      TERRAIN_LEFT: 19,
      TERRAIN_CENTER: 20,
      TERRAIN_RIGHT: 21
    }
  }

  getWhiteSquare() {
    const square = new Phaser.Sprite(this.game, 0, 0, 'atlas')
    square.crop(new Phaser.Rectangle(136, 85, W, H))
    return square
  }

  getRandomHead() {
    const tileIds = [
      505, 506, 507, 508, 509, 510, 511, 512
    ]
    return this.getTileById(this.game.rnd.pick(tileIds))
  }

  getRandomTorso() {
    const tileIds = [
      255, 260, 261, 555, 601, 649, 652
    ].concat([
      // don't know if I like these
      253
    ])
    return this.getTileById(this.game.rnd.pick(tileIds))
  }

  getRandomHelmet() {
    const tileIds = [
      33, 34, 35, 36, 37, 38, 39
    ]
    return this.getTileById(this.game.rnd.pick(tileIds))
  }

  getRandomWeapon() {
    const tileIds = [
      369, 370, 468, 375, 321, 609, 850, 191
    ]
    return this.getTileById(this.game.rnd.pick(tileIds))
  }

  getRandomTile() {
    return this.getTileById(this.game.rnd.integerInRange(0, LAST_TILE_ID))
  }

  getTileById(id) {
    if (id > LAST_TILE_ID || id < 0) {
      const spr = this.getWhiteSquare()
      spr.tint = 0xff0000 // error tile
      console.error('Tile id not valid: ', id);
      return spr
    }

    id = id - 1
    const tile = new Phaser.Sprite(this.game, 0, 0, 'atlas')
    tile.crop(new Phaser.Rectangle(
      (id % TILES_PER_ROW) * (W + SEPARATION),
      (Math.floor(id / TILES_PER_ROW)) * (H + SEPARATION),
      16, 16
    ))
    return tile
  }
}

const Atlas = new AtlasGraphic()
export default Atlas