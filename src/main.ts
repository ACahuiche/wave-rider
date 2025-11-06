import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { WORLD, PHYSICS } from './utils/Constants';

// Configuración del juego
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WORLD.WIDTH,
  height: WORLD.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#1ca3ec',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: PHYSICS.GRAVITY_X, y: PHYSICS.GRAVITY_Y  },
      debug: PHYSICS.DEBUG
    }
  },
  scene: [GameScene]
};

// Inicializar el juego
const game = new Phaser.Game(config);

console.log('🌊 Wave Rider iniciado!');
console.log('Phaser version:', Phaser.VERSION);
console.log('Config:', {
  dimensions: `${config.width}x${config.height}`,
  backgroundColor: config.backgroundColor,
  physics: 'Arcade',
  gravity: config.physics?.arcade?.gravity
});
