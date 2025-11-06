import Phaser from 'phaser';
import { WAVE } from '../utils/Constants';

/**
 * Entidad Wave (Ola).
 * Se mueve horizontalmente, no cae, y empuja al jugador si colisiona lateralmente.
 */
export class Wave extends Phaser.Physics.Arcade.Sprite {
  public body!: Phaser.Physics.Arcade.Body;
  private readonly baseY: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, null!);
    this.baseY = y;

    // Añadir a escena y física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Crear textura placeholder
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x808080, 1);
    graphics.fillRect(0, 0, WAVE.WIDTH, WAVE.HEIGHT);
    graphics.generateTexture('wave_placeholder', WAVE.WIDTH, WAVE.HEIGHT);
    graphics.destroy();
    this.setTexture('wave_placeholder');

    // Configurar cuerpo físico
    this.body.setSize(WAVE.WIDTH, WAVE.HEIGHT, true);

    // 🔹 Sin gravedad (no afecta al eje Y)
    this.body.setAllowGravity(false);
    this.body.setGravity(0, 0);

    // 🔹 Permite empuje lateral
    this.body.setImmovable(false);
    this.body.setBounce(0, 0);

    // 🔹 Movimiento horizontal constante
    this.body.setVelocityX(WAVE.SPEED_X);

    console.log(`🌊 Wave creada en (${x}, ${y}) con movimiento horizontal.`);
  }

  public update(): void {
    if (this.y !== this.baseY) {
      this.setY(this.baseY);
      this.body.setVelocityY(0);
    }

    // Mantener velocidad horizontal
    if (this.body.velocity.x !== WAVE.SPEED_X) {
      this.body.setVelocityX(WAVE.SPEED_X);
    }

    // Destruir si sale de pantalla
    if (this.x < WAVE.DESTROY_X) {
      console.log('🗑️ Wave destruida (fuera de pantalla)');
      this.destroy();
    }
  }
}
