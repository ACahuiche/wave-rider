import { SCORE } from '../utils/Constants';

/**
 * Gestor de puntuación para el juego.
 * Maneja la puntuación actual y la puntuación más alta (high score).
 */
export class ScoreManager {
    private currentScore: number;
    private highScore: number;
    private scoreUpdateTimer: Phaser.Time.TimerEvent | null;
    private scene: Phaser.Scene;

    // Clave para guardar la puntuación más alta en el almacenamiento local
    private static readonly HIGH_SCORE_KEY = 'waveRiderHighScore';

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.currentScore = 0;
        this.highScore = this.loadHighScore();
        this.scoreUpdateTimer = null;
    }

    /**
     * Carga la puntuación más alta desde el localStorage.
     * @returns La puntuación más alta guardada, o 0 si no existe.
     */
    private loadHighScore(): number {
        const savedScore = localStorage.getItem(ScoreManager.HIGH_SCORE_KEY);
        return savedScore ? parseInt(savedScore, 10) : 0;
    }

    /**
     * Guarda la puntuación más alta en el localStorage.
     */
    private saveHighScore(): void {
        localStorage.setItem(ScoreManager.HIGH_SCORE_KEY, this.highScore.toString());
    }

    /**
     * Inicia el contador de puntuación que aumenta con el tiempo.
     */
    public start(): void {
        this.currentScore = 0;

        // Detener cualquier timer anterior para evitar duplicados
        if (this.scoreUpdateTimer) {
            this.scoreUpdateTimer.destroy();
        }

        // Crear un nuevo timer para sumar puntos cada segundo
        this.scoreUpdateTimer = this.scene.time.addEvent({
            delay: 1000, // 1 segundo
            callback: () => {
                this.add(SCORE.POINTS_PER_SECOND);
            },
            loop: true,
        });

        console.log('🏁 ScoreManager iniciado.');
    }

    /**
     * Detiene el contador de puntuación y actualiza la puntuación más alta.
     */
    public stop(): void {
        if (this.scoreUpdateTimer) {
            this.scoreUpdateTimer.destroy();
            this.scoreUpdateTimer = null;
        }

        this.updateHighScore();
        console.log(`🏁 ScoreManager detenido. Puntuación final: ${this.currentScore}`);
    }

    /**
     * Añade una cantidad específica a la puntuación actual.
     * @param points - Puntos a añadir.
     */
    public add(points: number): void {
        this.currentScore += points;
    }

    /**
     * Comprueba si la puntuación actual es mayor que la más alta y la actualiza.
     */
    public updateHighScore(): void {
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
            console.log(`🏆 ¡Nuevo récord! Puntuación más alta: ${this.highScore}`);
        }
    }

    /**
     * Obtiene la puntuación actual.
     * @returns La puntuación actual.
     */
    public getScore(): number {
        return this.currentScore;
    }

    /**
     * Obtiene la puntuación más alta.
     * @returns La puntuación más alta.
     */
    public getHighScore(): number {
        return this.highScore;
    }

    /**
     * Reinicia la puntuación actual a cero.
     */
    public reset(): void {
        this.currentScore = 0;
    }
}
