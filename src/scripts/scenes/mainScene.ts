import { MegaMan, MetHat } from '../objects/sprites';
import * as Phaser from 'phaser';
import Level from '../objects/level';
import levels from '../data/levels';

export default class MainScene extends Phaser.Scene {
    player : MegaMan;
    enemyGroup : Phaser.Physics.Arcade.Group;
    enemyBulletGroup: Phaser.Physics.Arcade.Group;
    level : Level;

    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.player = new MegaMan(this, 0, 0);
        this.level = new Level(this, levels['level1']);

        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        
        this.enemyGroup.add(new MetHat(this, 960, 0), true);
        
        this.physics.add.overlap(this.player, this.enemyGroup, (obj, obj2) => {
            this.player.onHit(obj2);
        });
        this.physics.add.overlap(this.player, this.enemyBulletGroup, (obj1, obj2) => {
            this.player.onHit(obj2);
        });
        this.physics.add.overlap(this.player.bulletGroup, this.enemyGroup, (obj1, obj2) => {
            let enemy : MetHat = obj2 as MetHat;
            let weapon : Phaser.Physics.Arcade.Sprite = obj1 as Phaser.Physics.Arcade.Sprite;
            this.player.bulletGroup.remove(weapon);
            enemy.onHit(weapon);
        });
        
        this.physics.add.collider(this.enemyGroup, this.level.blocks, (obj) => {
            let enemy : MetHat = obj as MetHat;
            enemy.onCollision();
        });
        this.physics.add.collider(this.player, this.level.blocks);

        this.physics.world.on('worldbounds', (body : Phaser.Physics.Arcade.Body) => {
            if (this.player.bulletGroup.contains(body.gameObject)) {
                console.log("BULLET DESTROYED");
                body.destroy();
            }
        });
    }

    update() {
        this.player.update();
        this.enemyGroup.children.each((enemy) => {
            enemy.update();
        });
    }
}
