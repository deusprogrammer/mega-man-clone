import {assetMap, AssetMapEntry} from "../data/levels";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.spritesheet('megaman', 'assets/img/megaman.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('methat', 'assets/img/methat.png', { frameWidth: 24, frameHeight: 24 });
    this.load.image('shot', 'assets/img/shot.png');

    this.load.audio('buster', 'assets/sfx/buster.wav');
    this.load.audio('dink', 'assets/sfx/dink.wav');
    this.load.audio('enemy_hit', 'assets/sfx/enemy_hit.wav');
    this.load.audio('enemy_shoot', 'assets/sfx/enemy_shoot.wav');
    this.load.audio('hit', 'assets/sfx/hit.wav');
    this.load.audio('land', 'assets/sfx/land.wav');
    
    Object.keys(assetMap).forEach(key => {
        let asset : AssetMapEntry = assetMap[key];
        this.load.image(asset.name, asset.file);
        console.log("LOADING: " + asset.name + " => " + asset.file);
    });
  }

  create() {
    this.scene.start('MainScene');
  }
}
