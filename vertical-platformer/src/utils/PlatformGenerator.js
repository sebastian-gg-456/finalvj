class PlatformGenerator {
    constructor(scene) {
        this.scene = scene;
        this.platforms = [];
        this.platformHeight = 20; // Fixed height for platforms
        this.lastPlatformY = 0; // Starting Y position for platforms
    }

    createPlatform() {
        const platformWidth = Phaser.Math.Between(100, 300); // Random width between 100 and 300
        const platformX = Phaser.Math.Between(0 + platformWidth / 2, this.scene.cameras.main.width - platformWidth / 2);
        const platformY = this.lastPlatformY - Phaser.Math.Between(50, 150); // Random Y position above the last platform

        const platform = this.scene.physics.add.staticGroup();
        platform.create(platformX, platformY, 'platform').setOrigin(0.5, 0.5).setDisplaySize(platformWidth, this.platformHeight);
        
        this.platforms.push(platform);
        this.lastPlatformY = platformY; // Update the last platform Y position
    }

    update() {
        // Logic to create new platforms as the player ascends
        if (this.platforms.length === 0 || this.lastPlatformY < this.scene.cameras.main.scrollY + this.scene.cameras.main.height) {
            this.createPlatform();
        }
    }
}

export default PlatformGenerator;