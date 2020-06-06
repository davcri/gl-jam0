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
      // return [
      //   new PieceData({
      //     name: 'Piece1',
      //     tileId: 601,
      //     stats: new PieceStats({
      //         evocationCost: 1,
      //         speed: 1,
      //         attack: 1,
      //         defense: 5
      //     })  
      //   }),
      //   new PieceData({
      //     name: 'Piece2',
      //     tileId: 748,
      //     stats: new PieceStats({
      //         evocationCost: 1,
      //         speed: 1,
      //         attack: 3,
      //         defense: 3
      //     })  
      //   }),
      //   new PieceData({
      //     name: 'Piece3', // sword
      //     tileId: 417, 
      //     stats: new PieceStats({
      //         evocationCost: 1,
      //         speed: 2,
      //         attack: 5,
      //         defense: 2
      //     })  
      //   }),
      //   new PieceData({
      //     name: 'Piece4', 
      //     tileId: 353, 
      //     stats: new PieceStats({
      //         evocationCost: 1,
      //         speed: 6,
      //         attack: 3,
      //         defense: 3
      //     })  
      //   }),
      //   new PieceData({
      //     name: 'Piece5',
      //     tileId: 663, // randome piece 
      //     stats: new PieceStats({
      //         evocationCost: 1,
      //         speed: Math.floor(Math.random()*6),
      //         attack: Math.floor(Math.random()*6),
      //         defense: Math.floor(Math.random()*6)
      //     })  
      //   }),
      //   new PieceData({
      //     name: 'Piece6',
      //     tileId: 260, 
      //     stats: new PieceStats({
      //         evocationCost: 1,
      //         speed: 4,
      //         attack: 4,
      //         defense: 4
      //     })  
      //   }),
      // ]
  }

  get randomPiece() {
    return new PieceData({
        name: 'Piece1',
        tileId: -1, // random
        stats: new PieceStats({
            evocationCost: 1,
            speed: Math.floor(Math.random()*6),
            attack: Math.floor(Math.random()*6),
            defense: Math.floor(Math.random()*6)
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