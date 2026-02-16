// ─── Level Manager ───
// Gestion des niveaux : chargement, navigation, sélection

import { DAILY_LEVELS } from './dailyLevels.js';
import { parseMap } from './MapParser.js';

export class LevelManager {
  constructor() {
    this.levels = DAILY_LEVELS;
    this.currentIndex = 0;
  }

  /**
   * Retourne le nombre total de niveaux
   */
  get count() {
    return this.levels.length;
  }

  /**
   * Retourne les infos du niveau courant (sans parser)
   */
  getCurrentLevelInfo() {
    return this.levels[this.currentIndex];
  }

  /**
   * Charge et parse le niveau courant
   * @returns {{ levelData: Object, wallBudget: number, name: string, dayNumber: number }}
   */
  loadCurrentLevel() {
    const info = this.levels[this.currentIndex];
    const levelData = parseMap(info.map);
    return {
      levelData,
      wallBudget: info.wallBudget,
      name: info.name,
      dayNumber: info.dayNumber,
      optimalScore: info.optimalScore,
    };
  }

  /**
   * Passe au niveau suivant
   * @returns {boolean} true si un niveau suivant existe
   */
  nextLevel() {
    if (this.currentIndex < this.levels.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  /**
   * Passe au niveau précédent
   * @returns {boolean} true si un niveau précédent existe
   */
  prevLevel() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }

  /**
   * Va à un niveau spécifique par index
   */
  goToLevel(index) {
    if (index >= 0 && index < this.levels.length) {
      this.currentIndex = index;
      return true;
    }
    return false;
  }

  /**
   * Va à un niveau par dayNumber
   */
  goToDay(dayNumber) {
    const idx = this.levels.findIndex((l) => l.dayNumber === dayNumber);
    if (idx >= 0) {
      this.currentIndex = idx;
      return true;
    }
    return false;
  }
}
