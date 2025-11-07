import Phaser from 'phaser';
import { PLAYER } from '../utils/Constants';

export class Player extends Phaser.GameObjects.Rectangle {
  public body!: Phaser.Physics.Arcade.Body;
  private canJump: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Crear rectángulo naranja (placeholder)
    super(scene, x, y, PLAYER.WIDTH, PLAYER.HEIGHT, PLAYER.COLOR);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);
    this.body.setAllowGravity(true);
    this.body.setGravityY(PLAYER.GRAVITY_Y);
    this.body.setBounce(PLAYER.BOUNCE);
    this.body.setFriction(PLAYER.FRICTION_X, PLAYER.FRICTION_Y);
    this.body.setMaxVelocity(0, PLAYER.MAX_FALL_VELOCITY);

    console.log('✅ Player creado en posición:', { x, y });
  }

  /** Saltar */
  public jump(): void {
    if (this.canJump) {
      this.body.setVelocityY(PLAYER.JUMP_FORCE);
      this.setCanJump(false);
      console.log('🦘 Player saltó!');
    } else {
      console.log('❌ Player intentó saltar (en el aire)');
    }
  }

  public setCanJump(value: boolean): void {
    this.canJump = value;
  }

  public getCanJump(): boolean {
    return this.canJump;
  }

  public update(): void {
    // Si está sobre una superficie (ola o suelo)
    if (this.body.onFloor() || this.body.touching.down) {
      this.setCanJump(true);
    }
    else {
      this.setCanJump(false);
    }
  }
}
