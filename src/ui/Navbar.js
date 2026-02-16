// ─── Navbar ───
// Barre de navigation avec titre wiggly et boutons

import { applyWiggle } from '../utils/wiggly.js';

export class Navbar {
  constructor(onHelp, onMenu) {
    this.onHelp = onHelp;
    this.onMenu = onMenu;

    this.container = document.getElementById('navbar');
    this.titleEl = document.getElementById('title');
    this.subtitleEl = document.getElementById('subtitle');
    this.helpBtn = document.getElementById('helpBtn');
    this.menuBtn = document.getElementById('menuBtn');

    this.helpBtn.addEventListener('click', () => {
      if (this.onHelp) this.onHelp();
    });

    this.menuBtn.addEventListener('click', () => {
      if (this.onMenu) this.onMenu();
    });

    this.seed = 123;
  }

  setLevel(dayNumber, name) {
    this.subtitleEl.textContent = `Day ${dayNumber} - ${name}`;
  }

  /**
   * Animation frame — applique le wiggle au titre
   */
  render() {
    applyWiggle(this.titleEl, this.seed, 0.8);

    // Wiggly chaque lettre du titre individuellement
    const letters = this.titleEl.querySelectorAll('.letter');
    letters.forEach((letter, i) => {
      applyWiggle(letter, this.seed + i * 0.3, 0.6);
    });
  }
}
