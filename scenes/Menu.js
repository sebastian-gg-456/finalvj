class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

preload() {
  this.load.image('portada', 'public/publico/portada.png');
}

   create() {
    // Fondo con la imagen de portada
    this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'portada'
    ).setOrigin(0.5).setDepth(0).setDisplaySize(this.scale.width, this.scale.height);

    this.add.text(
  this.cameras.main.centerX,
  this.cameras.main.centerY - 250,
  "CAIDA DE\nALMA",
  {
    fontFamily: 'VT323',
    fontSize: "180px",
    color: "#ffd700", // Color dorado (puede ser "#ff4500" para rojo fuego)
    align: "center",
    stroke: "#000",
    strokeThickness: 20, // Más grosor en el borde
    shadow: {
      offsetX: 6,
      offsetY: 6,
      color: "#000",
      blur: 8,
      stroke: true,
      fill: true
    },
    lineSpacing: 40
  }
).setOrigin(0.5).setDepth(1);

    // Texto de inicio
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 500,
      "Pulsa cualquier botón para empezar",
      { fontFamily: 'VT323', fontSize: "56px", color: "#fff", stroke: "#000", strokeThickness: 6 }
    ).setOrigin(0.5).setDepth(1);

    this.input.keyboard.once('keydown', () => {
      this.scene.start('Game');
    });
    this.input.once('pointerdown', () => {
      this.scene.start('Game');
    });
  }

   update() {
    // Gamepad
    if (this.input.gamepad && this.input.gamepad.total > 0) {
      const pad = this.input.gamepad.getPad(0);
      if (pad && pad.buttons.some(b => b.pressed)) {
        this.scene.start('Game');
      }
    }
  }
}

window.Menu = Menu;