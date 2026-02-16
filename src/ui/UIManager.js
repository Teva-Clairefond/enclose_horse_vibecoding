// ─── UI Manager ───
// Gestion globale de l'interface : stats, boutons, layout

import { Navbar } from './Navbar.js';
import { WigglyButton } from './WigglyButton.js';
import { HelpModal } from './HelpModal.js';
import { ThoughtBubble } from './ThoughtBubble.js';
import { WigglyModal } from './WigglyModal.js';
import { applyWiggle } from '../utils/wiggly.js';

export class UIManager {
  constructor(gameEngine, renderer, levelManager, storage, onUpdate) {
    this.engine = gameEngine;
    this.renderer = renderer;
    this.levelManager = levelManager;
    this.storage = storage;
    this.onUpdate = onUpdate;

    // Stats display
    this.wallsEl = document.getElementById('wallsCount');
    this.wallsBudgetEl = document.getElementById('wallsBudget');
    this.scoreEl = document.getElementById('scoreValue');

    // Navbar
    this.navbar = new Navbar(
      () => this.helpModal.show(),
      () => this._showLevelSelect(),
    );

    // Help modal
    this.helpModal = new HelpModal();

    // Thought bubble
    this.thoughtBubble = new ThoughtBubble();
    document.getElementById('gameContainer').appendChild(this.thoughtBubble.canvas);

    // Level select modal
    this.levelSelectModal = new WigglyModal({
      title: 'Select Level',
      seed: 99,
    });

    // Result modal
    this.resultModal = new WigglyModal({
      title: 'Results',
      seed: 55,
    });

    // Boutons
    this._createButtons();

    // Level nav
    this.prevBtn = document.getElementById('prevLevel');
    this.nextBtn = document.getElementById('nextLevel');

    this.prevBtn.addEventListener('click', () => {
      if (this.levelManager.prevLevel()) {
        this._loadCurrentLevel();
      }
    });

    this.nextBtn.addEventListener('click', () => {
      if (this.levelManager.nextLevel()) {
        this._loadCurrentLevel();
      }
    });
  }

  _createButtons() {
    const btnContainer = document.getElementById('buttons');

    this.resetBtn = new WigglyButton(btnContainer, 'Reset', 200, () => {
      this.engine.reset();
      this.renderer.animations.stopWheat();
      this.onUpdate();
    }, {
      width: 110,
      height: 40,
      fillColor: '#888',
      strokeColor: '#555',
    });

    this.submitBtn = new WigglyButton(btnContainer, 'Submit', 300, () => {
      this._submit();
    }, {
      width: 130,
      height: 44,
      fillColor: '#d4a017',
      strokeColor: '#a07c14',
    });
  }

  _submit() {
    const result = this.engine.submit();
    if (!result) return;

    const levelInfo = this.levelManager.getCurrentLevelInfo();

    // Sauvegarder
    const wallIndices = [];
    for (let i = 0; i < this.engine.playerWalls.length; i++) {
      if (this.engine.playerWalls[i]) wallIndices.push(i);
    }
    this.storage.saveSubmission(levelInfo.id, wallIndices, result.total);

    // Animation wheat si enclos
    if (!result.escaped) {
      const distances = this.engine.getDistances();
      this.renderer.animations.startWheatAnimation(distances);
    }

    // Afficher les résultats
    this._showResults(result, levelInfo);

    this.onUpdate();
  }

  _showResults(result, levelInfo) {
    let html;
    if (result.escaped) {
      html = `
        <p class="result-escaped">The horse escaped! 🐴💨</p>
        <p>Score: <strong>0</strong></p>
      `;
    } else {
      html = `
        <p class="result-enclosed">Horse enclosed! 🎉</p>
        <div class="result-breakdown">
          <p>Area: <strong>${result.area}</strong></p>
          ${result.cherryBonus ? `<p>Cherries: <strong>+${result.cherryBonus}</strong></p>` : ''}
          ${result.gemBonus ? `<p>Golden Apples: <strong>+${result.gemBonus}</strong></p>` : ''}
          ${result.skullPenalty ? `<p>Bees: <strong>-${result.skullPenalty}</strong></p>` : ''}
          <hr>
          <p class="result-total">Total Score: <strong>${result.total}</strong></p>
          ${levelInfo.optimalScore ? `<p class="result-optimal">Optimal: ${levelInfo.optimalScore}</p>` : ''}
        </div>
      `;
    }

    this.resultModal.setContent('Results', html);
    this.resultModal.show();
  }

