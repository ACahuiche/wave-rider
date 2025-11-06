// src/utils/Helpers.ts
import { DIFFICULTY, WAVE } from './Constants';

/**
 * 🛠️ Helpers - Funciones utilitarias del juego
 * Funciones puras que no dependen del estado del juego
 */

// ==== CONVERSIÓN DE COLORES ====

/**
 * Convertir color hexadecimal string a número
 * @param hexColor - Color en formato "#RRGGBB"
 * @returns Color como número (0xRRGGBB)
 * @example getColorNumber("#FF6B35") // 0xFF6B35
 */
export const getColorNumber = (hexColor: string): number => {
  return parseInt(hexColor.replace('#', '0x'));
};

/**
 * Convertir color número a hex string
 * @param colorNumber - Color como número (0xRRGGBB)
 * @returns Color en formato "#RRGGBB"
 * @example getColorHex(0xFF6B35) // "#FF6B35"
 */
export const getColorHex = (colorNumber: number): string => {
  return '#' + colorNumber.toString(16).padStart(6, '0').toUpperCase();
};

// ==== CÁLCULOS DE DIFICULTAD ====

/**
 * Calcular velocidad de ola según tiempo transcurrido
 * La velocidad aumenta progresivamente cada 10 segundos
 * @param elapsedTimeSeconds - Tiempo de juego en segundos
 * @returns Velocidad en px/s (negativa = hacia la izquierda)
 */
export const calculateWaveSpeed = (elapsedTimeSeconds: number): number => {
  const { INITIAL_WAVE_SPEED, MAX_WAVE_SPEED, SPEED_INCREASE_RATE } = DIFFICULTY;
  const cycles = Math.floor(elapsedTimeSeconds / 10);
  const speedIncrease = cycles * SPEED_INCREASE_RATE;
  const newSpeed = INITIAL_WAVE_SPEED - speedIncrease;
  
  return Math.max(MAX_WAVE_SPEED, newSpeed);
};

/**
 * Calcular intervalo de spawn según tiempo transcurrido
 * El intervalo disminuye progresivamente cada 15 segundos
 * @param elapsedTimeSeconds - Tiempo de juego en segundos
 * @returns Intervalo en milisegundos
 */
export const calculateSpawnInterval = (elapsedTimeSeconds: number): number => {
  const { INITIAL_SPAWN_INTERVAL, MIN_SPAWN_INTERVAL, SPAWN_INTERVAL_DECREASE } = DIFFICULTY;
  const cycles = Math.floor(elapsedTimeSeconds / 15);
  const intervalDecrease = cycles * SPAWN_INTERVAL_DECREASE;
  const newInterval = INITIAL_SPAWN_INTERVAL - intervalDecrease;
  
  return Math.max(MIN_SPAWN_INTERVAL, newInterval);
};

// ==== GENERACIÓN ALEATORIA ====

/**
 * Generar altura aleatoria para spawn de ola
 * @returns Posición Y aleatoria entre MIN_Y y MAX_Y
 */
export const getRandomWaveHeight = (): number => {
  return Phaser.Math.Between(WAVE.MIN_Y, WAVE.MAX_Y);
};

/**
 * Generar número aleatorio entre min y max (inclusive)
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns Número aleatorio entero
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generar número aleatorio flotante entre min y max
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns Número aleatorio flotante
 */
export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Elegir elemento aleatorio de un array
 * @param array - Array de elementos
 * @returns Elemento aleatorio del array
 */
export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// ==== FORMATEO DE TEXTO ====

/**
 * Formatear puntuación con separadores de miles
 * @param score - Puntuación numérica
 * @returns String formateado (ej: "1,234,567")
 */
export const formatScore = (score: number): string => {
  return score.toLocaleString('en-US');
};

/**
 * Formatear tiempo en MM:SS
 * @param seconds - Tiempo en segundos
 * @returns String formateado (ej: "02:45")
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formatear distancia en metros
 * @param distance - Distancia numérica
 * @returns String formateado (ej: "1,234m")
 */
export const formatDistance = (distance: number): string => {
  return `${Math.floor(distance).toLocaleString('en-US')}m`;
};

// ==== MATEMÁTICAS ====

/**
 * Clamp (limitar) un valor entre min y max
 * @param value - Valor a limitar
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns Valor limitado
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Interpolar linealmente entre dos valores
 * @param start - Valor inicial
 * @param end - Valor final
 * @param t - Factor de interpolación (0-1)
 * @returns Valor interpolado
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * Mapear un valor de un rango a otro
 * @param value - Valor a mapear
 * @param inMin - Mínimo del rango de entrada
 * @param inMax - Máximo del rango de entrada
 * @param outMin - Mínimo del rango de salida
 * @param outMax - Máximo del rango de salida
 * @returns Valor mapeado
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// ==== STORAGE (localStorage) ====

/**
 * Guardar valor en localStorage
 * @param key - Clave
 * @param value - Valor (se convierte a JSON)
 */
export const saveToStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
  }
};

/**
 * Obtener valor de localStorage
 * @param key - Clave
 * @returns Valor parseado o null si no existe
 */
export const loadFromStorage = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error cargando de localStorage:', error);
    return null;
  }
};

/**
 * Eliminar valor de localStorage
 * @param key - Clave
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error eliminando de localStorage:', error);
  }
};

/**
 * Limpiar todo el localStorage del juego
 */
export const clearAllStorage = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('wave_rider_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
};

// ==== VALIDACIÓN ====

/**
 * Verificar si un número es válido (no NaN, no Infinity)
 * @param value - Valor a verificar
 * @returns true si es válido
 */
export const isValidNumber = (value: number): boolean => {
  return !isNaN(value) && isFinite(value);
};

/**
 * Verificar si dos rectángulos se solapan
 * @param rect1 - Primer rectángulo {x, y, width, height}
 * @param rect2 - Segundo rectángulo {x, y, width, height}
 * @returns true si se solapan
 */
export const rectanglesOverlap = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// ==== DEBUG ====

/**
 * Log con timestamp y emoji
 * @param message - Mensaje a mostrar
 * @param emoji - Emoji opcional
 */
export const debugLog = (message: string, emoji: string = '🐛'): void => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${emoji} [${timestamp}] ${message}`);
};

/**
 * Log de performance
 * @param label - Etiqueta de la medición
 * @param fn - Función a medir
 */
export const measurePerformance = (label: string, fn: () => void): void => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`⏱️ [${label}] ${(end - start).toFixed(2)}ms`);
};

// ==== EXPORT POR DEFECTO ====
export default {
  // Colores
  getColorNumber,
  getColorHex,
  
  // Dificultad
  calculateWaveSpeed,
  calculateSpawnInterval,
  
  // Random
  getRandomWaveHeight,
  randomInt,
  randomFloat,
  randomChoice,
  
  // Formateo
  formatScore,
  formatTime,
  formatDistance,
  
  // Matemáticas
  clamp,
  lerp,
  mapRange,
  
  // Storage
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearAllStorage,
  
  // Validación
  isValidNumber,
  rectanglesOverlap,
  
  // Debug
  debugLog,
  measurePerformance
};