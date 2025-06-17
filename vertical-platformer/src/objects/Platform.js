import Phaser from 'phaser';

export default class Platform extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height, 0x00ff00);
        this.setOrigin(0.5, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
    }

    update() {
        // Update logic for the platform can be added here if needed
    }
}