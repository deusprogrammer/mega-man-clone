import * as Phaser from 'phaser';
import { assetMap, AssetMapEntry, LevelConfig } from '../data/levels';

export default class Level extends Phaser.GameObjects.GameObject {
    blocks: Phaser.Physics.Arcade.StaticGroup;
    levelConfig: LevelConfig;

    constructor(scene : Phaser.Scene, levelConfig : LevelConfig) {
		super(scene, 'level');
		this.levelConfig = levelConfig;
		this.blocks = this.scene.physics.add.staticGroup();

		for (let y = 0; y < this.levelConfig.blocksY; y++) {
			for (let x = 0; x < this.levelConfig.blocksX; x++) {
				let asset : AssetMapEntry = assetMap[this.levelConfig.tilemap[y][x]];

                if (!asset) {
                    continue;
                }

                let block : Phaser.Physics.Arcade.Sprite = scene.physics.add.staticSprite(x * 32, y * 32, asset.name);
                block.scale *= 2;
                block.setOrigin(0, 0)
                    .setPushable(false)
                    .setImmovable(true)
                    .setGravity(0)
                    .refreshBody();
                this.blocks.add(block);
			}
		}
	}
}