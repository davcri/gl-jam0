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

        this.signals = {
            totemBuilt: new Phaser.Signal(), // emitted once per battle, after the user positioned the 3rd piece
        }
        this.name = `Totem`;
        /**
         * @type {Piece[]}
         */
        this.pieces = new Array(Totem.MAX_SIZE)
        
        const overlap = 2 //px
        for (let index = 0; index < this.pieces.length; index++) {
            this.pieces[index] = new Piece(this.game, Pieces.PLACEHOLDER)
            this.pieces[index].position.set(70, 60)
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
        const tmp = this.pieces[this.freeSlotIndex]
        this.pieces[this.freeSlotIndex] = piece
        tmp.destroy()
        if (this.freeSlots === 0) this.signals.totemBuilt.dispatch()
        return this.topPieceIndex
    }

    pop() {
        const removedPiece = this.pieces[this.topPieceIndex]
        const placeholder = new Piece(this.game, Pieces.PLACEHOLDER)
        placeholder.position.copyFrom(removedPiece.position)
        this.pieces[this.topPieceIndex] = placeholder 
        
        this.add(placeholder)
        return removedPiece
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

    get topPiece() {
        if (this.topPieceIndex < 0) return null
        return this.pieces[this.topPieceIndex]
    }

    get topPieceIndex() {
        return Totem.MAX_SIZE - this.freeSlots - 1
    }

    get freeSlotIndex() {
        if (this.topPieceIndex >= 2) return -1
        return this.topPieceIndex + 1
    }

    get freeSlots() {
        let count = 0
        this.pieces.forEach((p, index) => {
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