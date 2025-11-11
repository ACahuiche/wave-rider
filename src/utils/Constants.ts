/**
 *  * 🌊 Wave Rider - Constants.ts
  * Archivo central para definir valores globales del juego.
   * Aquí puedes ajustar fácilmente la física, velocidades, tamaños, colores, etc.
    */

// ==== CONFIGURACIÓN DEL MUNDO ====
export const WORLD = {
    WIDTH: 800,
    HEIGHT: 600,
    BACKGROUND_COLOR: '#1ca3ec'
} as const;

// ==== CONFIGURACIÓN DEL JUGADOR ====
export const PLAYER = {
    // Visual
    WIDTH: 32,
    HEIGHT: 32,
    COLOR: 0xFF6B35, // Naranja coral

    // Física
    GRAVITY_Y: 800,
    JUMP_FORCE: -500,
    BOUNCE: 0,
    FRICTION_X: 1,
    FRICTION_Y: 0,
    MAX_FALL_VELOCITY: 500,

    // Posición inicial
    START_X: 100,
    START_Y: 300
} as const;

// ==== CONFIGURACIÓN DE LAS OLAS ====
export const WAVE = {
    // Visual
    WIDTH: 150, // Ancho de la ola
    HEIGHT: 50, // Alto de la ola
    COLOR: 0x808080, // Gris (placeholder)

    // Física y Movimiento
    SPEED_X: -200, // Velocidad hacia la izquierda (inicial)
    INITIAL_SPAWN_X: 850, // Fuera de pantalla derecha

    // Altura de spawn (más variedad para más desafío)
    MIN_Y: 350, // Altura mínima de spawn
    MAX_Y: 550, // Altura máxima de spawn

    // Límite de destrucción
    DESTROY_X: -200, // Se destruye cuando sale de pantalla

    // Spawn interval (ms)
    SPAWN_INTERVAL: 1500 // Intervalo inicial entre olas
} as const;

// ==== SISTEMA DE PUNTUACIÓN ====
export const SCORE = {
    POINTS_PER_SECOND: 10,      // Puntos pasivos por sobrevivir
    POINTS_PER_JUMP: 50,         // Puntos por salto exitoso
    POINTS_PER_WAVE_PASSED: 100, // Bonus por pasar una ola
    DISTANCE_PER_SECOND: 5
} as const;

// ==== DIFICULTAD Y PROGRESIÓN ====
export const DIFFICULTY = {
    // Spawn de olas
    INITIAL_SPAWN_INTERVAL: 1500, // ms - intervalo inicial
    MIN_SPAWN_INTERVAL: 800,      // ms - intervalo mínimo
    
    // 🆕 La dificultad se ajusta cada 10 segundos
    INCREASE_INTERVAL_SECONDS: 10, 
    
    // Velocidad de olas
    INITIAL_WAVE_SPEED: -200,     // px/s - velocidad inicial (Debe ser WAVE.SPEED_X)
    MAX_WAVE_SPEED: -500,         // px/s - velocidad máxima
    
    // 🆕 COEFICIENTE DE CURVA: velocidad = baseSpeed - (tiempo_en_segundos_activos * 5)
    SPEED_INCREASE_RATE_PER_SECOND: 5, 

    // Ajuste de Altura (Varía la altura entre el 80% y 100% del rango original)
    HEIGHT_VARIATION_FACTOR: 0.2 // 20% de variación
} as const;

// ==== COLORES DEL JUEGO (Paleta) ====
export const COLORS = {
    SKY: '#87CEEB',           // Cielo
    OCEAN: '#1CA3EC',         // Océano (fondo actual)
    WAVE: '#0D7AB8',          // Ola (azul más oscuro)
    WAVE_CREST: '#FFFFFF',    // Cresta/espuma
    PLAYER: '#FF6B35',        // Jugador (naranja coral)
    UI_ACCENT: '#FFD93D',     // Acento UI (amarillo)
    DANGER: '#FF0000',        // Rojo para game over
    SUCCESS: '#00FF00'        // Verde para feedback positivo
} as const;

// ==== CONFIGURACIÓN DE FÍSICA ====
export const PHYSICS = {
    FPS: 60,
    GRAVITY_X: 0,
    GRAVITY_Y: 0, // Sin gravedad global (cada entidad decide)
    DEBUG: true  // Cambiar a true para ver hitboxes
} as const;

// ==== CONFIGURACIÓN DE AUDIO (para cuando lo agregues) ====
export const AUDIO = {
    MASTER_VOLUME: 0.7,
    MUSIC_VOLUME: 0.5,
    SFX_VOLUME: 0.8,

    // IDs de assets (para preload)
    MUSIC_MENU: 'music_menu',
    MUSIC_GAME: 'music_game',
    SFX_JUMP: 'sfx_jump',
    SFX_SPLASH: 'sfx_splash',
    SFX_GAMEOVER: 'sfx_gameover',
    SFX_RECORD: 'sfx_record'
} as const;

// ==== KEYS DE ESCENAS ====
export const SCENES = {
    BOOT: 'BootScene',
    MENU: 'MainMenuScene',
    GAME: 'GameScene',
    GAME_OVER: 'GameOverScene'
} as const;

// ==== CONFIGURACIÓN DE STORAGE (localStorage) ====
export const STORAGE_KEYS = {
    HIGH_SCORE: 'wave_rider_high_score',
    AUDIO_MUTED: 'wave_rider_audio_muted',
    BEST_DISTANCE: 'wave_rider_best_distance'
} as const;

// ==== MÉTRICAS DE GAMEPLAY (para testing/balanceo) ====
export const GAMEPLAY_TARGETS = {
    // Tiempos objetivo de supervivencia
    BEGINNER_TARGET_TIME: 15,     // segundos
    CASUAL_TARGET_TIME: 30,       // segundos
    COMPETENT_TARGET_TIME: 60,    // segundos
    EXPERT_TARGET_TIME: 120,      // segundos

    // FPS objetivo
    TARGET_FPS: 60
} as const;

// ==== DEBUG / DEV OPTIONS ====
export const DEBUG = {
    LOG_PLAYER_STATE: false,
    LOG_WAVE_SPAWN: false,
    LOG_COLLISIONS: false,
    SHOW_PHYSICS_DEBUG: false,
    INVINCIBLE_MODE: false        // Para testing
} as const;

// ==== EXPORT POR DEFECTO (para imports más limpios) ====
export default {
    WORLD,
    PLAYER,
    WAVE,
    SCORE,
    DIFFICULTY,
    COLORS,
    PHYSICS,
    AUDIO,
    SCENES,
    STORAGE_KEYS,
    GAMEPLAY_TARGETS,
    DEBUG
};
 