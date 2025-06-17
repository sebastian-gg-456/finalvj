import Game from "./scenes/Game.js";

const config = {
  type: Phaser.AUTO,
  width: 2000,
  height: 1200,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 2000,
      height: 500,
    },
    max: {
      width: 1600,
      height: 1000,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 450},
      debug: false,
    },
  },
  scene: [Game],
};

window.game = new Phaser.Game(config);