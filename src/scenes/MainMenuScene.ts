// src/scenes/MainMenuScene.ts

import Phaser from 'phaser';
import { WORLD, COLORS } from '../utils/Constants'; // Asumiendo que tienes WORLD y COLORS

export class MainMenuScene extends Phaser.Scene {
    private startKey!: Phaser.Input.Keyboard.Key;
    private startText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload(): void {
        // Aquí podrías cargar una fuente personalizada o imágenes si fuera necesario.
        // Por ahora, usaremos fuentes de Phaser.
        console.log('MainMenuScene: Preload');
    }

    create(): void {
        console.log('MainMenuScene: Create');
        
        const { width, height } = this.cameras.main;

        this.cameras.main.setBackgroundColor(WORLD.BACKGROUND_COLOR);

        // 1. TÍTULO PRINCIPAL (WAVE RIDER)
        this.add.text(
            width / 2, 
            height / 3, 
            'WAVE RIDER', 
            {
                font: '80px Arial Black', // Fuente grande y llamativa
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center'
            }
        ).setOrigin(0.5);

        // 2. TEXTO INICIO
        this.startText = this.add.text(
            width / 2, 
            height / 2 + 100, 
            'Press SPACE to Start', 
            {
                font: '32px Arial',
                color: '#FFD93D', // Un color vibrante para el CTA
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        // 3. 🚀 EFECTO DE PARPADEO ÓPTIMO con TWEENS
        this.tweens.add({
            targets: this.startText,
            alpha: 0.2, // Reducir la opacidad a 20%
            ease: 'Sine.easeInOut', // Curva de animación suave
            duration: 600, // Duración de la transición de opacidad (en ms)
            yoyo: true, // Hace que la animación se revierta (de 0.2 a 1.0)
            repeat: -1 // Repetir la animación infinitamente
        });

        // 3. CONFIGURAR CONTROL
        this.startKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // También aceptamos un clic/toque
        this.input.on('pointerdown', this.startGame, this);
    }

    update(): void {
        // 4. DETECTAR ENTRADA
        if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
            this.startGame();
        }
    }

    private startGame(): void {
        // Transición a la GameScene
        this.scene.start('GameScene');
    }
}