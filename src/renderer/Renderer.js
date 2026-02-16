// ─── Renderer ───
// Rendu principal de la grille de jeu sur canvas

import { TILE_SIZE, SCALE, TERRAIN } from '../utils/constants.js';
import { COLORS, getPortalColor } from '../utils/colors.js';
import { wiggle, getAnimFrame } from '../utils/wiggly.js';
import { SpriteSheet } from './SpriteSheet.js';
import { AnimationSystem } from './Animations.js';
import { idxToPos } from '../levels/MapParser.js';

const S = TILE_SIZE * SCALE; // Taille de tuile à l'écran (48px)

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.spriteSheet = new SpriteSheet();
    this.animations = new AnimationSystem();

    this.hoveredIdx = -1;
    this.hoveredIsHorse = false;

    // Cache pour les grass tiles
    this._grassCache = new Map();
  }

  /**
   * Redimensionne le canvas pour la grille
   */
  resize(rows, cols) {
    this.canvas.width = cols * S;
    this.canvas.height = rows * S;
    this.canvas.style.width = cols * S + 'px';
    this.canvas.style.height = rows * S + 'px';
  }

  /**
   * Rendu complet de la grille
   */
  render(gameState) {
    const { level, playerWalls, bfsResult, scoreResult } = gameState;
    if (!level) return;

    const { rows, cols, terrain, cherries, gems, portals, playerIdx } = level;
    const ctx = this.ctx;
    const now = performance.now();

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Rendu des tuiles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const x = c * S;
        const y = r * S;

        // 1. Herbe de fond (toutes les cases sauf eau)
        if (terrain[idx] === TERRAIN.GRASS) {
          this._drawGrass(ctx, x, y, idx);
        } else {
          this._drawWater(ctx, x, y, idx, terrain, rows, cols);
        }

        // 2. Wheat animation (si enclosé après soumission)
        if (
          this.animations.wheatAnimating &&
          bfsResult &&
          !bfsResult.escaped &&
          terrain[idx] === TERRAIN.GRASS
        ) {
          const stage = this.animations.getWheatStage(idx, now);
          if (stage >= 0) {
            this._drawWheat(ctx, x, y, stage);
          }
        }

        // 3. Cerises
        if (cherries[idx]) {
          this._drawSprite(ctx, x, y, 'cherry');
        }

        // 5. Gemmes
        if (gems[idx]) {
          this._drawSprite(ctx, x, y, 'gem');
        }

        // 6. Murs du joueur
        if (playerWalls[idx]) {
          this._drawWall(ctx, x, y, idx);
        }

        // 7. Hover highlight
        if (idx === this.hoveredIdx && terrain[idx] === TERRAIN.GRASS && !playerWalls[idx]) {
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(x, y, S, S);
        }
      }
    }

    // 8. Le cheval (rendu en dernier pour être au-dessus)
    if (playerIdx >= 0) {
      const hr = Math.floor(playerIdx / cols);
      const hc = playerIdx % cols;
      this._drawHorse(ctx, hc * S, hr * S, playerIdx);
    }

    // 9. Chemin d'échappement (si le cheval s'échappe)
    // Pas de chemin d'échappement affiché
  }

  _drawGrass(ctx, x, y, seed) {
    // Dessiner le sprite d'herbe scalé
    const variant = (seed * 7 + seed * 13) % 3;
    const spriteName = ['grass1', 'grass2', 'grass3'][variant];
    const sprite = this.spriteSheet.getSprite(spriteName);

    ctx.drawImage(sprite, x, y, S, S);
  }

  _drawWater(ctx, x, y, idx, terrain, rows, cols) {
    // Eau de base
    const sprite = this.spriteSheet.getSprite('water');
    ctx.drawImage(sprite, x, y, S, S);

    // Bords adaptatifs avec les voisins
    const { row, col } = idxToPos(idx, cols);
    const isWater = (r, c) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
      return terrain[r * cols + c] === TERRAIN.WATER;
    };

    // Dessiner les bords vers les cases d'herbe adjacentes
    ctx.fillStyle = COLORS.waterEdge;

    if (!isWater(row - 1, col)) {
      // Bord haut
      ctx.fillRect(x, y, S, 2 * SCALE);
    }
    if (!isWater(row + 1, col)) {
      // Bord bas
      ctx.fillRect(x, y + S - 2 * SCALE, S, 2 * SCALE);
    }
    if (!isWater(row, col - 1)) {
      // Bord gauche
      ctx.fillRect(x, y, 2 * SCALE, S);
    }
    if (!isWater(row, col + 1)) {
      // Bord droit
      ctx.fillRect(x + S - 2 * SCALE, y, 2 * SCALE, S);
    }
  }

  _drawWall(ctx, x, y, seed) {
    const sprite = this.spriteSheet.getSprite('wall');
    // Le mur est plus haut que la tuile (effet 3D)
    const wallHeight = S * 1.5;
    const yOff = y - (wallHeight - S);

    // Légère variation wiggly
    const jx = wiggle(seed) * 1;
    const jy = wiggle(seed + 0.5) * 0.5;

    ctx.drawImage(sprite, x + jx, yOff + jy, S, wallHeight);
  }

  _drawHorse(ctx, x, y, seed) {
    const sprite = this.spriteSheet.getSprite('horse');

    // Jitter du cheval (animation idle)
    const jx = wiggle(seed * 3.7) * 2;
    const jy = wiggle(seed * 3.7 + 50) * 1;

    ctx.drawImage(sprite, x + jx, y + jy, S, S);
  }

  _drawPortal(ctx, x, y, channel, seed) {
    const color = getPortalColor(channel);
    const cx = x + S / 2;
    const cy = y + S / 2;
    const r = S * 0.35;

    // Effet de pulsation
    const frame = getAnimFrame();
    const pulse = 1 + Math.sin(frame * 0.5 + seed) * 0.1;

    // Glow
    ctx.beginPath();
    ctx.arc(cx, cy, r * pulse * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = getPortalColor(channel, 60, 70);
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Cercle principal
    ctx.beginPath();
    ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Cercle intérieur clair
    ctx.beginPath();
    ctx.arc(cx, cy, r * pulse * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = getPortalColor(channel, 80, 80);
    ctx.fill();

    // Particules
    for (let i = 0; i < 3; i++) {
      const angle = (frame * 0.3 + i * 2.094) + seed;
      const pr = r * 1.5;
      const px = cx + Math.cos(angle) * pr;
      const py = cy + Math.sin(angle) * pr;

      ctx.beginPath();
      ctx.arc(px, py, 2 * SCALE, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  _drawSprite(ctx, x, y, name) {
    const sprite = this.spriteSheet.getSprite(name);
    ctx.drawImage(sprite, x, y, S, S);
  }

  _drawWheat(ctx, x, y, stage) {
    const spriteName = `wheat${stage + 1}`;
    const sprite = this.spriteSheet.getSprite(spriteName);
    ctx.drawImage(sprite, x, y, S, S);
  }

  _drawEscapePath(ctx, path, cols) {
    if (path.length < 2) return;

    ctx.save();
    ctx.strokeStyle = COLORS.escapePath;
    ctx.lineWidth = 3 * SCALE;

    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
      const { row, col } = idxToPos(path[i], cols);
      const x = col * S + S / 2;
      const y = row * S + S / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Pas de flèche (supprimée)

    ctx.restore();
  }

  /**
   * Convertit des coordonnées pixel (écran) en index de cellule
   */
  pixelToCell(px, py, cols, rows) {
    const rect = this.canvas.getBoundingClientRect();
    const x = px - rect.left;
    const y = py - rect.top;

    const col = Math.floor(x / S);
    const row = Math.floor(y / S);

    if (col < 0 || col >= cols || row < 0 || row >= rows) return -1;
    return row * cols + col;
  }
}
