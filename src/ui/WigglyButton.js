// ─── Wiggly Button ───
// Boutons dessinés sur canvas avec polygone wiggly animé

import { wigglyPolygon, drawWigglyPolygon, wiggle } from '../utils/wiggly.js';

export class WigglyButton {
  constructor(container, text, seed, onClick, options = {}) {
    this.text = text;
    this.seed = seed;
    this.onClick = onClick;
    this.pressed = false;
    this.hovered = false;

    const {
      width = 140,
      height = 44,
      fillColor = '#2a9d5c',
      strokeColor = '#186b3b',
      textColor = '#ffffff',
      fontSize = 18,
    } = options;

    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.textColor = textColor;
    this.fontSize = fontSize;

    // Créer le canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = width + 16;
    this.canvas.height = height + 16;
    this.canvas.style.cursor = 'pointer';
    this.canvas.classList.add('wiggly-button');
    this.ctx = this.canvas.getContext('2d');

    // Events
    this.canvas.addEventListener('mouseenter', () => {
      this.hovered = true;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.hovered = false;
      this.pressed = false;
    });
    this.canvas.addEventListener('mousedown', () => {
      this.pressed = true;
    });
    this.canvas.addEventListener('mouseup', () => {
      this.pressed = false;
      if (this.onClick) this.onClick();
    });

    container.appendChild(this.canvas);
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const ox = 8;
    const oy = 8;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Intensité du jitter
    const intensity = this.pressed ? 5 : this.hovered ? 2 : 1;

    // Polygone wiggly
    const points = wigglyPolygon(w, h, 12, this.seed, 2 * intensity);
    const offsetPoints = points.map((p) => ({ x: p.x + ox, y: p.y + oy }));

    // Ombre
    const shadowPoints = offsetPoints.map((p) => ({ x: p.x + 2, y: p.y + 2 }));
    drawWigglyPolygon(ctx, shadowPoints, 'rgba(0,0,0,0.2)', null);

    // Bouton
    drawWigglyPolygon(ctx, offsetPoints, this.fillColor, this.strokeColor, 2);

    // Texte
    ctx.fillStyle = this.textColor;
    ctx.font = `${this.fontSize}px 'Schoolbell', cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tx = ox + w / 2 + wiggle(this.seed + 10) * intensity;
    const ty = oy + h / 2 + wiggle(this.seed + 11) * intensity;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate((wiggle(this.seed + 12) * intensity * Math.PI) / 180);
    ctx.fillText(this.text, 0, 0);
    ctx.restore();
  }

  setText(text) {
    this.text = text;
  }

  setEnabled(enabled) {
    this.canvas.style.opacity = enabled ? '1' : '0.5';
    this.canvas.style.pointerEvents = enabled ? 'auto' : 'none';
  }
}
