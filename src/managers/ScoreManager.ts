import { SCORE } from '../utils/Constants';

/**
 * Gestor de puntuación para el juego.
 * Maneja la puntuación actual y la puntuación más alta (high score),
 * además de calcular la distancia recorrida.
 */
export class ScoreManager {
    private currentScore: number;
    private distanceTraveled: number; // 🆕 Distancia acumulada (en metros simulados)
    private isDistanceActive: boolean;
    private isRunning: boolean;       // 🆕 Flag para saber si el juego está activo
    private highScore: number;
    private scoreUpdateTimer: Phaser.Time.TimerEvent | null; // Lo mantenemos por si lo usas para otros puntos
    private scene: Phaser.Scene;

    // Clave para guardar la puntuación más alta en el almacenamiento local
    private static readonly HIGH_SCORE_KEY = 'waveRiderHighScore';

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.currentScore = 0;
        this.distanceTraveled = 0; // Inicializar
        this.isDistanceActive = false;
        this.isRunning = false;    // Inicializar
        this.highScore = this.loadHighScore();
        this.scoreUpdateTimer = null;
    }

    // ... (loadHighScore y saveHighScore se mantienen igual) ...
    private loadHighScore(): number {
        const savedScore = localStorage.getItem(ScoreManager.HIGH_SCORE_KEY);
        return savedScore ? parseInt(savedScore, 10) : 0;
    }

    private saveHighScore(): void {
        localStorage.setItem(ScoreManager.HIGH_SCORE_KEY, this.highScore.toString());
    }

    /**
     * Inicia el gestor de puntuación.
     */
    public start(): void {
        this.currentScore = 0;
        this.distanceTraveled = 0; // Resetear distancia
        this.isDistanceActive = false;
        this.isRunning = true;     // Activar el contador
        
        // El timer se mantiene si quieres seguir sumando POINTS_PER_SECOND a currentScore
        if (this.scoreUpdateTimer) {
            this.scoreUpdateTimer.destroy();
        }

        this.scoreUpdateTimer = this.scene.time.addEvent({
            delay: 1000, 
            callback: () => {
                this.add(SCORE.POINTS_PER_SECOND);
            },
            loop: true,
        });

        console.log('🏁 ScoreManager iniciado.');
    }

    public setIsDistanceActive(isActive: boolean): void {
        this.isDistanceActive = isActive;
        console.log(`Distancia: ${isActive ? 'ACTIVA' : 'INACTIVA'}`);
    }

    /**
     * 🆕 Debe llamarse en el método update() de la escena.
     * Acumula la distancia recorrida.
     * @param delta Tiempo transcurrido desde el último frame (en ms).
     */
    public update(delta: number): void {
        if (!this.isRunning || !this.isDistanceActive) {
            return;
        }
        
        // Conversión de delta (ms) a segundos
        const seconds = delta / 1000; 
        
        // Calcular metros recorridos en este frame
        // Utilizamos la constante de Constants.ts
        const metersThisFrame = seconds * SCORE.DISTANCE_PER_SECOND;
        
        // Acumular distancia
        this.distanceTraveled += metersThisFrame;
    }

    /**
     * Detiene el contador de puntuación y actualiza la puntuación más alta.
     */
    public stop(): void {
        this.isRunning = false; // Detener la actualización en update()
        
        if (this.scoreUpdateTimer) {
            this.scoreUpdateTimer.destroy();
            this.scoreUpdateTimer = null;
        }

        // ⚠️ Nota: Aquí debes decidir si el HighScore se basa en 'currentScore' o 'distanceTraveled'.
        // Si el HighScore es la distancia (CAH-13), debes actualizar esta lógica.
        this.updateHighScore(); 
        console.log(`🏁 ScoreManager detenido. Distancia final: ${this.getDistance()}m`);
    }

    // ... (El método add se mantiene igual) ...
    public add(points: number): void {
        this.currentScore += points;
    }

    /**
     * ⚠️ ATENCIÓN: Ahora esta función actualiza el récord con la DISTANCIA, no el SCORE.
     */
    public updateHighScore(): void {
        // Usamos la distancia (que ahora es el objetivo principal de la puntuación)
        const currentDistance = this.getDistance(); 
        
        if (currentDistance > this.highScore) {
            this.highScore = currentDistance;
            // ⚠️ La clave HIGH_SCORE_KEY ahora guarda la distancia
            this.saveHighScore(); 
            console.log(`🏆 ¡Nuevo récord! Distancia más alta: ${this.highScore}m`);
        }
    }

    // ... (getScore y getHighScore se mantienen igual) ...
    public getScore(): number {
        return this.currentScore;
    }

    public getHighScore(): number {
        return this.highScore; // Nota: Esto ahora devuelve la distancia del récord
    }
    
    /**
     * 🆕 Devuelve la distancia redondeada al metro más cercano.
     */
    public getDistance(): number {
        return Math.round(this.distanceTraveled);
    }
    
    // ... (reset se mantiene igual) ...
    public reset(): void {
        this.currentScore = 0;
        this.distanceTraveled = 0;
    }
}