// ─── Thought Bubble ───
// Bulle de pensée du cheval avec texte lettre par lettre et bords organiques

import { wiggle, getAnimFrame } from '../utils/wiggly.js';

// Messages du cheval
const MESSAGES_FREE = [
  'Horses should be able to vote.',
  'I want nothing more than to escape...',
  'Freedom is just a wall away.',
  "You can't cage the wind!",
  'Neighhh! Let me out!',
  "I'm too beautiful to be enclosed.",
  'Running free is my destiny.',
  'One day I will gallop into the sunset.',
];

const MESSAGES_ENCLOSED = [
  'I find it all rather Kafkaesque.',
  'tfw no horse gf',
  'The Demon God of this world saw fit to mock me with this forced smile.',
  'This is fine. Everything is fine.',
  "At least it's cozy in here.",
  "I've accepted my fate.",
  'Is this what they call stable housing?',
  'Neigh. Just... neigh.',
];

const MESSAGES_WITH_GEM = ['At least there\'s a golden apple in here.'];

const MESSAGES_WITH_SKULL = ['WHY ARE THERE BEES IN HERE WITH ME?'];

export class ThoughtBubble {
  constructor() {
    this.visible = false;
    this.text = '';
    this.displayedChars = 0;
    this.startTime = 0;
    this.charDelay = 40; // ms par caractère

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'thought-bubble';
    this.canvas.style.display = 'none';
    this.ctx = this.canvas.getContext('2d');

    this.msgIndex = 0;
  }

  /**
   * Affiche une bulle de pensée
   * @param {boolean} enclosed - Le cheval est-il enclos ?
   * @param {boolean} hasGem - Y a-t-il une gemme dans l'enclos ?
   * @param {boolean} hasSkull - Y a-t-il un crâne dans l'enclos ?
   */
  show(enclosed, hasGem = false, hasSkull = false) {
    let messages;
    if (enclosed) {
      if (hasSkull) messages = MESSAGES_WITH_SKULL;
      else if (hasGem) messages = MESSAGES_WITH_GEM;
      else messages = MESSAGES_ENCLOSED;
    } else {
      messages = MESSAGES_FREE;
    }

    this.text = messages[this.msgIndex % messages.length];
    this.msgIndex++;
    this.displayedChars = 0;
    this.startTime = performance.now();
    this.visible = true;
    this.canvas.style.display = 'block';

    this._resize();
  }

  hide() {
    this.visible = false;
    this.canvas.style.display = 'none';
  }

  _resize() {
    this.canvas.width = 300;
    this.canvas.height = 80;
    this.canvas.style.width = '300px';
    this.canvas.style.height = '80px';
  }

  /**
   * Positionne la bulle au-dessus du cheval
   * @param {number} x - Position X du cheval (écran)
   * @param {number} y - Position Y du cheval (écran)
   */
  position(x, y) {
    this.canvas.style.left = (x - 120) + 'px';
    this.canvas.style.top = (y - 90) + 'px';
  }

  render(now) {
    if (!this.visible) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const seed = 77;

    ctx.clearRect(0, 0, w, h);

    // Dessiner la bulle de pensée avec des bords organiques
    ctx.beginPath();
    const numPoints = 14;
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const angle = t * Math.PI * 2 - Math.PI / 2;

      const rx = (w - 40) / 2;
      const ry = (h - 30) / 2;

      const jitter = wiggle(seed + i * 0.2) * 3;
      const px = w / 2 + (rx + jitter) * Math.cos(angle);
      const py = h / 2 - 10 + (ry + jitter) * Math.sin(angle);

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.fillStyle = '#f5f0e1';
    ctx.fill();
    ctx.strokeStyle = '#186b3b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Petits cercles de "pensée"
    ctx.beginPath();
    ctx.arc(w / 2 + 10, h - 12, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(w / 2 + 20, h - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Texte lettre par lettre
    const elapsed = now - this.startTime;
    this.displayedChars = Math.min(this.text.length, Math.floor(elapsed / this.charDelay));

    const displayText = this.text.substring(0, this.displayedChars);

    ctx.fillStyle = '#333';
    ctx.font = "14px 'Schoolbell', cursive";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Chaque lettre avec une légère rotation
    const startX = w / 2 - (displayText.length * 7) / 2;
    for (let i = 0; i < displayText.length; i++) {
      const cx = startX + i * 7;
      const cy = h / 2 - 10;
      const rot = wiggle(seed + i * 0.3) * 3;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.fillText(displayText[i], 0, 0);
      ctx.restore();
    }
  }
}
