// ─── Storage Manager ───
// Persistance localStorage : soumissions, joueur, préférences

const STORAGE_KEY = 'enclose_clone_data';

export class StorageManager {
  constructor() {
    this.data = this._load();
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to load from localStorage', e);
    }
    return {
      playerId: this._generateId(),
      playerName: 'Player',
      submissions: {},
      theme: 'default',
    };
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  _generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  get playerId() {
    return this.data.playerId;
  }

  get playerName() {
    return this.data.playerName;
  }

  set playerName(name) {
    this.data.playerName = name;
    this._save();
  }

  /**
   * Enregistre une soumission pour un niveau
   */
  saveSubmission(levelId, wallIndices, score) {
    this.data.submissions[levelId] = {
      walls: wallIndices,
      score,
      timestamp: Date.now(),
    };
    this._save();
  }

  /**
   * Récupère la soumission d'un niveau
   */
  getSubmission(levelId) {
    return this.data.submissions[levelId] || null;
  }

  /**
   * Vérifie si un niveau a déjà été soumis
   */
  hasSubmitted(levelId) {
    return !!this.data.submissions[levelId];
  }

  /**
   * Retourne le meilleur score pour un niveau
   */
  getBestScore(levelId) {
    const sub = this.data.submissions[levelId];
    return sub ? sub.score : null;
  }

  get theme() {
    return this.data.theme || 'default';
  }

  set theme(t) {
    this.data.theme = t;
    this._save();
  }
}
