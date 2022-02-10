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
        this.enemyGroup = this.physics.add.group();
        this.player = new MegaMan(this, 0, 0);
        this.level = new Level(this, levels['level1']);
        this.enemyGroup.add(new MetHat(this, 960, 0));
        
        this.physics.add.collider(this.player, this.enemyGroup);
        this.physics.add.collider(this.player, this.level.blocks);
        this.physics.add.collider(this.player.bulletGroup, this.level.blocks, (megaBusterShot) => {
            megaBusterShot.destroy();
        });
        this.physics.add.collider(this.player.bulletGroup, this.enemyGroup, (megaBusterShot, obj2) => {
            console.log("ENEMY HIT!");
            let enemy : MetHat = obj2 as MetHat;
            megaBusterShot.destroy();
            enemy.onHit(megaBusterShot);
        });
        this.physics.add.collider(this.enemyGroup, this.level.blocks, (obj) => {
            let enemy : MetHat = obj as MetHat;
            enemy.onCollision();
        });
    }

    update() {
        this.player.update();
        this.enemyGroup.children.each((enemy) => {
            enemy.update();
        })
    }
}
