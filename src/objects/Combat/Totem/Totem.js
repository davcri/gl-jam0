import Piece from "./Piece";
import Pieces from "../../../data/Pieces";

/**
 * Totem Pieces:
 *   2 [ ]
 *   1 [ ]
 *   0 [ ]
 */
export default class Totem extends Phaser.Group {    
    constructor(game) {
        super(game)

        this.name = `Totem`;
        /**
         * @type {Piece[]}
         */
        this.pieces = new Array(Totem.MAX_SIZE)
        
        const overlap = 2 //px
        for (let index = 0; index < this.pieces.length; index++) {
            this.pieces[index] = new Piece(this.game, Pieces.PLACEHOLDER)
            if (index === 0) continue
            this.pieces[index].bottom = this.pieces[index - 1].top + overlap
        }
            
        this.addMultiple(this.pieces)
    }

    /**
     * Used to build the totem at each battle start.
     * 
     * @type {Piece}
     */
    addPiece(piece) {
        if (this.freeSlots <= 0) {
            console.error('Totem Error: MAX_SIZE reached. Cannot add another piece')
            return
        }
        const tmp = this.pieces[Totem.MAX_SIZE - this.freeSlots]
        this.pieces[Totem.MAX_SIZE - this.freeSlots] = piece
        tmp.destroy()
        this.debugPieces()
    }

    /**
     *
     */
    getNextPiecePosition() {
        if (this.freeSlots <= 0) {
            console.error('Totem Error: MAX_SIZE reached. Cannot add another piece')
            return
        }
        return this.pieces[Totem.MAX_SIZE - this.freeSlots]
    }

    get freeSlots() {
        let count = 0
        this.pieces.forEach(p => {
            if (p.placeholder) {
                count++
            }
        })
        return count
    }
    
    static get MAX_SIZE() {
        return 3
    }

    debugPieces() {
        for (let index = 0; index < this.pieces.length; index++) {
            const piece = this.pieces[index]
            console.log(index, piece.name, piece.placeholder)
        }
    }
}