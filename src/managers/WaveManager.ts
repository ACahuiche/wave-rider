// src/managers/WaveManager.ts
import Phaser from 'phaser';
import { Wave } from '../entities/Wave';
import { WAVE, DIFFICULTY } from '../utils/Constants';

/**
 * WaveManager - Gestiona el spawn automático de olas y la dificultad progresiva.
 */
export class WaveManager {
  private scene: Phaser.Scene;
  private waves: Phaser.GameObjects.Group;
  private spawnTimer?: Phaser.Time.TimerEvent;

  private currentWaveSpeed: number;
  private currentSpawnInterval: number;

  private timeActiveSeconds: number = 0;
  private difficultyTimer!: Phaser.Time.TimerEvent;
  private isDifficultyActive: boolean = false;

  constructor(scene: Phaser.Scene, waves: Phaser.GameObjects.Group) {
    this.scene = scene;
    this.waves = waves;
    // Usa las constantes actualizadas, incluyendo los nuevos valores
    this.currentWaveSpeed = DIFFICULTY.INITIAL_WAVE_SPEED;
    this.currentSpawnInterval = DIFFICULTY.INITIAL_SPAWN_INTERVAL;

    console.log('✅ WaveManager creado');
  }

  /**
   * Iniciar el spawn automático de olas.
   */
  public startSpawning(): void {
    this.timeActiveSeconds = 0;
    this.isDifficultyActive = true;

    // 1. Inicializar/Reiniciar el timer de spawn
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
    }

    this.spawnTimer = this.scene.time.addEvent({
      delay: this.currentSpawnInterval,
      callback: this.spawnWave,
      callbackScope: this,
      loop: true
    });

    // 2. Inicializar el timer de AUMENTO DE DIFICULTAD
    if (this.difficultyTimer) {
      this.difficultyTimer.destroy();
    }

    this.difficultyTimer = this.scene.time.addEvent({
      delay: DIFFICULTY.INCREASE_INTERVAL_SECONDS * 1000,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true
    });

    console.log('⏱️ WaveManager: Spawn y Dificultad iniciados.');
  }


  /**
   * Detener el spawn de olas y la progresión de dificultad.
   */
  public stopSpawning(): void {
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
    }
    if (this.difficultyTimer) {
      this.difficultyTimer.destroy();
    }
    this.isDifficultyActive = false;
  }

  /**
   * Se llama cada 10 segundos. Recalcula velocidad e intervalo.
   */
  private increaseDifficulty(): void {
    this.timeActiveSeconds += DIFFICULTY.INCREASE_INTERVAL_SECONDS;

    // -------------------------------------
    // A. CALCULAR NUEVA VELOCIDAD
    // -------------------------------------
    const newSpeed = DIFFICULTY.INITIAL_WAVE_SPEED -
      (this.timeActiveSeconds * DIFFICULTY.SPEED_INCREASE_RATE_PER_SECOND);

    this.currentWaveSpeed = Math.max(newSpeed, DIFFICULTY.MAX_WAVE_SPEED);

    // -------------------------------------
    // B. REDUCIR INTERVALO DE SPAWN (Fórmula Proporcional al Nuevo Balance)
    // -------------------------------------

    const maxSpeedDelta = Math.abs(DIFFICULTY.MAX_WAVE_SPEED - DIFFICULTY.INITIAL_WAVE_SPEED);
    const currentSpeedDelta = Math.abs(this.currentWaveSpeed - DIFFICULTY.INITIAL_WAVE_SPEED);

    // Normalizar el factor de velocidad (0 a 1)
    const speedFactor = currentSpeedDelta / maxSpeedDelta;

    const intervalRange = DIFFICULTY.INITIAL_SPAWN_INTERVAL - DIFFICULTY.MIN_SPAWN_INTERVAL;

    const intervalReduction = intervalRange * speedFactor;

    let newInterval = DIFFICULTY.INITIAL_SPAWN_INTERVAL - intervalReduction;

    this.currentSpawnInterval = Math.max(newInterval, DIFFICULTY.MIN_SPAWN_INTERVAL);

    // -------------------------------------
    // C. APLICAR CAMBIOS AL TIMER (Solución a read-only)
    // -------------------------------------
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
    }

    this.spawnTimer = this.scene.time.addEvent({
      delay: this.currentSpawnInterval,
      callback: this.spawnWave,
      callbackScope: this,
      loop: true
    });

    console.log(`📈 Dificultad aumentada: Velocidad: ${this.currentWaveSpeed.toFixed(1)}, Intervalo: ${this.currentSpawnInterval.toFixed(0)}ms`);
    console.log(`🚀 Nuevo Gap Aproximado: ${Math.abs(this.currentWaveSpeed * this.currentSpawnInterval / 1000).toFixed(0)}px`);
  }

  /**
   * Generar una nueva ola
   */
  private spawnWave(): void {
    // 1. Variación de Altura (aumenta la dificultad en altura)
    const heightRange = WAVE.MAX_Y - WAVE.MIN_Y;
    const variation = heightRange * DIFFICULTY.HEIGHT_VARIATION_FACTOR;

    const minSpawnY = WAVE.MIN_Y + variation / 2;
    const maxSpawnY = WAVE.MAX_Y - variation / 2;

    const spawnY = Phaser.Math.Between(minSpawnY, maxSpawnY);

    // 2. Crear nueva ola
    const wave = new Wave(this.scene, WAVE.INITIAL_SPAWN_X, spawnY);
    this.waves.add(wave);

    // 3. Aplicar Velocidad Actual
    (wave.body as Phaser.Physics.Arcade.Body).setVelocityX(this.currentWaveSpeed);
  }

  // ... (el resto de getters y métodos auxiliares se mantiene)
  public getSpawnInterval(): number {
    return Math.round(this.currentSpawnInterval);
  }

  public getCurrentWaveSpeed(): number {
    return Math.round(this.currentWaveSpeed);
  }

  public getActiveWaveCount(): number {
    return this.waves.getLength();
  }

  public clearAllWaves(): void {
    this.waves.clear(true, true);
    console.log('🗑️ Todas las olas eliminadas');
  }

  public destroy(): void {
    this.stopSpawning();
    this.clearAllWaves();
    console.log('❌ WaveManager destruido');
  }
}