import PieceData from "../objects/Combat/Totem/PieceData"
import PieceStats from "../objects/Combat/Totem/PieceStats"

/**
 * All totem pieces of the game
 */
class Pieces {
  constructor() {
    const tier0 = [
        this.randomPiece
    ]

    this.pieces = [
        tier0,
    ]
  }

  get startingPieces() {
      return [
          this.randomPiece,
          this.randomPiece,
          this.randomPiece,
          this.randomPiece,
          this.randomPiece,
          this.randomPiece
      ]
  }

  get randomPiece() {
    return new PieceData({
        name: 'Piece1',
        tileId: -1, // random
        stats: new PieceStats({
            evocationCost: 1,
            speed: Math.floor(Math.random()*5),
            attack: Math.floor(Math.random()*5),
            defense: Math.floor(Math.random()*5)
        })
    })
  }

  get PLACEHOLDER() {
    return new PieceData({
        name: 'Piece Placehoder',
        tileId: 0,
        stats: new PieceStats({
            evocationCost: -1,
            speed: -1,
            attack: -1,
            defense: -1,
        })
    })
  }

  //TODO: implement and use JSON instead of loading everything in ram
  toJSON() {}
}

export default new Pieces()