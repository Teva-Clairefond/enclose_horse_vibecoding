// ─── Background ───
// Canvas séparé pour le fond d'herbe tilé en plein écran

import { COLORS } from '../utils/colors.js';

export class Background {
  constructor() {
    this.canvas = document.getElementById('grassBg');
    this.ctx = this.canvas.getContext('2d');
    this.tilePattern = null;
    this._createPattern();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  _createPattern() {
    // Créer une tuile d'herbe 16x16
    const tile = document.createElement('canvas');
    tile.width = 16;
    tile.height = 16;
    const tCtx = tile.getContext('2d');

    // Couleur de fond
    tCtx.fillStyle = COLORS.grass1;
    tCtx.fillRect(0, 0, 16, 16);

    // Texture subtile
    const rng = this._seededRandom(42);
    for (let i = 0; i < 12; i++) {
      const x = Math.floor(rng() * 16);
      const y = Math.floor(rng() * 16);
      tCtx.fillStyle = rng() > 0.5 ? COLORS.grass2 : COLORS.grass3;
      tCtx.fillRect(x, y, 1, 1);
    }

    // Brins
    tCtx.fillStyle = '#4a8f32';
    for (let i = 0; i < 4; i++) {
      const x = Math.floor(rng() * 14) + 1;
      const y = Math.floor(rng() * 14) + 1;
      tCtx.fillRect(x, y, 1, 2);
    }

    this.tilePattern = this.ctx.createPattern(tile, 'repeat');
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.draw();
  }

  draw() {
    this.ctx.imageSmoothingEnabled = false;
    // Scale le pattern pour le pixel art
    this.ctx.save();
    this.ctx.scale(3, 3);
    this.ctx.fillStyle = this.tilePattern;
    this.ctx.fillRect(0, 0, this.canvas.width / 3, this.canvas.height / 3);
    this.ctx.restore();
  }

  _seededRandom(seed) {
    let s = seed * 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }
}
