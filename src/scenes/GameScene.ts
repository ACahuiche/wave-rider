// src/scenes/GameScene.ts
import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Wave } from '../entities/Wave';
import { WaveManager } from '../managers/WaveManager';
import { PLAYER, WAVE, WORLD, COLORS } from '../utils/Constants';

export class GameScene extends Phaser.Scene {
  // Entidades
  private player!: Player;
  private waves!: Phaser.GameObjects.Group;

  // Managers
  private waveManager!: WaveManager;

  // Controles
  private jumpKey!: Phaser.Input.Keyboard.Key;

  // Debug UI
  private debugText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    console.log('GameScene: Preload');
  }

  create(): void {
    console.log('GameScene: Create');
    this.cameras.main.setBackgroundColor(WORLD.BACKGROUND_COLOR);

    // ===== 1. CREAR GRUPO DE OLAS =====
    this.waves = this.physics.add.group({
      runChildUpdate: true // Las olas ejecutarán su update()
    });

    // ===== 2. CREAR WAVE MANAGER =====
    this.waveManager = new WaveManager(this, this.waves);

    // ===== 3. CREAR JUGADOR =====
    this.player = new Player(this, PLAYER.START_X, PLAYER.START_Y);

    // ===== 4. CONFIGURAR COLISIONES =====
    this.physics.add.collider(
      this.player,
      this.waves,
      this.handleWaveCollision,
      undefined,
      this
    );

    // ===== 5. INICIAR SPAWN AUTOMÁTICO =====
    this.waveManager.startSpawning();

    // ===== 6. CONFIGURAR CONTROLES =====
    this.setupControls();

    // ===== 7. CREAR UI DE DEBUG =====
    this.createDebugUI();

    console.log('✅ GameScene inicializada con WaveManager');
  }

  /**
   * Configurar controles del jugador
   */
  private setupControls(): void {
    // Tecla SPACE
    this.jumpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Click/Touch
    this.input.on('pointerdown', () => {
      if (this.player) {
        this.player.jump();
      }
    });

    console.log('🎮 Controles configurados');
  }

  /**
   * Crear UI de debug
   */
  private createDebugUI(): void {
    // Título
    this.add.text(10, 10, 'WAVE RIDER - Spawn Test', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });

    // Instrucciones
    this.add.text(10, 40, 'SPACE/CLICK to jump', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });

    // Debug info (actualizable)
    this.debugText = this.add.text(10, 70, '', {
      fontSize: '14px',
      color: '#FFD93D',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
  }

  /**
   * Actualizar UI de debug
   */
  private updateDebugUI(): void {
    const waveCount = this.waveManager.getActiveWaveCount();
    const spawnInterval = this.waveManager.getSpawnInterval();
    const playerY = Math.round(this.player.y);
    const canJump = this.player.getCanJump();

    this.debugText.setText([
      `Active Waves: ${waveCount}`,
      `Spawn Interval: ${spawnInterval}ms`,
      `Player Y: ${playerY}`,
      `Can Jump: ${canJump ? '✅' : '❌'}`
    ]);
  }

  /**
   * Manejador de colisión Player-Wave
   */
  private handleWaveCollision(playerObj: any, waveObj: any): void {
    const player = playerObj as Player;

    // Muerte por colisión lateral
    if (!player.body.touching.down &&
        (player.body.touching.left || player.body.touching.right)) {
      console.log('💥 Player golpeado lateralmente. ¡Game Over!');

      // Detener spawn de olas
      this.waveManager.stopSpawning();

      // Detener jugador
      player.body.setVelocityX(0);
      player.body.setVelocityY(0);
      player.body.setAllowGravity(false);

      // Cambiar color a rojo (muerte)
      player.setFillStyle(0xFF0000);

      // TODO: Transición a GameOverScene
      this.time.delayedCall(2000, () => {
        console.log('🔄 Reiniciando escena...');
        this.scene.restart();
      });
    }
  }

  /**
   * Update - Loop principal
   */
  update(time: number, delta: number): void {
    // 1. Actualizar jugador
    if (this.player) {
      this.player.update();
    }

    // 2. Input de salto
    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      if (this.player) {
        this.player.jump();
      }
    }

    // 3. Actualizar debug UI
    this.updateDebugUI();
  }

  /**
   * Shutdown - Limpiar cuando se cierra la escena
   */
  shutdown(): void {
    if (this.waveManager) {
      this.waveManager.destroy();
    }
  }
}