class Game extends Phaser.Scene {
  constructor() {
    super("Game");
    this.platformSpacing = 180;
    this.platformMinWidth = 100;
    this.platformMaxWidth = 350;
    this.platforms = null;
    this.player = null;
    this.maxY = 0;
    this.jumpVelocity = -700;
    this.firstPlatformY = 0;
    this.firstPlatformX = 0;
    this.angelAlive = false;
    this.score = 0;
    this.metros = 0;
    this.lastEnemyRespawnMeters = 0;
    this.gameOverShown = false;

    // Nuevas propiedades para pausa
    this.isPaused = false;
    this.pauseOverlay = null;
    this.pauseTexts = [];

    this.lastRBPressed = false; // <-- Agregado aquí
    this.lastLTPressed = false;
  }

  preload() {
    this.load.image("platform", "https://dummyimage.com/400x40/444/fff.png&text=+");
    this.load.image("player", "https://dummyimage.com/80x80/09f/fff.png&text=^");
    this.load.image("angel", "https://dummyimage.com/60x60/fff/000.png&text=A");
    this.load.image("angel_bow", "https://dummyimage.com/60x60/0ff/000.png&text=AB");
    this.load.image("demon", "https://dummyimage.com/60x60/f00/fff.png&text=D");
    this.load.image("demon_angel", "https://dummyimage.com/60x60/ff0/000.png&text=DA");
    this.load.image("laser", "https://dummyimage.com/20x8/0ff/fff.png&text=L");
    this.load.image("arrow", "https://dummyimage.com/30x8/964B00/fff.png&text=F");
    this.load.image("fireball", "https://dummyimage.com/20x20/f80/fff.png&text=F");

    this.load.spritesheet('angelc', 'public/publico/angelc.png', { frameWidth: 90, frameHeight: 50 });
  this.load.spritesheet('angelc2', 'public/publico/angelc2.png', { frameWidth: 90, frameHeight: 50 });
  this.load.spritesheet('caidaf', 'public/publico/caidaf.png', { frameWidth: 60, frameHeight: 60 });
  this.load.spritesheet('caidaf2', 'public/publico/caidaf2.png', { frameWidth: 60, frameHeight: 60 });
  this.load.image('fantasmad', 'public/publico/fantasmad.png');
  this.load.image('fantasmai', 'public/publico/fantasmai.png');
  }
;
  ;create() {
  // Animación ángel arco (pre disparo)
  if (!this.anims.exists('angelc_pre_shoot')) {
    this.anims.create({
      key: 'angelc_pre_shoot',
      frames: this.anims.generateFrameNumbers('angelc', { start: 0, end: 1 }),
      frameRate: 8,
      repeat: 0
    });
  }
  if (!this.anims.exists('angelc2_pre_shoot')) {
    this.anims.create({
      key: 'angelc2_pre_shoot',
      frames: this.anims.generateFrameNumbers('angelc2', { start: 0, end: 1 }),
      frameRate: 8,
      repeat: 0
    });
  }

  // Animaciones de salto/cayendo para el jugador (fantasma)
  if (!this.anims.exists('fantasma_salto_izq')) {
    this.anims.create({
      key: 'fantasma_salto_izq',
      frames: [{ key: 'caidaf', frame: 0 }],
      frameRate: 1,
      repeat: -1
    });
  }
  if (!this.anims.exists('fantasma_salto_der')) {
    this.anims.create({
      key: 'fantasma_salto_der',
      frames: [{ key: 'caidaf2', frame: 0 }],
      frameRate: 1,
      repeat: -1
    });
  }
    // Animación de caída rápida
    if (!this.anims.exists('fantasma_caida_r')) {
      this.anims.create({
        key: 'fantasma_caida_r',
        frames: [{ key: 'caidaf', frame: 0 }],
        frameRate: 1,
        repeat: -1
      });
    }
    if (!this.anims.exists('fantasma_caida_l')) {
      this.anims.create({
        key: 'fantasma_caida_l',
        frames: [{ key: 'caidaf2', frame: 0 }],
        frameRate: 1,
        repeat: -1
      });
    }

    // Animación de disparo de láser (ángel y demonio ángel)
    if (!this.anims.exists('laser_shoot')) {
      this.anims.create({
        key: 'laser_shoot',
        frames: [{ key: 'laser', frame: 0 }],
        frameRate: 1,
        repeat: -1
      });
    }

    // Animación de disparo de flecha (ángel con arco)
    if (!this.anims.exists('arrow_shoot')) {
      this.anims.create({
        key: 'arrow_shoot',
        frames: [{ key: 'arrow', frame: 0 }],
        frameRate: 1,
        repeat: -1
      });
    }

    // Animación de bola de fuego (demonio)
    if (!this.anims.exists('fireball_shoot')) {
      this.anims.create({
        key: 'fireball_shoot',
        frames: [{ key: 'fireball', frame: 0 }],
        frameRate: 1,
        repeat: -1
      }); 
}
    this.enemies = this.physics.add.group(); // <-- Mueve esto antes de crear plataformas
    this.projectiles = this.physics.add.group();
    this.platforms = this.physics.add.staticGroup();

    // Plataformas iniciales
    let y = this.scale.height - 100;
    let firstPlatformSet = false;
    for (let i = 0; i < 7; i++) {
      const platforms = this.generatePlatformRow(y);
      if (!firstPlatformSet && platforms && platforms.length > 0) {
        this.firstPlatformX = platforms[0].x;
        this.firstPlatformY = platforms[0].y;
        firstPlatformSet = true;
      }
      y -= this.platformSpacing;
    }

    // El jugador aparece sobre la primera plataforma
    this.player = this.physics.add.sprite(this.firstPlatformX, this.firstPlatformY - 100, "player");
    this.player.setScale(2);
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(false);
    this.player.body.allowGravity = true;

    // Ajusta la hitbox del jugador
    this.player.body.setSize(
      this.player.displayWidth * 0.7,
      this.player.displayHeight * 0.9
    );
    this.player.body.setOffset(
      (this.player.displayWidth - this.player.displayWidth * 0.15),
      (this.player.displayHeight - this.player.displayHeight * 0.05)
    );

    // Texto identificador sobre el jugador
    this.playerLabel = this.add.text(0, 0, "JUGADOR", { font: "20px Arial", fill: "#00f" }).setOrigin(0.5);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemy, null, this);
    this.physics.add.overlap(this.player, this.projectiles, this.handlePlayerProjectile, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(this.player, false, 1, 1, 0, 300);
    this.cameras.main.setDeadzone(this.scale.width, this.scale.height / 2);
    this.cameras.main.setBackgroundColor(0x2b1a0f); // Marrón oscuro tipo infierno, no choca con sprites

    this.maxY = this.player.y;

    // Aparición aleatoria de enemigos cada 3 segundos
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        const y = this.cameras.main.scrollY - 100;
        this.addEnemy(y);
      },
      callbackScope: this,
      loop: true
    });

    // Texto de puntuación
    // Puntos arriba izquierda
    this.scoreText = this.add.text(40, 30, "Puntos: 0", {
      fontFamily: 'VT323',
      fontSize: "64px",
      color: "#fff",
      stroke: "#000",
      strokeThickness: 8
    }).setOrigin(0, 0).setScrollFactor(0);

    // Metros arriba derecha
    this.metrosText = this.add.text(this.scale.width - 40, 30, "Metros: 0", {
      fontFamily: 'VT323',
      fontSize: "64px",
      color: "#fff",
      stroke: "#000",
      strokeThickness: 8
    }).setOrigin(1, 0).setScrollFactor(0);

    this.input.keyboard.on('keydown-R', () => {
      this.score = 0;
      this.scene.restart();
    });
    this.gameOverShown = false;

    // En create(), solo una vez:
    this.input.keyboard.on('keydown-ESC', () => {
      if (!this.isPaused) {
        this.showPauseMenu();
      } else {
        this.hidePauseMenu();
      }
    });
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.isPaused) {
        this.hidePauseMenu();
      }
    });

    if (this.input && this.input.gamepad) {
      this.input.gamepad.once('connected', pad => {
        this.gamepad = pad;
      });
    }

    // Cartel de controles
    this.mostrandoCartelControles = true;
    this.controlesText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 350, // Más abajo
      'Pulsa "LT/E" para ver controles',
      { fontFamily: 'VT323', fontSize: "56px", color: "#fff", stroke: "#000", strokeThickness: 6 }
    ).setOrigin(0.5).setScrollFactor(0);
  }

  update(time, delta) {
    // --- Soporte para joystick estilo Phaser ---
    if (this.input.gamepad && this.input.gamepad.total > 0) {
      const pad = this.input.gamepad.getPad(0);
      const rbPressed = pad.buttons[5].pressed;
      if (rbPressed && !this.lastRBPressed) {
        if (!this.isPaused) {
          this.showPauseMenu();
        } else {
          this.hidePauseMenu();
        }
      }
      this.lastRBPressed = rbPressed;
    }

    // Al principio de update()
    if (!this.isPaused && !this.mostrandoControles) {
      // Tecla E
      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('E'))) {
        this.mostrandoControles = true;
        this.showControlsMenu();
        if (this.mostrandoCartelControles && this.controlesText) {
          this.controlesText.destroy();
          this.mostrandoCartelControles = false;
        }
        return;
      }
      // LT del mando
      if (this.input.gamepad && this.input.gamepad.total > 0) {
        const pad = this.input.gamepad.getPad(0);
        if (pad && pad.buttons[6].pressed && !this.lastLTPressed) {
          this.mostrandoControles = true;
          this.showControlsMenu();
          if (this.mostrandoCartelControles && this.controlesText) {
            this.controlesText.destroy();
            this.mostrandoCartelControles = false;
          }
          this.lastLTPressed = true;
          return;
        }
        if (pad) this.lastLTPressed = pad.buttons[6].pressed;
      }
    }

    if (this.isPaused) return;

    // --- Movimiento con teclado ---
    let moveX = 0;
    if (this.cursors.left.isDown) moveX = -1;
    else if (this.cursors.right.isDown) moveX = 1;

    // --- Soporte para joystick estilo Phaser ---
    if (this.input.gamepad && this.input.gamepad.total > 0) {
      const pad = this.input.gamepad.getPad(0);

      // Movimiento con stick izquierdo (o cruceta)
      let axisH = 0;
      if (pad.axes.length > 0) axisH = pad.axes[0].getValue();
      if (Math.abs(axisH) > 0.2) moveX = axisH;

      // Saltar con botón A (botón 0)
      if (pad.buttons[0].pressed && this.player.body.touching.down) {
        this.player.setVelocityY(this.jumpVelocity);
      }
      // Caída rápida with botón B (botón 1)
      if (pad.buttons[1].pressed && !this.player.body.touching.down) {
        this.player.setVelocityY(700);
      }
      // Reiniciar con botón X (botón 2)
      if (pad.buttons[2].pressed && this.gameOverShown) {
        this.score = 0;
        this.scene.restart();
      }
      // Volver al menú con botón Y (botón 3)
      if (pad.buttons[3].pressed && this.gameOverShown) {
        this.scene.start('Menu');
      }
      // Pausa/Despausa con RB (botón 5)
      const rbPressed = pad.buttons[5].pressed;
      if (rbPressed && !this.lastRBPressed) {
        if (!this.isPaused) {
          this.showPauseMenu();
        } else {
          this.hidePauseMenu();
        }
      }
      this.lastRBPressed = rbPressed;
    }

    // --- Movimiento horizontal ---
    if (moveX < -0.2) {
      this.player.setVelocityX(-400);
    } else if (moveX > 0.2) {
      this.player.setVelocityX(400);
    } else {
      this.player.setVelocityX(0);
    }

    // --- Salto con teclado ---
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) &&
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(this.jumpVelocity);
    }

    // --- Caída rápida con teclado ---
    if (
      this.cursors.down.isDown &&
      !this.player.body.touching.down
    ) {
      this.player.setVelocityY(700);
    }

    // Generar nuevas plataformas si el jugador sube
    if (this.player.y < this.maxY - this.platformSpacing) {
      this.generatePlatformRow(this.player.y - this.platformSpacing * 2);
      this.maxY = this.player.y;
      this.removeOffscreenPlatforms();
    }

    // Si el jugador cae por debajo de la pantalla, pierde automáticamente
    if (this.player.y > this.cameras.main.scrollY + this.scale.height) {
      this.showGameOver();
      this.physics.pause();
      this.input.keyboard.once('keydown-R', () => {
        this.score = 0; // <-- Solo aquí se reinicia el puntaje
        this.scene.restart();
      });
    }

    // Game over si cae demasiado abajo de la primera plataforma (incluso al inicio)
    const limiteCaida = this.firstPlatformY + 400; // Puedes ajustar 400 a lo que prefieras
    if (this.player.y > limiteCaida && !this.gameOverShown) {
      this.showGameOver();
      this.physics.pause();
      this.input.keyboard.once('keydown-R', () => {
        this.score = 0;
        this.scene.restart();
      });
      return;
    }

    // Movimiento de enemigos voladores
    this.enemies.getChildren().forEach(enemy => {
      if (!enemy || !enemy.active) return;

      if (
        !enemy.target ||
        enemy.y > this.player.y + 200 ||
        enemy.y < this.player.y - 600 ||
        (enemy.target && enemy.target.y > this.player.y - 100)
      ) {
        enemy.target = {
          x: Phaser.Math.Between(100, this.scale.width - 100),
          y: this.player.y - Phaser.Math.Between(120, 300)
        };
        enemy.speed = Phaser.Math.Between(320, 420);
      }

      const dx = enemy.target.x - enemy.x;
      const dy = enemy.target.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 10) {
        enemy.setVelocity((dx / dist) * enemy.speed, (dy / dist) * enemy.speed);
      } else {
        enemy.setVelocity(0, 0);
        enemy.target = null;
      }

      if (enemy.label) enemy.label.setPosition(enemy.x, enemy.y - 40);
    });

    // Actualiza etiquetas de enemigos y jugador
    this.playerLabel.setPosition(this.player.x, this.player.y - 50);
    this.enemies.getChildren().forEach(enemy => {
      if (!enemy.label) {
        let text = "";
        if (enemy.type === "angel") text = "ÁNGEL";
        else if (enemy.type === "angel_bow") text = "ÁNGEL ARCO";
        else if (enemy.type === "demon") text = "DEMONIO";
        else if (enemy.type === "demon_angel") text = "DEMONIO ÁNGEL";
        enemy.label = this.add.text(enemy.x, enemy.y - 40, text, { font: "16px Arial", fill: "#000" }).setOrigin(0.5);
      }
      if (enemy.label) enemy.label.setPosition(enemy.x, enemy.y - 40);
    });

    // Siempre mantener al menos 4 enemigos activos
    if (this.enemies.countActive(true) < 2) {
      let spawnX;
      do {
        spawnX = Phaser.Math.Between(100, this.scale.width - 100);
      } while (Math.abs(spawnX - this.player.x) < 350); // Ahora 350px de distancia mínima
      const spawnY = this.player.y - Phaser.Math.Between(250, 450); // Un poco más arriba
      this.addEnemy(spawnY);
    }

    // Actualiza la puntuación y metros
    this.metros += 0.1 * delta / 1000;
    this.scoreText.setText('Puntuación: ' + Math.floor(this.score));
    this.metrosText.setText('Metros: ' + Math.floor(this.metros));

    // Calcula metros recorridos (puedes ajustar el factor si quieres que suba más lento/rápido)
    this.metros = Math.max(0, Math.floor((this.firstPlatformY - this.player.y) / 10));
    this.metrosText.setText("Metros: " + this.metros);
    this.scoreText.setText("Puntos: " + this.score);

    // Cada 175 metros, respawnea enemigos
    if (this.metros - this.lastEnemyRespawnMeters >= 175) {
      // Destruye todos los enemigos actuales
      this.enemies.getChildren().forEach(enemy => {
        if (enemy.label) enemy.label.destroy();
        enemy.destroy();
      });
      // Spawnea 4 enemigos nuevos alrededor del jugador (no solo en Y)
      for (let i = 0; i < 4; i++) {
        let spawnX, spawnY, tries = 0;
        do {
          spawnX = this.player.x + Phaser.Math.Between(-250, 250);Phaser.Math.Between(100, this.scale.width - 100);
          spawnY = this.player.y + Phaser.Math.Between(-250, 250); // Alrededor del jugador
          tries++;
        } while (
          (Math.abs(spawnX - this.player.x) < 200 ||
           this.enemies.getChildren().some(e => e && typeof e.x === "number" && Math.abs(e.x - spawnX) < 150))
          && tries < 20
        );
        this.addEnemy(spawnY, spawnX); // <-- pasa X también
      }
      this.lastEnemyRespawnMeters = this.metros;
    }

    // Detectar primer salto (teclado)
    if (
      this.mostrandoCartelControles &&
      Phaser.Input.Keyboard.JustDown(this.cursors.up) &&
      this.player.body.touching.down
    ) {
      this.controlesText.destroy();
      this.mostrandoCartelControles = false;
    }

    // Detectar primer salto (mando)
    if (
      this.mostrandoCartelControles &&
      this.input.gamepad && this.input.gamepad.total > 0
    ) {
      const pad = this.input.gamepad.getPad(0);
      if (pad && pad.buttons[0].pressed && this.player.body.touching.down) {
        this.controlesText.destroy();
        this.mostrandoCartelControles = false;
      }
    }

    if (this.player.body.velocity.y < 0) {
      // Saltando
      if (this.player.body.velocity.x >= 0) {
        this.player.anims.play('fantasma_salto_der', true);
      } else {
        this.player.anims.play('fantasma_salto_izq', true);
      }
    } else if (this.player.body.velocity.x > 0) {
      if (this.player.texture.key !== 'fantasmad') {
        this.player.setTexture('fantasmad');
      }
    } else if (this.player.body.velocity.x < 0) {
      if (this.player.texture.key !== 'fantasmai') {
        this.player.setTexture('fantasmai');
      }
    } else {
      // Quieto: mantener la última dirección de movimiento
      if (this.player.lastDirection === 'right') {
        if (this.player.texture.key !== 'fantasmad') {
          this.player.setTexture('fantasmad');
        }
      } else {
        if (this.player.texture.key !== 'fantasmai') {
          this.player.setTexture('fantasmai');
        }
      }
    }
  }

  // Genera enemigos aleatorios en la altura dada
  addEnemy(y, x = null) {
    // Calcula el máximo de enemigos según metros
    let maxEnemigos = 1 + Math.floor(this.metros / 800);
    if (maxEnemigos > 4) maxEnemigos = 4;

    // Cuenta los enemigos actuales
    const enemies = this.enemies.getChildren().filter(e => e.active);
    if (enemies.length >= maxEnemigos) return;

    // Decide tipos permitidos según progreso
    let possibleTypes = [];
    if (maxEnemigos === 1) {
      // Solo enemigos básicos (no angel ni demonio_angel)
      possibleTypes = ["angel_bow", "demon"];
    } else {
      // Todos los tipos permitidos
      possibleTypes = ["angel_bow", "demon", "angel", "demon_angel"];
    }

    // Limita a un solo ángel sin arco o demonio ángel a la vez
    if (enemies.some(e => e.type === "angel") && possibleTypes.includes("angel")) {
      possibleTypes = possibleTypes.filter(t => t !== "angel");
    }
    if (enemies.some(e => e.type === "demon_angel") && possibleTypes.includes("demon_angel")) {
      possibleTypes = possibleTypes.filter(t => t !== "demon_angel");
    }

    if (possibleTypes.length === 0) return;

    const type = Phaser.Utils.Array.GetRandom(possibleTypes);

    if (x === null) {
      let tries = 0;
      do {
        x = Phaser.Math.Between(100, this.scale.width - 100);
        tries++;
      } while (Math.abs(x - this.player.x) < 200 && tries < 20);
    }
    let enemy = this.enemies.create(x, y, type);
    enemy.type = type;

    // Ajusta la hitbox del enemigo
    enemy.body.setSize(
      enemy.displayWidth * 0.7,
      enemy.displayHeight * 0.8
    );
    enemy.body.setOffset(
      (enemy.displayWidth - enemy.displayWidth * 0.7) / 2,
      (enemy.displayHeight - enemy.displayHeight * 0.8) / 2
    );

    // Si es ángel arco, escálalo
    if (type === "angel_bow") {
      enemy.setScale(3.5);
    }

    // Comportamiento según tipo
    if (type === "angel") {
      this.angelAlive = true;
      this.time.addEvent({
        delay: 6000, // antes era 12000
        callback: () => this.shootLaser(enemy),
        callbackScope: this,
        loop: true
      });
      enemy.on('destroy', () => { this.angelAlive = false; });
    } else if (type === "angel_bow") {
      this.time.addEvent({
        delay: 1500,
        callback: () => this.shootArrow(enemy),
        callbackScope: this,
        loop: true
      });
    } else if (type === "demon") {
      this.time.addEvent({
        delay: 2000,
        callback: () => this.demonAttack(enemy),
        callbackScope: this,
        loop: true
      });
    } else if (type === "demon_angel") {
      this.time.addEvent({
        delay: 6000, // Láser más frecuente (antes 12000)
        callback: () => this.shootLaser(enemy),
        callbackScope: this,
        loop: true
      });
      enemy.extraSpeed = 1.7;
    }
  }

  // Disparo de láser (ángel y demonio ángel)
  shootLaser(enemy) {
    if (!enemy.active) return;

    // Guarda la posición X donde se mostrará el aviso y el láser
    const laserX = enemy.x;

    // AVISO: Línea verde translúcida desde arriba de la cámara
    const aviso = this.add.rectangle(
      laserX,
      this.cameras.main.scrollY,
      40,
      this.scale.height * 2,
      0x00ff00,
      0.3
    ).setOrigin(0.5, 0);

    // Después de 0.5 segundos, elimina el aviso y lanza el láser real en la MISMA posición
    this.time.delayedCall(500, () => {
      aviso.destroy();

      // Láser real (azul, opaco) desde arriba, en la misma posición X
      const laser = this.add.rectangle(
        laserX,
        this.cameras.main.scrollY,
        40,
        this.scale.height * 2,
        0x00ffff
      ).setOrigin(0.5, 0);
      this.physics.add.existing(laser, true);

      // Lógica de colisión y destrucción del láser
      this.time.delayedCall(600, () => laser.destroy());
    });
  }

  // Disparo de flecha (ángel con arco)
  shootArrow(enemy) {
    if (!enemy.active) return;
    // Predice la posición futura del jugador (simplemente usa su velocidad actual)
    const player = this.player;
    const dx = (player.x + player.body.velocity.x * 0.3) - enemy.x;
    const dy = (player.y + player.body.velocity.y * 0.3) - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = 350;
    const arrow = this.projectiles.create(enemy.x, enemy.y, "arrow");
    arrow.setVelocity((dx / dist) * speed, (dy / dist) * speed);
    arrow.body.allowGravity = false;
  }

  // Ataque demonio (embestida y bola de fuego)
  demonAttack(enemy) {
    if (!enemy.active) return;
    // Embestida hacia el jugador
    const dx = this.player.x - enemy.x;
    const dy = this.player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dirX = dx / dist;
    const dirY = dy / dist;
    enemy.setVelocity(dirX * 200, dirY * 200);

    // Bola de fuego tipo misil
    const player = this.player;
    const predX = player.x + player.body.velocity.x * 0.3;
    const predY = player.y + player.body.velocity.y * 0.3;
    const dx2 = predX - enemy.x;
    const dy2 = predY - enemy.y;
    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const fireball = this.projectiles.create(enemy.x, enemy.y, "fireball");
    fireball.setVelocity((dx2 / dist2) * 300, (dy2 / dist2) * 300);
    fireball.body.allowGravity = false;

    // Detener embestida después de un tiempo
    this.time.delayedCall(800, () => {
      if (enemy.active) enemy.setVelocity(0, 0);
    });
  }

  // Colisión jugador-enemigo
  handlePlayerEnemy(player, enemy) {
    const playerBottom = player.y + (player.height || player.displayHeight) / 2;
    if (
      player.body.velocity.y > 0 &&
      playerBottom < enemy.y
    ) {
      // Sumar puntos según tipo
      let puntos = 0;
      if (enemy.type === "demon_angel") puntos = 1000;
      else if (enemy.type === "angel") puntos = 500;         // antes 300
      else if (enemy.type === "angel_bow") puntos = 120;      // antes 200
      else if (enemy.type === "demon") puntos = 250;          // antes 500
      this.score += puntos;

      if (enemy.type === "angel") this.angelAlive = false;
      if (enemy.label) enemy.label.destroy();
      enemy.destroy();
      player.setVelocityY(-400); // Rebote pequeño
    } else {
      this.showGameOver();
      this.physics.pause();
      this.input.keyboard.once('keydown-R', () => {
        this.score = 0; // <-- Solo aquí se reinicia el puntaje
        this.scene.restart();
      });
    }
  }

  // Colisión jugador-proyectil
  handlePlayerProjectile(player, projectile) {
    this.showGameOver();
    this.physics.pause();
    this.input.keyboard.once('keydown-R', () => {
      this.score = 0; // <-- Solo aquí se reinicia el puntaje
      this.scene.restart();
    });
  }

  // Modifica tu generación de plataformas para agregar enemigos aleatorios:
  addPlatform(y) {
    const width = Phaser.Math.Between(this.platformMinWidth, this.platformMaxWidth);
    const x = Phaser.Math.Between(-width / 2, this.scale.width + width / 2);
    const platform = this.platforms.create(x, y, "platform");
    platform.displayWidth = width;
    platform.refreshBody();
    platform.body.checkCollision.down = false;
    platform.body.checkCollision.left = true;
    platform.body.checkCollision.right = true;

    // 30% de probabilidad de generar un enemigo sobre la plataforma
    if (Phaser.Math.Between(1, 100) <= 30) {
      this.addEnemy(y - 40);
    }

    return platform;
  }

  generatePlatformRow(y) {
    const numPlatforms = Phaser.Math.Between(1, 2); // Menos plataformas por fila
    const usedRanges = [];
    const platforms = [];
    for (let i = 0; i < numPlatforms; i++) {
      let width = Phaser.Math.Between(this.platformMinWidth, this.platformMaxWidth);
      let x, tries = 0;
      do {
        x = Phaser.Math.Between(width / 2, this.scale.width - width / 2);
        tries++;
      } while (
        usedRanges.some(range => Math.abs(x - range) < width + 80) && tries < 10
      );
      usedRanges.push(x);
      const platform = this.platforms.create(x, y, "platform");
      platform.displayWidth = width;
      platform.refreshBody();
      platform.body.checkCollision.down = false;
      platform.body.checkCollision.left = true;
      platform.body.checkCollision.right = true;
      platforms.push(platform);
    }
    return platforms;
  }

  removeOffscreenPlatforms() {
    this.platforms.children.iterate((platform) => {
      if (!platform) return;
      if (platform.y > this.player.y + this.scale.height) {
        this.platforms.remove(platform, true, true);
      }
    });
  }

  showGameOver() {
    if (this.gameOverShown) return;
    this.gameOverShown = true;

    // Fondo semi-transparente
    this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.7
    ).setScrollFactor(0);

    // Título
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 220,
      "GAME OVER",
      { fontFamily: 'VT323', fontSize: "120px", color: "#fff" }
    ).setOrigin(0.5).setScrollFactor(0);

    // Puntos
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 60,
      `Puntos: ${this.score}`,
      { fontFamily: 'VT323', fontSize: "64px", color: "#fff" }
    ).setOrigin(0.5).setScrollFactor(0);

    // Metros
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 40,
      `Metros: ${this.metros}`,
      { fontFamily: 'VT323', fontSize: "64px", color: "#fff" }
    ).setOrigin(0.5).setScrollFactor(0);

    // Instrucciones
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 160,
      "Pulsa R para reiniciar",
      { fontFamily: 'VT323', fontSize: "44px", color: "#fff" }
    ).setOrigin(0.5).setScrollFactor(0);

    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 220,
      "Pulsa Q para volver al inicio",
      { fontFamily: 'VT323', fontSize: "40px", color: "#fff" }
    ).setOrigin(0.5).setScrollFactor(0);

    this.input.keyboard.once('keydown-Q', () => {
      this.scene.start('Menu');
    });

    // Soporte para LB (botón 4) del mando para volver al menú
    this.input.gamepad && this.input.gamepad.once('down', (pad, button, index) => {
      if (index === 4) { // LB
        this.scene.start('Menu');
      }
    });
  }

  showPauseMenu() {
    if (this.isPaused) return;
    this.isPaused = true;
    this.physics.pause();

    this.pauseOverlay = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.7
    ).setScrollFactor(0);

    this.pauseTexts = [
      this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 100,
        "PAUSA",
        { fontFamily: 'VT323', fontSize: "120px", color: "#fff", stroke: "#000", strokeThickness: 14 }
      ).setOrigin(0.5).setScrollFactor(0),

      this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 60,
        "Pulsa ESC o ESPACIO para continuar",
        { fontFamily: 'VT323', fontSize: "56px", color: "#fff", stroke: "#000", strokeThickness: 6 }
      ).setOrigin(0.5).setScrollFactor(0)
    ];
  }

  hidePauseMenu() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.physics.resume();
    if (this.pauseOverlay) this.pauseOverlay.destroy();
    this.pauseTexts.forEach(t => t.destroy());
    this.pauseTexts = [];
  }

  showControlsMenu() {
    this.physics.pause();
    this.isPaused = true;

    this.controlsOverlay = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.8
    ).setScrollFactor(0);

    this.controlsTexts = [
      this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 260,
        "CONTROLES",
        { fontFamily: 'VT323', fontSize: "100px", color: "#fff", stroke: "#000", strokeThickness: 10 }
      ).setOrigin(0.5).setScrollFactor(0),

      // PC
      this.add.text(
        this.cameras.main.centerX - 350,
        this.cameras.main.centerY - 80,
        "PC",
        { fontFamily: 'VT323', fontSize: "64px", color: "#fff", stroke: "#000", strokeThickness: 8 }
      ).setOrigin(0.5).setScrollFactor(0),
      this.add.text(
        this.cameras.main.centerX - 350,
        this.cameras.main.centerY + 40,
        "Flechas: Mover y saltar\nR/X: Reiniciar\nESC: Pausa\nQ/Y/LB: Menú\nE/LT: Ver controles",
        { fontFamily: 'VT323', fontSize: "40px", color: "#fff", stroke: "#000", strokeThickness: 6, align: "center" }
      ).setOrigin(0.5).setScrollFactor(0),

      // MANDO
      this.add.text(
        this.cameras.main.centerX + 350,
        this.cameras.main.centerY - 80,
        "MANDO",
        { fontFamily: 'VT323', fontSize: "64px", color: "#fff", stroke: "#000", strokeThickness: 8 }
      ).setOrigin(0.5).setScrollFactor(0),
      this.add.text(
        this.cameras.main.centerX + 350,
        this.cameras.main.centerY + 40,
        "Stick: Mover\nA: Saltar\nB: Caída rápida\nRB: Pausa/Despausa\nLB/Y/Q: Menú\nX/R: Reiniciar\nLT/E: Ver controles",
        { fontFamily: 'VT323', fontSize: "40px", color: "#fff", stroke: "#000", strokeThickness: 6, align: "center" }
      ).setOrigin(0.5).setScrollFactor(0),

      this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 220,
        "Pulsa cualquier botón o tecla para volver",
        { fontFamily: 'VT323', fontSize: "40px", color: "#fff", stroke: "#000", strokeThickness: 6 }
      ).setOrigin(0.5).setScrollFactor(0)
    ];

    // Salir del menú de controles con cualquier botón o tecla
    this.input.keyboard.once('keydown', () => this.hideControlsMenu());
    this.input.once('pointerdown', () => this.hideControlsMenu());
    if (this.input.gamepad) {
      this.input.gamepad.once('down', () => this.hideControlsMenu());
    }
  }

  hideControlsMenu() {
    this.isPaused = false;
    this.physics.resume();
    if (this.controlsOverlay) this.controlsOverlay.destroy();
    if (this.controlsTexts) this.controlsTexts.forEach(t => t.destroy());
    this.mostrandoControles = false;
  }
}

// Haz la clase global para que main.js la vea
window.Game = Game;
