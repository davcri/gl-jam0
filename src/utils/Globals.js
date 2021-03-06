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
    },
    victory: {
      font: 'Squarebit',
      fontSize: 32,
      font: 'Squarebit',
      fill: '#272744',
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
    length: 65, // in tiles
    fights: [30, 40, 50, 60],
    tileSize: 16
  },
  sounds: {
    hit: null,
  }
}