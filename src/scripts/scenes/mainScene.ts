import { MegaMan, MetHat } from '../objects/sprites';
import * as Phaser from 'phaser';
import Level from '../objects/level';
import levels from '../data/levels';

export default class MainScene extends Phaser.Scene {
    player : MegaMan;
    enemyGroup : Phaser.Physics.Arcade.Group;
    level : Level;

    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.player = new MegaMan(this, 0, 0);
        this.level = new Level(this, levels['level1']);

        this.enemyGroup = this.physics.add.group();
        this.enemyGroup.add(new MetHat(this, 960, 0));
        
        // Doesn't work?  Why?
        this.physics.add.collider(this.player, this.enemyGroup, () => {
            this.player.onHit();
        });
        this.physics.add.collider(this.player.bulletGroup, this.enemyGroup, (megaBusterShot, obj2) => {
            let enemy : MetHat = obj2 as MetHat;
            megaBusterShot.destroy();
            enemy.onHit(megaBusterShot);
        });

        // Works
        this.physics.add.collider(this.player.bulletGroup, this.level.blocks, (megaBusterShot) => {
            megaBusterShot.destroy();
        });
        this.physics.add.collider(this.enemyGroup, this.level.blocks, (obj) => {
            let enemy : MetHat = obj as MetHat;
            enemy.onCollision();
        });
        this.physics.add.collider(this.player, this.level.blocks);
    }

    update() {
        this.player.update();
        this.enemyGroup.children.each((enemy) => {
            enemy.update();
        })
    }
}
