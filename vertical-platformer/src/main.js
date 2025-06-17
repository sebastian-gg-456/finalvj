// filepath: vertical-platformer/vertical-platformer/src/main.js
import Game from "./scenes/Game.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Game],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);