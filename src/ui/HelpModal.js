// ─── Help Modal ───
// Modal d'aide avec les règles du jeu

import { WigglyModal } from './WigglyModal.js';

export class HelpModal extends WigglyModal {
  constructor() {
    super({
      title: 'How to Play This Level',
      seed: 42,
    });

    this.setContent(
      'How to Play This Level',
      `
      <p class="help-subtitle">Enclose the horse in the biggest possible pen!</p>
      
      <h3>THE RULES</h3>
      <ul class="help-rules">
        <li>Click grass tiles to place walls.</li>
        <li>You have limited walls.</li>
        <li>Horses can't move diagonally or over water.</li>
        <li>Enclosed cherries give +3!</li>
        <li>Enclosed golden apples give +10!</li>
        <li>Enclosed bees give -5!</li>
        <li>Portals connect distant cells - the horse can teleport through them!</li>
        <li>Bigger enclosure = bigger score, but you only have one chance to submit!</li>
      </ul>
      
      <p class="help-tip">💡 Tip: Hover or tap the horse to see how he'll escape!</p>
      
      <h3>KEYBOARD SHORTCUTS</h3>
      <ul class="help-rules">
        <li><strong>C</strong> — Reset all walls</li>
        <li><strong>Ctrl+Z</strong> — Undo</li>
        <li><strong>Ctrl+Shift+Z</strong> or <strong>Ctrl+Y</strong> — Redo</li>
      </ul>
    `,
    );
  }
}
