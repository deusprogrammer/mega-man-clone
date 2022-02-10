import * as Phaser from 'phaser';
import MainScene from '../scenes/mainScene';

export class MegaMan extends Phaser.Physics.Arcade.Sprite {
    controls : {
        up : Phaser.Input.Keyboard.Key,
        down: Phaser.Input.Keyboard.Key,
        left: Phaser.Input.Keyboard.Key,
        right: Phaser.Input.Keyboard.Key,
        jump: Phaser.Input.Keyboard.Key,
        shoot: Phaser.Input.Keyboard.Key
    };

    isShooting : boolean;
    bulletGroup: Phaser.Physics.Arcade.Group;

    constructor(scene : MainScene, x : integer, y : integer) {
        super(scene, x, y, 'megaman');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.bulletGroup = scene.physics.add.group();

        this.scale *= 2;
        this.body.setSize(22, 22);
        this.setOrigin(0.5, 0.5);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('megaman', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 1
        });

        this.anims.create({
            key: 'idle-gun',
            frames: this.anims.generateFrameNumbers('megaman', { start: 2, end: 2 }),
            frameRate: 1,
            repeat: 1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('megaman', { start: 6, end: 9 }),
            frameRate: 8,
            repeat: 1
        });

        this.anims.create({
            key: 'walk-gun',
            frames: this.anims.generateFrameNumbers('megaman', { start: 2, end: 5 }),
            frameRate: 8,
            repeat: 1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('megaman', { start: 10, end: 10 }),
            frameRate: 8,
            repeat: 1
        });

        this.play('idle');

        this.setCollideWorldBounds(true).setInteractive();

        this.controls = {
            up: this.scene.input.keyboard.addKey('W'),
            down: this.scene.input.keyboard.addKey('S'),
            left: this.scene.input.keyboard.addKey('A'),
            right: this.scene.input.keyboard.addKey('D'),
            jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            shoot: this.scene.input.keyboard.addKey('J')
        };
    }

    update(...args: any[]): void {
        super.update();

        let scene : MainScene = this.scene as MainScene;

        // Controls
        if (this.controls.right.isDown) {
            this.setVelocityX(150);
        } else if (this.controls.left.isDown) {
            this.setVelocityX(-150);
        } else {
            this.setVelocityX(0);
        }

        // If player is jumping
        if (this.controls.jump.isDown && this.body.touching.down) {
            this.setVelocityY(-400);
        }

        if (this.controls.shoot.isDown && !this.isShooting) {
            this.isShooting = true;

            let megaBusterShot = this.scene.physics.add.sprite(this.x + 32, this.y, 'wood1');
            this.bulletGroup.add(megaBusterShot);

            megaBusterShot.body.allowGravity = false;
            megaBusterShot
                .refreshBody()
                .setVelocityX(this.flipX ? 300 : -300);

            setTimeout(() => {
                this.isShooting = false;
            }, 200);
        }
        
        // Determine direction of sprite based on velocity.
        if (this.body.velocity.x > 0) {
            this.flipX = true;
        } else if (this.body.velocity.x < 0) {
            this.flipX = false;
        }

        // If body is moving up or down, play jumping animation.
        if (this.body.velocity.y !== 0) {
            this.play('jump', true);
        } else if (this.body.velocity.x !== 0) {
            this.play(this.isShooting ? 'walk-gun' : 'walk', true);
        } else {
            this.play(this.isShooting ? 'idle-gun' : 'idle');
        }
    }
}

export class MetHat extends Phaser.Physics.Arcade.Sprite {
    state : string;

    constructor(scene : MainScene, x : integer, y : integer) {
        super(scene, x, y, 'methat');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scale *= 1.5;

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('methat', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 1
        });

        this.anims.create({
            key: 'stand',
            frames: this.anims.generateFrameNumbers('methat', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: 1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('methat', { start: 2, end: 3 }),
            frameRate: 8,
            repeat: 1
        });

        this.state = "idle";
        this.play('idle');

        this.setCollideWorldBounds(true);
        this.refreshBody();
    }

    onCollision() {
        // If collided with wall
        if (this.body.touching.left) {
            this.body.velocity.x = 200;
        } else if (this.body.touching.right) {
            this.body.velocity.x = -200;
        }
    }

    onHit(weapon) {
        this.destroy();
    }

    update() {
        if (this.scene.game.loop.frame % 500 === 0 && this.body.touching.down && this.state === 'idle') {
            this.play('stand', true);
            this.state = 'standing';

            // Make him start walking shortly after standing up
            setTimeout(() => {
                this.state = 'walking';
                this.setVelocityX(-200);
            }, 200);

            // Make him idle again after 10 seconds.
            setTimeout(() => {
                this.state = 'idle';
                this.setVelocityX(0);
                this.play('idle');
            }, 3000);
        }

        // Determine direction of sprite based on velocity.
        if (this.body.velocity.x > 0) {
            this.flipX = true;
        } else if (this.body.velocity.x < 0) {
            this.flipX = false;
        }

        if (this.body.velocity.x !== 0) {
            this.play('walk', true);
        }
    }
}