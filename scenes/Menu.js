class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  preload() {
    this.load.image("portada", "public/publico/portada.png");
  }

  create() {
    // Fondo con imagen portada
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'portada')
      .setOrigin(0.5)
      .setDepth(0)
      .setDisplaySize(this.scale.width, this.scale.height);

    // Título
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 250,
      "CAIDA DE\nALMA",
      {
        fontFamily: 'VT323',
        fontSize: "180px",
        color: "#ffd700", // Dorado
        align: "center",
        stroke: "#000",
        strokeThickness: 20,
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
    const textoInicio = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 500,
      "Pulsa cualquier botón para empezar",
      {
        fontFamily: 'VT323',
        fontSize: "56px",
        color: "#ffffff",
        stroke: "#000",
        strokeThickness: 6
      }
    ).setOrigin(0.5).setDepth(1);

    // Función para animar el parpadeo
    const iniciarParpadeoYComenzar = () => {
      this.input.keyboard.removeAllListeners();
      this.input.removeAllListeners();

      let parpadeos = 0;
      const totalParpadeos = 6;

      this.time.addEvent({
        delay: 150,
        repeat: totalParpadeos * 2 - 1, // Cada parpadeo es ON/OFF
        callback: () => {
          textoInicio.visible = !textoInicio.visible;
          parpadeos++;
        },
        callbackScope: this,
        onComplete: () => {
          this.scene.start('Game');
        }
      });
    };

    // Escuchar entrada
    this.input.keyboard.once('keydown', iniciarParpadeoYComenzar);
    this.input.once('pointerdown', iniciarParpadeoYComenzar);
  }

  update() {
    // Gamepad (cualquier botón)
    if (this.input.gamepad && this.input.gamepad.total > 0) {
      const pad = this.input.gamepad.getPad(0);
      if (pad && pad.buttons.some(b => b.pressed)) {
        this.scene.start('Game');
      }
    }
  }
}

window.Menu = Menu;
