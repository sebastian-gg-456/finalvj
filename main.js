const config = {
  type: Phaser.AUTO,
  width: 2000,
  height: 1200,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 2000, height: 500 },
    max: { width: 1600, height: 1000 },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 450 },
      debug: false,
    },
  },
  input: {
    gamepad: true // <--- ¡Esto es clave!
  },
  scene: [window.Menu, window.Game], // o solo window.Game si no tienes menú
};

window.game = new Phaser.Game(config);