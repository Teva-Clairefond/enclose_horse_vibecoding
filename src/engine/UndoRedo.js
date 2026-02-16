// ─── Undo/Redo Stack ───

import { MAX_UNDO } from '../utils/constants.js';

export class UndoRedo {
  constructor() {
    /** @type {Uint8Array[]} */
    this.undoStack = [];
    /** @type {Uint8Array[]} */
    this.redoStack = [];
  }

  /**
   * Sauvegarde l'état actuel dans la pile undo
   * @param {Uint8Array} state - État des murs à sauvegarder
   */
  push(state) {
    this.undoStack.push(new Uint8Array(state));
    if (this.undoStack.length > MAX_UNDO) {
      this.undoStack.shift();
    }
    // Effacer la pile redo quand on fait une nouvelle action
    this.redoStack = [];
  }

  /**
   * Annule la dernière action
   * @param {Uint8Array} currentState - État actuel des murs
   * @returns {Uint8Array|null} L'état précédent, ou null si pas d'undo possible
   */
  undo(currentState) {
    if (this.undoStack.length === 0) return null;
    this.redoStack.push(new Uint8Array(currentState));
    return this.undoStack.pop();
  }

  /**
   * Refait la dernière action annulée
   * @param {Uint8Array} currentState - État actuel des murs
   * @returns {Uint8Array|null} L'état suivant, ou null si pas de redo possible
   */
  redo(currentState) {
    if (this.redoStack.length === 0) return null;
    this.undoStack.push(new Uint8Array(currentState));
    return this.redoStack.pop();
  }

  /**
   * Réinitialise les deux piles
   */
  reset() {
    this.undoStack = [];
    this.redoStack = [];
  }

  get canUndo() {
    return this.undoStack.length > 0;
  }

  get canRedo() {
    return this.redoStack.length > 0;
  }
}
