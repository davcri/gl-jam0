/* globals __DEV__ */
import Phaser from 'phaser-ce'
import Atlas from '../utils/AtlasGraphic';
import Input from '../utils/InputMap';
import GameContainer from '../objects/GameContainer';

export default class extends Phaser.State {
  init() {
    Atlas.init(this.game)
    Input.init(this.game)
    // make the canvas fit the available space
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.stage.smoothed = false
    this.camera.roundPx = false
    // camera config
    this.camera.scale.setTo(4)
    // this.camera.bounds.setTo(0, 0, this.dungeon.right, Globals.height)
  }

  preload() {
    this.game.load.audio('music', './assets/music/finalsacrifice.ogg')
    this.game.load.audio('hit', './assets/sounds/hit4.ogg')
    this.game.load.audio('totemPiece', './assets/sounds/hit5.ogg')
    this.game.load.audio('pieceRemoved', './assets/sounds/minimize_003.ogg')
    this.game.load.audio('uiPress', './assets/sounds/tick_001.ogg')
    this.game.load.audio('explosion', './assets/sounds/explosion4.ogg')
    this.game.load.audio('battleStart', './assets/sounds/upgrade1.ogg')
    this.game.load.audio('gameover', './assets/sounds/gameover4.ogg')
  }

  create() {
    this.gameContainer = new GameContainer(this.game)
    this.add.existing(this.gameContainer)    
  }

  render() {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.dungeon.terrain[0], 32, 32)
      // this.game.debug.cameraInfo(this.game.camera, 32, 32);
    }
  }
}