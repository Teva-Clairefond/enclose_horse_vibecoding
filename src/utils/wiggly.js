// ─── Fonctions wiggly / jitter ───
// Reproduit l'effet tremblotant caractéristique de enclose.horse

import { ANIMATION_FRAME_MS } from './constants.js';

/**
 * Retourne le numéro de frame d'animation courant (~3 FPS)
 */
export function getAnimFrame() {
  return Math.floor(performance.now() / ANIMATION_FRAME_MS);
}

/**
 * Génère un décalage pseudo-aléatoire entre -0.5 et 0.5
 * basé sur un seed et la frame courante.
 * C'est la fonction clé qui donne l'effet "wiggly" à tout le jeu.
 */
export function wiggle(seed) {
  const frame = getAnimFrame();
  const s = Math.sin(seed * 9999 + frame * 7777) * 10000;
  return s - Math.floor(s) - 0.5;
}

/**
 * Applique un transform wiggly (translate + rotate) à un élément DOM
 * @param {HTMLElement} el - L'élément à animer
 * @param {number} seed - Seed unique pour cet élément
 * @param {number} [intensity=1] - Multiplicateur d'intensité
 */
export function applyWiggle(el, seed, intensity = 1) {
  const dx = wiggle(seed) * 2 * intensity;
  const dy = wiggle(seed + 0.5) * 2 * intensity;
  const rot = wiggle(seed + 1) * 2 * intensity;
  el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
}

/**
 * Génère des points d'un polygone wiggly (pour boutons et modals)
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 * @param {number} numPoints - Nombre de points sur le périmètre
 * @param {number} seed - Seed pour le jitter
 * @param {number} [jitterAmount=3] - Amplitude du jitter en pixels
 * @returns {Array<{x: number, y: number}>}
 */
export function wigglyPolygon(width, height, numPoints, seed, jitterAmount = 3) {
  const points = [];
  const perimeter = 2 * (width + height);

  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints;
    const dist = t * perimeter;

    let x, y;
    if (dist < width) {
      x = dist;
      y = 0;
    } else if (dist < width + height) {
      x = width;
      y = dist - width;
    } else if (dist < 2 * width + height) {
      x = width - (dist - width - height);
      y = height;
    } else {
      x = 0;
      y = height - (dist - 2 * width - height);
    }

    const jx = wiggle(seed + i * 0.1) * jitterAmount;
    const jy = wiggle(seed + i * 0.1 + 0.5) * jitterAmount;

    points.push({ x: x + jx, y: y + jy });
  }

  return points;
}

/**
 * Dessine un polygone wiggly sur un canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<{x: number, y: number}>} points
 * @param {string} fillColor
 * @param {string} strokeColor
 * @param {number} [lineWidth=2]
 */
export function drawWigglyPolygon(ctx, points, fillColor, strokeColor, lineWidth = 2) {
  if (points.length < 3) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    const cpy = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
  }

  // Fermer le polygone
  const last = points[points.length - 1];
  const first = points[0];
  const cpx = (last.x + first.x) / 2;
  const cpy = (last.y + first.y) / 2;
  ctx.quadraticCurveTo(last.x, last.y, cpx, cpy);
  ctx.closePath();

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}