  _showLevelSelect() {
    let html = '<div class="level-grid">';
    for (let i = 0; i < this.levelManager.count; i++) {
      const level = this.levelManager.levels[i];
      const sub = this.storage.getSubmission(level.id);
      const active = i === this.levelManager.currentIndex ? 'active' : '';
      const completed = sub ? 'completed' : '';

      html += `
        <div class="level-item ${active} ${completed}" data-index="${i}">
          <div class="level-day">Day ${level.dayNumber}</div>
          <div class="level-name">${level.name}</div>
          ${sub ? `<div class="level-score">Score: ${sub.score}</div>` : ''}
        </div>
      `;
    }
    html += '</div>';

    this.levelSelectModal.setContent('Select Level', html);
    this.levelSelectModal.show();

    // Bind click events
    setTimeout(() => {
      document.querySelectorAll('.level-item').forEach((el) => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.index);
          if (this.levelManager.goToLevel(idx)) {
            this._loadCurrentLevel();
            this.levelSelectModal.hide();
          }
        });
      });
    }, 50);
  }

  _loadCurrentLevel() {
    const { levelData, wallBudget, name, dayNumber } = this.levelManager.loadCurrentLevel();
    this.engine.loadLevel(levelData, wallBudget);
    this.navbar.setLevel(dayNumber, name);
    this.renderer.resize(levelData.rows, levelData.cols);
    this.renderer.animations.stopWheat();

    // Update nav buttons
    this.prevBtn.disabled = this.levelManager.currentIndex === 0;
    this.nextBtn.disabled = this.levelManager.currentIndex === this.levelManager.count - 1;

    this.onUpdate();
  }

  /**
   * Met à jour l'affichage UI (stats, boutons)
   */
  updateStats() {
    const state = this.engine.getState();

    this.wallsEl.textContent = state.wallsPlaced;
    this.wallsBudgetEl.textContent = state.wallBudget;

    if (state.scoreResult) {
      if (state.scoreResult.escaped) {
        this.scoreEl.textContent = 'N/A';
        this.scoreEl.classList.add('escaped');
        this.scoreEl.classList.remove('enclosed');
      } else {
        this.scoreEl.textContent = state.scoreResult.total;
        this.scoreEl.classList.add('enclosed');
        this.scoreEl.classList.remove('escaped');
      }
    }

    this.submitBtn.setEnabled(!state.submitted);
    this.resetBtn.setEnabled(!state.submitted && state.wallsPlaced > 0);

    // Wiggly sur les stats
    applyWiggle(document.getElementById('stats'), 500, 0.5);
  }

  /**
   * Gère le hover/clic sur le cheval (bulle de pensée)
   */
  handleHorseInteraction(x, y) {
    const state = this.engine.getState();
    if (!state.bfsResult) return;

    const enclosed = !state.bfsResult.escaped;
    const hasGem = state.bfsResult.gemCount > 0;
    const hasSkull = state.bfsResult.skullCount > 0;

    this.thoughtBubble.position(x, y);
    this.thoughtBubble.show(enclosed, hasGem, hasSkull);
  }

  hideThoughtBubble() {
    this.thoughtBubble.hide();
  }

  /**
   * Frame d'animation pour les éléments UI
   */
  renderFrame(now) {
    this.navbar.render();
    this.resetBtn.render();
    this.submitBtn.render();
    this.thoughtBubble.render(now);
    this.helpModal.renderFrame();
    this.resultModal.renderFrame();
    this.levelSelectModal.renderFrame();
  }

  /**
   * Charge le premier niveau
   */
  init() {
    this._loadCurrentLevel();
  }
}
