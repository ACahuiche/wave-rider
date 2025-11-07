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
        // La colisión de Arcade se usa para la muerte lateral y la colisión a baja velocidad.
        this.physics.add.collider(
            this.player,
            this.waves,
            this.handleWaveCollision,
            undefined, // No necesitamos un process callback si el handle solo verifica la muerte lateral
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
        this.add.text(10, 10, 'WAVE RIDER - Spawn Test', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });

        this.add.text(10, 40, 'SPACE/CLICK to jump', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });

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
            `Can Jump: ${canJump ? '✅' : '❌'}`,
            `Velocity Y: ${Math.round(this.player.body.velocity.y)}`
        ]);
    }

    /**
     * Manejador de colisión Player-Wave (Principalmente para muerte lateral)
     */
    private handleWaveCollision(playerObj: any, waveObj: any): void {
        const player = playerObj as Player;

        // Muerte por colisión lateral
        if (!player.body.touching.down &&
            (player.body.touching.left || player.body.touching.right)) {
            
            console.log('💥 Player golpeado lateralmente. ¡Game Over!');

            this.waveManager.stopSpawning();
            player.body.setVelocityX(0);
            player.body.setVelocityY(0);
            player.body.setAllowGravity(false);
            player.setFillStyle(0xFF0000);
            
            this.time.delayedCall(2000, () => {
                this.scene.restart();
            });
        }
    }


    /**
     * 🚀 FIX DEFINITIVO DE TUNNELING (CCD por Proyección) 🚀
     * Calcula el momento exacto de impacto (Time of Impact - TOI) y corrige la posición.
     */
    private checkContinuousCollision(): void {
        const player = this.player;
        const playerBody = player.body;

        // 1. Solo ejecutar si el jugador está CAYENDO y la colisión normal FALLÓ
        if (playerBody.velocity.y <= 0 || playerBody.touching.down) {
            return;
        }

        const activeWaves = this.waves.getChildren() as Wave[];

        // Propiedades de la trayectoria
        const yPrev = playerBody.prev.y;     // Posición Y del centro del cuerpo en el frame anterior
        const deltaY = playerBody.y - yPrev; // Distancia vertical recorrida en este frame
        const playerHalfHeight = playerBody.halfHeight;
        
        // CALCULAR BORDES EN LA POSICIÓN ANTERIOR
        const xPrev = playerBody.prev.x;
        const playerPrevLeft = xPrev - playerBody.halfWidth; 
        const playerPrevRight = xPrev + playerBody.halfWidth; 

        let lowestTimeOfImpact = Infinity;
        let hitYPosition = 0; // Posición Y del centro del cuerpo (punto de contacto)

        for (const wave of activeWaves) {
            const waveBody = wave.body;
            const waveTop = waveBody.top;
            
            // Comprobación horizontal de la trayectoria (rayo)
            const isHorizontallyAligned = 
                playerPrevRight >= waveBody.left && 
                playerPrevLeft <= waveBody.right;

            if (!isHorizontallyAligned) {
                continue;
            }
            
            // Posición del borde inferior del jugador en el frame anterior
            const playerPrevBottom = yPrev + playerHalfHeight;
            
            // Distancia que queda por recorrer para tocar la ola
            const distanceToWave = waveTop - playerPrevBottom;

            // Si ya estaba tocando o por debajo en el frame anterior
            if (distanceToWave < 0) {
                continue;
            }

            // Calcular el Tiempo de Impacto (TOI)
            let timeOfImpact = distanceToWave / deltaY;
            
            // Filtrar solo impactos válidos (0 < TOI <= 1)
            if (timeOfImpact > 0 && timeOfImpact <= 1) {
                if (timeOfImpact < lowestTimeOfImpact) {
                    lowestTimeOfImpact = timeOfImpact;
                    // Posición Y del centro del cuerpo para contacto perfecto
                    hitYPosition = waveTop - playerHalfHeight; 
                }
            }
        }

        // 2. Aplicar la corrección si se detectó el impacto más cercano
        if (lowestTimeOfImpact < Infinity) {
            console.log(`💥 [CCD Corregido] Aterrizaje forzado.`);
            
            // 🛠️ FIX DEFINITIVO: Usamos un buffer muy pequeño (0.1px) y deshabilitamos
            // temporalmente la física para evitar el "empuje" de separación que causa el atasco.
            const tinyBuffer = 0.1;
            const finalCorrectionY = hitYPosition - tinyBuffer; 

            // Corregir la posición Y del centro del cuerpo del jugador
            playerBody.y = finalCorrectionY; 
            
            // Actualizar la posición del GameObject visual
            player.setY(finalCorrectionY + playerHalfHeight); 
            
            // Detener la caída
            playerBody.setVelocityY(0);
            
            // Forzar el estado de aterrizaje (evita el atasco de salto)
            player.setCanJump(true); 
            
            // DESACTIVACIÓN TEMPORAL DE FÍSICA: 
            // Previene que la lógica de separación de Arcade lo empuje en el resto de este frame.
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
        
        if (this.player) {
            this.player.update();
            
            // Ejecutamos la corrección CCD.
            this.checkContinuousCollision();
        }

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