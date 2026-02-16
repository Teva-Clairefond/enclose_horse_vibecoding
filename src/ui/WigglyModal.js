// ─── Wiggly Modal ───
// Modals avec fond canvas wiggly et bords organiques

import { wigglyPolygon, drawWigglyPolygon, wiggle } from '../utils/wiggly.js';

export class WigglyModal {
  constructor(options = {}) {
    const {
      title = '',
      content = '',
      seed = Math.random() * 1000,
      onClose = null,
    } = options;

    this.title = title;
    this.content = content;
    this.seed = seed;
    this.onClose = onClose;
    this.visible = false;

    this._createDOM();
  }

  _createDOM() {
    // Overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.style.display = 'none';

    // Container
    this.container = document.createElement('div');
    this.container.className = 'modal-container';

    // Canvas de fond
    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.className = 'modal-bg-canvas';
    this.container.appendChild(this.bgCanvas);

    // Contenu
    this.contentDiv = document.createElement('div');
    this.contentDiv.className = 'modal-content';
    this.container.appendChild(this.contentDiv);

    // Bouton fermer
    this.closeBtn = document.createElement('div');
    this.closeBtn.className = 'modal-close';
    this.closeBtn.textContent = '×';
    this.closeBtn.addEventListener('click', () => this.hide());
    this.container.appendChild(this.closeBtn);

    this.overlay.appendChild(this.container);
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.hide();
    });

    document.body.appendChild(this.overlay);
  }

  show() {
    this.visible = true;
    this.overlay.style.display = 'flex';
    this._updateContent();
    this._drawBackground();
  }

  hide() {
    this.visible = false;
    this.overlay.style.display = 'none';
    if (this.onClose) this.onClose();
  }

  setContent(title, html) {
    this.title = title;
    this.content = html;
    if (this.visible) this._updateContent();
  }

  _updateContent() {
    this.contentDiv.innerHTML = `
      <h2 class="modal-title">${this.title}</h2>
      <div class="modal-body">${this.content}</div>
    `;
  }

  _drawBackground() {
    const rect = this.container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    this.bgCanvas.width = w + 20;
    this.bgCanvas.height = h + 20;
    this.bgCanvas.style.width = (w + 20) + 'px';
    this.bgCanvas.style.height = (h + 20) + 'px';

    const ctx = this.bgCanvas.getContext('2d');

    // Polygone wiggly pour le fond
    const points = wigglyPolygon(w, h, 16, this.seed, 4);
    const offsetPoints = points.map((p) => ({ x: p.x + 10, y: p.y + 10 }));

    // Ombre
    const shadowPoints = offsetPoints.map((p) => ({ x: p.x + 3, y: p.y + 3 }));
    drawWigglyPolygon(ctx, shadowPoints, 'rgba(0,0,0,0.15)', null);

    // Fond
    drawWigglyPolygon(ctx, offsetPoints, '#f5f0e1', '#186b3b', 3);
  }

  renderFrame() {
    if (!this.visible) return;
    this._drawBackground();
  }
}
