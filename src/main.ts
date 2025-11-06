import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';

// Configuración del juego
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#1ca3ec',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800, x: 0 },
      debug: false
    }
  },
  scene: [BootScene]
};

// Inicializar el juego
const game = new Phaser.Game(config);

// Log de confirmación
console.log('🌊 Wave Rider iniciado!');
console.log('Phaser version:', Phaser.VERSION);