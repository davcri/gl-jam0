import PieceData from "./PieceData"
import Atlas from '../../../utils/AtlasGraphic'

/**
 * Totem piece
 */
export default class extends Phaser.Group {
    /**
     * @param {Phaser.Game} game 
     * @param {PieceData} pieceData 
     */
    constructor(game, pieceData) {
        super(game)

        this.data = {
            isInTotem: false,
            previousGuiPos: new Phaser.Point()
        }

        this.name = `Piece - ${pieceData.name}`
        this.tileId = pieceData.tileId
        this.placeholder = pieceData.name === 'Piece Placehoder'
        this.stats = pieceData.stats
        this.sprite = this.makeSprite()
        this.add(this.sprite)
    }

    makeSprite() {
        if (this.placeholder) {
            const square = Atlas.getWhiteSquare()
            square.tint = 0xFF6633
            square.alpha = 0
            return square
        }
        if (this.tileId <= -1) {
            return Atlas.getRandomTile()
        }
        return Atlas.getTileById(this.tileId)
    }
}