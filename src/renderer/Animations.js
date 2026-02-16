// ─── Animations ───
// Système d'animations globales : wheat growth, marching ants, jitter

import { WAVE_DELAY, GROW_DURATION } from '../utils/constants.js';
import { getAnimFrame } from '../utils/wiggly.js';

export class AnimationSystem {
  constructor() {
    this.callbacks = new Set();
    this.running = false;
    this._rafId = null;

    // Wheat animation state
    this.wheatAnimating = false;
    this.wheatStartTime = 0;
    this.wheatDistances = null;
    this.wheatMaxDist = 0;

    // Escape path animation
    this.escapeAnimOffset = 0;
  }

  /**
   * Enregistre un callback à exécuter chaque frame
   */
  register(callback) {
    this.callbacks.add(callback);
    if (!this.running) this.start();
  }

  /**
   * Retire un callback
   */
  unregister(callback) {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0) this.stop();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._loop();
  }

  stop() {
    this.running = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _loop() {
    if (!this.running) return;

    // Animation de l'offset pour le chemin d'échappement (marching ants)
    this.escapeAnimOffset = (performance.now() / 100) % 16;

    for (const cb of this.callbacks) {
      cb(performance.now());
    }

    this._rafId = requestAnimationFrame(() => this._loop());
  }

  /**
   * Démarre l'animation de croissance du blé
   * @param {Map<number, number>} distances - Map idx → distance BFS
   */
  startWheatAnimation(distances) {
    if (!distances) return;
    this.wheatAnimating = true;
    this.wheatStartTime = performance.now();
    this.wheatDistances = distances;
    this.wheatMaxDist = Math.max(...distances.values());
  }

  /**
   * Retourne le stade de croissance du blé pour une cellule donnée
   * @param {number} idx - Index de la cellule
   * @param {number} now - Timestamp actuel
   * @returns {number} Stade 0-3, ou -1 si pas encore commencé
   */
  getWheatStage(idx, now) {
    if (!this.wheatAnimating || !this.wheatDistances) return -1;

    const dist = this.wheatDistances.get(idx);
    if (dist === undefined) return -1;

    const elapsed = now - this.wheatStartTime;
    const cellStart = dist * WAVE_DELAY;

    if (elapsed < cellStart) return -1;

    const cellElapsed = elapsed - cellStart;
    const progress = Math.min(1, cellElapsed / GROW_DURATION);

    return Math.floor(progress * 3.99);
  }

  /**
   * Vérifie si l'animation wheat est terminée
   */
  isWheatComplete(now) {
    if (!this.wheatAnimating) return true;
    const totalDuration = this.wheatMaxDist * WAVE_DELAY + GROW_DURATION;
    return now - this.wheatStartTime > totalDuration;
  }

  stopWheat() {
    this.wheatAnimating = false;
    this.wheatDistances = null;
  }
}
