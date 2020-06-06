export default {
  moveSpeed: 60,
  width: 240,
  height: 160,
  center: {
    x: 120,
    y: 80
  },
  fontStyles: {
    normal: {
        font: 'Squarebit',
        fontSize: 32,
        font: 'Squarebit',
        fill: '#fbf5ef',
    }
  },
  // PALETTE https://lospec.com/palette-list/oil-6
  palette: [
    0xfbf5ef,
    0xf2d3ab,
    0xc69fa5,
    0x8b6d9c,
    0x494d7e,
    0x272744
  ],
  paletteExtra: {
    green: 0xaaff77,
    red: 0xaa3322,
  },
  dungeon: {
    length: 60, // in tiles
    // fights: [50, 85, 120], // x coordinate for the fights
    fights: [5, 10, 15],
    tileSize: 16
  },
  sounds: {
    hit: null,
  }
}