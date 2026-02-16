// ─── Game Engine ───
// Orchestrateur principal de la logique de jeu

import { solveBFS, bfsDistances } from './BFS.js';
import { calculateScore } from './Scoring.js';
import { UndoRedo } from './UndoRedo.js';
import { TERRAIN } from '../utils/constants.js';

export class GameEngine {
  constructor() {
    this.level = null;
    this.playerWalls = null;
    this.wallBudget = 0;
    this.wallsPlaced = 0;
    this.undoRedo = new UndoRedo();
    this.bfsResult = null;
    this.scoreResult = null;
    this.submitted = false;
    this.hoveredIdx = -1;
    this.showEscapePath = false;
  }

  /**
   * Charge un niveau
   * @param {Object} levelData - Données du niveau parsées
   * @param {number} wallBudget - Nombre de murs autorisés
   */
  loadLevel(levelData, wallBudget) {
    this.level = levelData;
    this.wallBudget = wallBudget;
    this.wallsPlaced = 0;
    this.playerWalls = new Uint8Array(levelData.rows * levelData.cols);
    this.undoRedo.reset();
    this.submitted = false;
    this.hoveredIdx = -1;
    this.showEscapePath = false;
    this.solve();
  }

  /**
   * Tente de placer ou retirer un mur à l'index donné
   * @param {number} idx - Index de la cellule
   * @returns {boolean} true si l'action a été effectuée
   */
  toggleWall(idx) {
    if (this.submitted) return false;
    if (!this.level) return false;

    const { terrain, cherries, gems, portals, playerIdx } = this.level;

    // Ne peut pas placer sur l'eau
    if (terrain[idx] === TERRAIN.WATER) return false;

    // Ne peut pas placer sur le cheval
    if (idx === playerIdx) return false;

    // Ne peut pas placer sur les cerises, gemmes ou portails
    if (cherries[idx] || gems[idx] || portals[idx] >= 0) return false;

    // Sauvegarder l'état avant modification
    this.undoRedo.push(this.playerWalls);

    if (this.playerWalls[idx]) {
      // Retirer le mur
      this.playerWalls = new Uint8Array(this.playerWalls);
      this.playerWalls[idx] = 0;
      this.wallsPlaced--;
    } else {
      // Placer un mur si on a encore du budget
      if (this.wallsPlaced >= this.wallBudget) return false;
      this.playerWalls = new Uint8Array(this.playerWalls);
      this.playerWalls[idx] = 1;
      this.wallsPlaced++;
    }

    this.solve();
    return true;
  }

  /**
   * Résout le BFS et calcule le score
   */
  solve() {
    if (!this.level) return;
    this.bfsResult = solveBFS(this.level, this.playerWalls);
    this.scoreResult = calculateScore(this.bfsResult);
  }

  /**
   * Undo
   */
  undo() {
    if (this.submitted) return false;
    const prevState = this.undoRedo.undo(this.playerWalls);
    if (!prevState) return false;
    this.playerWalls = prevState;
    this.wallsPlaced = this._countWalls();
    this.solve();
    return true;
  }

  /**
   * Redo
   */
  redo() {
    if (this.submitted) return false;
    const nextState = this.undoRedo.redo(this.playerWalls);
    if (!nextState) return false;
    this.playerWalls = nextState;
    this.wallsPlaced = this._countWalls();
    this.solve();
    return true;
  }

  /**
   * Reset tous les murs
   */
  reset() {
    if (this.submitted) return false;
    if (this.wallsPlaced === 0) return false;
    this.undoRedo.push(this.playerWalls);
    this.playerWalls = new Uint8Array(this.level.rows * this.level.cols);
    this.wallsPlaced = 0;
    this.solve();
    return true;
  }

  /**
   * Soumet la solution (une seule fois)
   */
  submit() {
    if (this.submitted) return null;
    this.submitted = true;
    this.solve();
    return this.scoreResult;
  }

  /**
   * Retourne les distances BFS (pour animation wheat)
   */
  getDistances() {
    if (!this.level) return null;
    return bfsDistances(this.level, this.playerWalls);
  }

  /**
   * Vérifie si une cellule peut recevoir un mur
   */
  canPlaceWall(idx) {
    if (!this.level) return false;
    if (this.submitted) return false;
    const { terrain, cherries, gems, portals, playerIdx } = this.level;
    if (terrain[idx] === TERRAIN.WATER) return false;
    if (idx === playerIdx) return false;
    if (cherries[idx] || gems[idx] || portals[idx] >= 0) return false;
    if (this.playerWalls[idx]) return true; // Peut retirer
    return this.wallsPlaced < this.wallBudget;
  }

  /**
   * Compte les murs placés
   */
  _countWalls() {
    let count = 0;
    for (let i = 0; i < this.playerWalls.length; i++) {
      if (this.playerWalls[i]) count++;
    }
    return count;
  }

  /**
   * Retourne l'état actuel du jeu
   */
  getState() {
    return {
      level: this.level,
      playerWalls: this.playerWalls,
      wallBudget: this.wallBudget,
      wallsPlaced: this.wallsPlaced,
      bfsResult: this.bfsResult,
      scoreResult: this.scoreResult,
      submitted: this.submitted,
      canUndo: this.undoRedo.canUndo,
      canRedo: this.undoRedo.canRedo,
    };
  }
}
