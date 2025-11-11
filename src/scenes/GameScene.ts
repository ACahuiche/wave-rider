import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Wave } from '../entities/Wave';
import { WaveManager } from '../managers/WaveManager';
import { PLAYER, WAVE, WORLD, COLORS, SCORE, PHYSICS } from '../utils/Constants';
import { ScoreManager } from '../managers/ScoreManager';

export class GameScene extends Phaser.Scene {
  // Entidades
  private player!: Player;
  private waves!: Phaser.GameObjects.Group;
  private startRock!: Phaser.GameObjects.Rectangle;
  private scoreManager!: ScoreManager;

  // Managers
  private waveManager!: WaveManager;

  // Controles
  private jumpKey!: Phaser.Input.Keyboard.Key;

  // Estados
  private isRiding: boolean = false;
  private gameOver: boolean = false;

  // Colisiones
  private rockCollider!: Phaser.Physics.Arcade.Collider;

  // Debug UI
  private debugText!: Phaser.GameObjects.Text;

  // 🆕 Nuevo texto de puntuación
  private scoreText!: Phaser.GameObjects.Text;

  // 🆕 Nuevo texto de Game Over
  private gameOverText!: Phaser.GameObjects.Text;

  // 🆕 Nueva propiedad para la tecla R
  private restartKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    console.log('GameScene: Preload');
  }

  create(): void {
    console.log('GameScene: Create');

    // 🛠️ FIX 1: Resetear el estado de la escena al iniciar
    this.gameOver = false;
    this.isRiding = false;

    // 🛠️ FIX 2: Asegurar que el motor de física está corriendo al iniciar la escena
    this.physics.resume();

    this.cameras.main.setBackgroundColor(WORLD.BACKGROUND_COLOR);

    // ===================================
    // GESTOR DE PUNTUACIÓN Y UI
    // ===================================
    this.scoreManager = new ScoreManager(this);
    this.scoreText = this.add.text(15, 15, 'Score: 0', {
      font: '24px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setScrollFactor(0);
    this.scoreManager.start();

    // ===================================
    // 🛠️ FIX: INICIALIZAR UI PRIMERO 👈
    // ===================================
    if (PHYSICS.DEBUG) {
      this.createDebugUI();
    }

    this.createGameOverUI();

    // ===== 1. CREAR GRUPO DE OLAS =====
    this.waves = this.physics.add.group({
      runChildUpdate: true
    });

    // ===== 2. CREAR WAVE MANAGER =====
    this.waveManager = new WaveManager(this, this.waves);

    // ===== 3. CREAR JUGADOR =====
    this.player = new Player(this, PLAYER.START_X, PLAYER.START_Y);

    // ===== 4. CREAR ROCA DE INICIO (Tutorial) =====
    this.createStartRock();

    // 🆕 AÑADIR CONTROL DE REINICIO
    this.restartKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // ===== 5. CONFIGURAR COLISIONES =====

    // 5.1 Player VS Roca
    this.physics.add.collider(this.player, this.startRock);

    // 5.2 🌊 Olas VS Roca (Manejador de Destrucción de Roca)
    this.rockCollider = this.physics.add.collider(
      this.waves,
      this.startRock,
      this.handleWaveRockCollision,
      undefined,
      this
    );

    // 5.3 Player VS Olas (Surfeo y Muerte Lateral)
    this.physics.add.collider(
      this.player,
      this.waves,
      this.handleWaveCollision,
      undefined,
      this
    );

    // 6. 🚀 INICIAR SPAWN DE OLAS INMEDIATAMENTE
    this.waveManager.startSpawning();

    // 7. CONFIGURAR CONTROLES
    this.setupControls();

    console.log('✅ GameScene inicializada con Roca de Inicio y Spawning activo');
  }

  /**
   * Crea el objeto inamovible para el aterrizaje inicial
   */
  private createStartRock(): void {
    const ROCK_WIDTH = 20;
    const ROCK_HEIGHT = 20;
    const ROCK_Y = PLAYER.START_Y + PLAYER.HEIGHT / 2 + ROCK_HEIGHT / 2 + 5;

    this.startRock = this.add.rectangle(
      PLAYER.START_X,
      ROCK_Y + 100,
      ROCK_WIDTH,
      ROCK_HEIGHT,
      0x606060
    ).setOrigin(0.5, 0.5);

    // 1. Añadir el cuerpo estático
    this.physics.add.existing(this.startRock, true);

    // 🛠️ FIX ERROR 1 & 2: Eliminamos las llamadas setImmovable/allowGravity
    // La bandera 'true' en physics.add.existing ya hace que sea estático.
    // La línea: this.startRock.body.setImmovable(true); es incorrecta para StaticBody.
  }


  /**
   * 🆕 Maneja la colisión OLA vs ROCA. Esto rompe la roca, pero DEJA LA OLA.
   */
  private handleWaveRockCollision(rockObj: any, waveObj: any): void {
    if (!this.startRock.active) return;

    const rock = rockObj as Phaser.GameObjects.Rectangle;
    const wave = waveObj as Wave;

    console.log('🌊💥 Roca destruida por ola. ¡Surfea!');

    rock.destroy();
    this.rockCollider.destroy();
    this.isRiding = true;
  }

  /**
   * 🆕 Función para iniciar el juego (se llama al primer salto en la roca)
   */
  private destroyRockAndStartGameByJump(): void {
    if (!this.startRock.active) return;

    console.log('🚀 Primer salto: Destrucción de Roca e inicio de surfeo.');

    this.startRock.destroy();
    this.rockCollider.destroy();
    this.isRiding = true;
  }

  /**
   * Manejador de colisión Player-Wave (Para muerte lateral y SURFEO)
   */
  private handleWaveCollision(playerObj: any, waveObj: any): void {
    const player = playerObj as Player;
    const wave = waveObj as Wave;

    const waveBody = wave.body as any;

    const isFalling = player.body.velocity.y > 0;

    // Comprueba si la parte inferior del jugador está cerca de la parte superior de la ola.
    const isOnTop = player.body.bottom <= waveBody.top + 10; // 10px de tolerancia

    if (isFalling && isOnTop) {
      if (!this.isRiding) {
        this.isRiding = true;
        this.scoreManager.add(SCORE.POINTS_PER_JUMP);
      }
    }

    // 1. Lógica de Muerte Lateral
    if (!player.body!.touching.down && // Usamos '!' para manejar el tipado de Phaser
      (player.body!.touching.left || player.body!.touching.right)) {

      this.endGame('Player golpeado lateralmente.');
      return;
    }

    // 2. 🏄 Lógica de Surfeo
    if (player.body!.touching.down || player.getCanJump()) {
      player.body!.setVelocityX(wave.body.velocity.x);
    }
  }


  /**
   * 🚀 FIX DEFINITIVO DE TUNNELING (CCD por Proyección) 🚀
   */
  private checkContinuousCollision(): void {
    const player = this.player;
    // Usamos aserción de tipo para garantizar que tiene cuerpo de Arcade
    const playerBody = player.body as Phaser.Physics.Arcade.Body;

    if (playerBody.velocity.y <= 0 || playerBody.touching.down) {
      return;
    }

    const activeWaves = this.waves.getChildren() as Wave[];

    // ... (el resto de tu lógica checkContinuousCollision se mantiene igual)

    const yPrev = playerBody.prev.y;
    const deltaY = playerBody.y - yPrev;
    const playerHalfHeight = playerBody.halfHeight;

    const xPrev = playerBody.prev.x;
    const playerPrevLeft = xPrev - playerBody.halfWidth;
    const playerPrevRight = xPrev + playerBody.halfWidth;

    let lowestTimeOfImpact = Infinity;
    let hitYPosition = 0;

    for (const wave of activeWaves) {
      const waveBody = wave.body as Phaser.Physics.Arcade.Body;
      const waveTop = waveBody.top;

      const isHorizontallyAligned =
        playerPrevRight >= waveBody.left &&
        playerPrevLeft <= waveBody.right;

      if (!isHorizontallyAligned) {
        continue;
      }

      const playerPrevBottom = yPrev + playerHalfHeight;
      const distanceToWave = waveTop - playerPrevBottom;

      if (distanceToWave < 0) {
        continue;
      }

      let timeOfImpact = distanceToWave / deltaY;

      if (timeOfImpact > 0 && timeOfImpact <= 1) {
        if (timeOfImpact < lowestTimeOfImpact) {
          lowestTimeOfImpact = timeOfImpact;
          hitYPosition = waveTop - playerHalfHeight;
        }
      }
    }

    if (lowestTimeOfImpact < Infinity) {
      console.log(`💥 [CCD Corregido] Aterrizaje forzado.`);

      const tinyBuffer = 0.1;
      const finalCorrectionY = hitYPosition - tinyBuffer;

      playerBody.y = finalCorrectionY;
      player.setY(finalCorrectionY + playerHalfHeight);

      playerBody.setVelocityY(0);
      player.setCanJump(true);

      playerBody.enable = false;
      this.time.delayedCall(1, () => {
        playerBody.enable = true;
      }, [], this);
    }
  }


  /**
   * Update - Loop principal
   */
  update(time: number, delta: number): void {
    // 1. Manejar el Reinicio
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      // Reiniciar si Game Over es true Y se presiona R
      this.scene.restart();
      return;
    }

    if (this.gameOver) {
      // ⚠️ FIX DE DEBUG: Continuar la ejecución para actualizar la UI
      if(PHYSICS.DEBUG){
        this.updateDebugUI();
      }
      
      return;
    }

    if (this.player) {
      this.player.update();

      if (this.isRiding) {
        this.checkContinuousCollision();
      }

      // 🛠️ FIX ERROR 3: Casteamos la altura de la configuración a 'number'
      const gameHeight = this.game.config.height as number;

      if (this.player.y > gameHeight) {
        this.endGame('Caída de la pantalla');
      }
    }

    // Actualizar el texto de la puntuación
    this.scoreText.setText(`Score: ${this.scoreManager.getScore()}`);


    const isJumpInputDown = Phaser.Input.Keyboard.JustDown(this.jumpKey) || this.input.activePointer.isDown;

    if (isJumpInputDown) {
      if (this.player && this.player.getCanJump()) {

        if (this.startRock.active) {
          this.destroyRockAndStartGameByJump();
        }
        this.isRiding = false;
        this.player.jump();
      }
    }

    if(PHYSICS.DEBUG){
      this.updateDebugUI();
    }
  }

  // ... (Métodos auxiliares: setupControls, createDebugUI, updateDebugUI, endGame, shutdown)

  private setupControls(): void {
    this.jumpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.on('pointerdown', () => {
      // El salto se maneja en el update() para integrar la destrucción de la roca
    });
  }

  private createDebugUI(): void {
    this.add.text(this.cameras.main.width - 270, 10, 'WAVE RIDER - Spawn Test', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });

    this.add.text(this.cameras.main.width - 186, 40, 'SPACE/CLICK to jump', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });

    this.debugText = this.add.text(this.cameras.main.width - 180, 70, '', {
      fontSize: '14px',
      color: '#FFD93D',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
  }

  private updateDebugUI(): void {
    const waveCount = this.waveManager.getActiveWaveCount();
    const spawnInterval = this.waveManager.getSpawnInterval();
    const playerY = Math.round(this.player.y);
    const canJump = this.player.getCanJump();
    const rockActive = this.startRock && this.startRock.active ? 'YES' : 'NO';

    this.debugText.setText([
      `Active Waves: ${waveCount}`,
      `Spawn Interval: ${spawnInterval}ms`,
      `Player Y: ${playerY}`,
      `Can Jump: ${canJump ? '✅' : '❌'}`,
      `Velocity Y: ${Math.round(this.player.body!.velocity.y)}`,
      `Status: ${this.isRiding ? 'SURFING' : 'TUTORIAL'}`,
      `Rock Active: ${rockActive}`
    ]);
  }

  /**
   * 🆕 Crea el texto de Game Over y lo centra
   */
  private createGameOverUI(): void {
    this.gameOverText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'GAME OVER\n\nPresiona R para volver a intentarlo',
      {
        fontSize: '40px',
        color: '#FF0000',
        fontFamily: 'Arial',
        backgroundColor: '#000000',
        padding: { x: 20, y: 15 },
        align: 'center'
      }
    ).setOrigin(0.5)
      .setDepth(10) // Asegura que esté sobre todos los demás elementos
      .setVisible(false); // Empieza oculto
  }

  private endGame(reason: string): void {
    // La bandera this.gameOver debe ser la primera línea de defensa
    if (this.gameOver) return;
    this.gameOver = true;
    this.isRiding = false;
    console.log(`💥 Game Over: ${reason}`);

    // Pausar el mundo de física
    this.physics.pause();
    this.scoreManager.stop();
    this.waveManager.stopSpawning();
    this.player.setFillStyle(0xFF0000);

    // 🆕 MOSTRAR TEXTO DE GAME OVER
    this.gameOverText.setVisible(true);
  }

  shutdown(): void {
    if (this.waveManager) {
      this.waveManager.destroy();
    }
  }
}