import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Aquí cargaremos assets en el futuro
    console.log('BootScene: Preload');
  }

  create(): void {
    console.log('BootScene: Create');
    
    // Texto de prueba
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    const titleText = this.add.text(centerX, centerY - 50, 'WAVE RIDER', {
      fontSize: '64px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    const subtitleText = this.add.text(centerX, centerY + 50, 'Phaser 3 + TypeScript Setup Complete!', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Animación simple del título
    this.tweens.add({
      targets: titleText,
      y: centerY - 60,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    console.log('✅ Setup completado correctamente!');
  }

  update(): void {
    // Game loop
  }
}