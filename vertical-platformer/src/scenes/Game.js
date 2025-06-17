import Phaser from 'phaser';
import Player from '../objects/Player.js';
import PlatformGenerator from '../utils/PlatformGenerator.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
    this.player = null;
    this.platforms = null;
    this.platformGenerator = null;
  }

  create() {
    this.platforms = this.physics.add.staticGroup();
    this.platformGenerator = new PlatformGenerator(this);

    this.player = new Player(this, 100, 100);
    this.physics.add.collider(this.player.sprite, this.platforms);

    this.cameras.main.setBounds(0, 0, 2000, 1200);
    this.cameras.main.startFollow(this.player.sprite);

    this.platformGenerator.createInitialPlatforms();
  }

  update() {
    this.player.update();
    this.platformGenerator.update();
  }
}