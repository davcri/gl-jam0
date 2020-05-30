import PieceData from "../objects/Combat/Totem/PieceData"
import PieceStats from "../objects/Combat/Totem/PieceStats"

/**
 * All totem pieces of the game
 */
class Pieces {
  constructor() {
    const tier0 = [
        new PieceData({
            name: 'Piece1',
            tileId: -1, // random
            stats: new PieceStats({
                evocationCost: 1,
            })
        })
    ]

    this.pieces = [
        tier0,
    ]
  }

  get startingPieces() {
      return [
          this.pieces[0][0],
          this.pieces[0][0],
          this.pieces[0][0],
          this.pieces[0][0],
          this.pieces[0][0],
          this.pieces[0][0]
      ]
  }

  get PLACEHOLDER() {
    return new PieceData({
        name: 'Piece Placehoder',
        tileId: 0,
        stats: new PieceStats({
            evocationCost: -1,
        })
    })
  }

  //TODO: implement and use JSON instead of loading everything in ram
  toJSON() {}
}

export default new Pieces()