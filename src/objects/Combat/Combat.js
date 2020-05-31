import Enemy from "./Enemy";
import Globals from "../../utils/Globals";
import CombatUI from "./CombatUI";
import Totem from "./Totem/Totem";
import Pieces from "../../data/Pieces";
import Piece from "./Totem/Piece";

export default class extends Phaser.Group {
  /**
   * @param {Phaser.Game} game 
   * @param {import("../Character").default[]} characters 
   */
  constructor(game, characters) {
    super(game);

    this.signals = {
    }

    this.characters = characters
    /**
     * Pieces obtained during this run
     * @type {Piece[]}
     */
    this.availabledPieces = this.makePieces()
    /**
     * 
     */
    this.enemies = []

    this.totem = new Totem(game)
    this.gui = new CombatUI(this.game, this.availabledPieces)
    this.gui.alpha = 0
    
    this.setPositions()
    this.connectSignals()
    this.addMultiple([
      this.totem,
      this.gui
    ])
  }

  connectSignals() {
    this.gui.signals.piecePressed.add(this.onPiecePressed, this)
  }

  /**
   * @param {Piece} piece 
   */
  onPiecePressed(piece) {
    const target = this.totem.getNextPiecePosition()
    
    this.game.add.tween(piece).to({
      x: this.toLocal(target, this.totem).x,
      y: this.toLocal(target, this.totem).y
    }, 300, Phaser.Easing.Exponential.InOut, true)
    this.totem.addPiece(piece)
  }

  setPositions() {
    this.totem.position.set(70, 80)
    // this.gui.bottom = Globals.height - 8
    // this.gui.centerX = Globals.width / 2
  }

  makeTurns() {
    return this.characters.concat(this.enemies).sort((a, b) => {
      return (b.stats.speed - a.stats.speed)
    })
  }

  makePieces() {
    const pieces = []
    for (let index = 0; index < Pieces.startingPieces.length; index++) {
      const pieceData = Pieces.startingPieces[index];
      pieces.push(new Piece(game, pieceData))
    }
    return pieces
  }

  start() {
    const enemiesAmount = this.game.rnd.integerInRange(1, 3)
    // create enemies
    for (let index = 0; index < enemiesAmount; index++) {
      const enemy = new Enemy(this.game, 0)
      enemy.x = Globals.width - 50 - index * 10
      enemy.y = 30 + index * 20
      this.enemies.push(enemy)
      this.add(enemy)
    }

    // this.turns = this.makeTurns()
    // this.turns.forEach((el) => {
    //   console.log(el.name, el.stats.speed);
    // })

    this.game.add.tween(this.gui).to({ alpha: 1 }, 200, 'Quad', true, 500);
  }
}