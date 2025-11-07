// src/managers/WaveManager.ts
import Phaser from 'phaser';
import { Wave } from '../entities/Wave';
import { WAVE } from '../utils/Constants';

/**
 * WaveManager - Gestiona el spawn automático de olas
 * - Spawn en intervalos regulares
 * - Altura aleatoria
 * - Pool de objetos para optimización
 */
export class WaveManager {
  private scene: Phaser.Scene;
  private waves: Phaser.GameObjects.Group;
  private spawnTimer?: Phaser.Time.TimerEvent;
  private spawnInterval: number;
  private isSpawning: boolean = false;

  constructor(scene: Phaser.Scene, waves: Phaser.GameObjects.Group) {
    this.scene = scene;
    this.waves = waves;
    this.spawnInterval = 1500; // ms - valor inicial

    console.log('✅ WaveManager creado');
  }

  /**
   * Iniciar el spawn automático de olas
   */
  public startSpawning(): void {
    if (this.isSpawning) {
      console.warn('⚠️ WaveManager ya está spawneando');
      return;
    }

    this.isSpawning = true;

    // Crear timer que se repite
    this.spawnTimer = this.scene.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnWave,
      callbackScope: this,
      loop: true
    });

    console.log('🌊 WaveManager: Spawn automático iniciado');
    console.log(`   Intervalo: ${this.spawnInterval}ms`);
  }

  /**
   * Detener el spawn de olas
   */
  public stopSpawning(): void {
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
      this.spawnTimer = undefined;
    }
    this.isSpawning = false;
    console.log('🛑 WaveManager: Spawn detenido');
  }

  /**
   * Generar una nueva ola
   */
  private spawnWave(): void {
    // Posición X: Fuera de pantalla a la derecha
    const x = WAVE.INITIAL_SPAWN_X;

    // Posición Y: Altura aleatoria entre MIN_Y y MAX_Y
    const y = Phaser.Math.Between(WAVE.MIN_Y, WAVE.MAX_Y);

    // Crear nueva ola
    const wave = new Wave(this.scene, x, y);
    this.waves.add(wave);

    console.log(`🌊 Ola spawneada en (${x}, ${y})`);
  }

  /**
   * Cambiar el intervalo de spawn (para aumentar dificultad)
   */
  public setSpawnInterval(newInterval: number): void {
    this.spawnInterval = Math.max(800, newInterval); // Mínimo 800ms

    // Reiniciar timer con nuevo intervalo
    if (this.isSpawning && this.spawnTimer) {
      this.stopSpawning();
      this.startSpawning();
    }

    console.log(`⏱️ WaveManager: Intervalo actualizado a ${this.spawnInterval}ms`);
  }

  /**
   * Obtener el intervalo actual
   */
  public getSpawnInterval(): number {
    return this.spawnInterval;
  }

  /**
   * Limpiar todas las olas
   */
  public clearAllWaves(): void {
    this.waves.clear(true, true);
    console.log('🗑️ Todas las olas eliminadas');
  }

  /**
   * Obtener cantidad de olas activas
   */
  public getActiveWaveCount(): number {
    return this.waves.getLength();
  }

  /**
   * Destruir el manager
   */
  public destroy(): void {
    this.stopSpawning();
    this.clearAllWaves();
    console.log('❌ WaveManager destruido');
  }
}