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

    isGamepadConnected: boolean;
    isShooting : boolean;
    bulletGroup: Phaser.Physics.Arcade.Group;

    constructor(scene : MainScene, x : integer, y : integer) {
        super(scene, x, y, 'megaman');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.bulletGroup = scene.physics.add.group();

        this.anims.create({
            key: 'stand',
            frames: this.anims.generateFrameNumbers('megaman', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 1
        });

        this.anims.create({
            key: 'stand-gun',
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

        this.anims.create({
            key: 'jump-gun',
            frames: this.anims.generateFrameNumbers('megaman', { start: 11, end: 11 }),
            frameRate: 8,
            repeat: 1
        });

        this.anims.create({
            key: 'hurt',
            frames: this.anims.generateFrameNumbers('megaman', { start: 12, end: 12 }),
            frameRate: 8,
            repeat: 1
        });

        this.scale *= 2;

        this
            .setActive(true)
            .setOrigin(0.5, 0.5)
            .setCollideWorldBounds(true)
            .setSize(22, 22)
            .refreshBody();

        this.controls = {
            up: this.scene.input.keyboard.addKey('W'),
            down: this.scene.input.keyboard.addKey('S'),
            left: this.scene.input.keyboard.addKey('A'),
            right: this.scene.input.keyboard.addKey('D'),
            jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            shoot: this.scene.input.keyboard.addKey('J')
        };

        this.scene.input.gamepad.once('connected', (pad) => {
            this.isGamepadConnected = true;
        });

        this.state = 'standing';
    }

    getControllerState() {
        let control = {
            up: this.controls.up.isDown,
            down: this.controls.down.isDown,
            left: this.controls.left.isDown,
            right: this.controls.right.isDown,
            jump: this.controls.jump.isDown,
            shoot: this.controls.shoot.isDown
        };
        if (this.isGamepadConnected) {
            control.up      ||= this.scene.input.gamepad.gamepads[0].up;
            control.down    ||= this.scene.input.gamepad.gamepads[0].down;
            control.left    ||= this.scene.input.gamepad.gamepads[0].left;
            control.right   ||= this.scene.input.gamepad.gamepads[0].right;
            control.jump    ||= this.scene.input.gamepad.gamepads[0].A;
            control.shoot   ||= this.scene.input.gamepad.gamepads[0].X;
        }

        return control;
    }

    update(...args: any[]): void {
        super.update();
        let control = this.getControllerState();

        // If player is hurt, controls are locked.
        if (this.state === 'hurt') {
            this.play('hurt', true);
            this.setVelocityX(this.flipX ? -40 : 40);
            return;
        }

        // Set visible
        this.setAlpha(1);

        // Controls
        if (control.right) {
            this.setVelocityX(150);
        } else if (control.left) {
            this.setVelocityX(-150);
        } else {
            this.setVelocityX(0);
        }

        // If player is jumping
        if (control.jump && this.body.touching.down) {
            this.setVelocityY(-400);
        }

        if (control.shoot && !this.isShooting) {
            this.isShooting = true;

            let megaBusterShot = this.scene.physics.add.sprite(this.x + (this.flipX ? 32 : -32), this.y, 'shot');
            this.scene.add.existing(megaBusterShot);
            
            this.bulletGroup.add(megaBusterShot, true);

            megaBusterShot.scale *= 2;
            megaBusterShot.body.allowGravity = false;
            megaBusterShot
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

        // Determine animation to play.
        if (!this.body.touching.down) {
            this.play(this.isShooting ? 'jump-gun' : 'jump', true);
        } else if (this.body.velocity.x !== 0) {
            this.play(this.isShooting ? 'walk-gun' : 'walk', true);
        } else {
            this.play(this.isShooting ? 'stand-gun' : 'stand');
        }

        this.bulletGroup.children.each((child) => {
            child.update();
        })
    }

    onHit() {
        // Implement iframes while hurt
        if (this.state === 'hurt') {
            return;
        }

        console.log("PLAYER HIT");
        this.state = 'hurt';
        
        setTimeout(() => {
            this.state = 'standing';
        }, 1000);
    }
}

export class MetHat extends Phaser.Physics.Arcade.Sprite {
    state : string;
    isShooting : boolean;

    constructor(scene : MainScene, x : integer, y : integer) {
        super(scene, x, y, 'methat');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scale *= 1.5;

        this.anims.create({
            key: 'guard',
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
            key: 'jump',
            frames: this.anims.generateFrameNumbers('methat', { start: 2, end: 2 }),
            frameRate: 8,
            repeat: 1
        });

        this.anims.create({
            key: 'jump-gun',
            frames: this.anims.generateFrameNumbers('methat', { start: 2, end: 2 }),
            frameRate: 8,
            repeat: 1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('methat', { start: 2, end: 3 }),
            frameRate: 8,
            repeat: 1
        });

        this.anims.create({
            key: 'walk-gun',
            frames: this.anims.generateFrameNumbers('methat', { start: 2, end: 3 }),
            frameRate: 8,
            repeat: 1
        });

        this.anims.create({
            key: 'stand-gun',
            frames: this.anims.generateFrameNumbers('methat', { start: 2, end: 2 }),
            frameRate: 8,
            repeat: 1
        });

        this.anims.create({
            key: 'hurt',
            frames: this.anims.generateFrameNumbers('methat', { start: 2, end: 2 }),
            frameRate: 8,
            repeat: 1
        });

        this.state = "guard";
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
        console.log("ENEMY HIT");

        this.destroy();
    }

    update() {
        super.update();

        if (this.scene.game.loop.frame % 500 === 0 && this.body.touching.down && this.state === 'guard') {
            this.state = 'standing';

            // Make him start walking shortly after standing up
            setTimeout(() => {
                if (!this) {
                    return;
                }
                this.state = 'walking';
                this.setVelocityX(-200);
            }, 200);

            // Make him guard again after 10 seconds.
            setTimeout(() => {
                if (!this || !this.body) {
                    return;
                }
                this.state = 'guard';
                this.setVelocityX(0);
            }, 3000);
        }

        // Determine direction of sprite based on velocity.
        if (this.body.velocity.x > 0) {
            this.flipX = true;
        } else if (this.body.velocity.x < 0) {
            this.flipX = false;
        }

        if (this.state === 'hurt') {
            this.play('hurt', true);
        } else if (!this.body.touching.down) {
            this.play(this.isShooting ? 'jump-gun' : 'jump', true);
        } else if (this.body.velocity.x !== 0) {
            this.play(this.isShooting ? 'walk-gun' : 'walk', true);
        } else {
            this.play(this.state === 'standing' ? (this.isShooting ? 'stand-gun': 'stand') : 'guard', true);
        }
    }
}