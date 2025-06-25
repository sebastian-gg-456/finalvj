class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x18100c);

    // Título en dos líneas, enorme y centrado
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 120,
      "CAIDA DE\nALMA",
      {
        fontFamily: 'VT323',
        fontSize: "180px",
        color: "#fff",
        align: "center",
        stroke: "#000",
        strokeThickness: 16,
        lineSpacing: 40
      }
    ).setOrigin(0.5);

    // Texto de inicio, grande y pixel art
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 180,
      "Pulsa cualquier botón para empezar",
      { fontFamily: 'VT323', fontSize: "56px", color: "#fff", stroke: "#000", strokeThickness: 6 }
    ).setOrigin(0.5);

    this.input.keyboard.once('keydown', () => {
      this.scene.start('Game');
    });
    this.input.once('pointerdown', () => {
      this.scene.start('Game');
    });
  }

  update() {
    // Si hay gamepad conectado y se pulsa cualquier botón, empieza el juego
    if (this.input.gamepad && this.input.gamepad.total > 0) {
      const pad = this.input.gamepad.getPad(0);
      if (pad && pad.buttons.some(b => b.pressed)) {
        this.scene.start('Game');
      }
    }
  }
}

window.Menu = Menu;