// ─── Map Parser ───
// Parse les chaînes de caractères représentant les niveaux

import { TERRAIN } from '../utils/constants.js';

/**
 * Caractères spéciaux dans le format de map
 */
const CHAR_MAP = {
  '.': 'grass',
  '~': 'water',
  H: 'horse',
  C: 'cherry',
  G: 'gem',
};

/**
 * Parse une chaîne de carte en données de niveau structurées
 * @param {string} mapString - La carte sous forme de chaîne (lignes séparées par \n)
 * @returns {Object} Données de niveau parsées
 */
export function parseMap(mapString) {
  const lines = mapString
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const rows = lines.length;
  const cols = lines[0].length;
  const totalCells = rows * cols;

  const terrain = new Uint8Array(totalCells); // 0 = grass, 1 = water
  const walls = new Uint8Array(totalCells); // 0 = no wall, 1 = wall
  const cherries = new Uint8Array(totalCells);
  const gems = new Uint8Array(totalCells);
  const portals = new Int8Array(totalCells).fill(-1); // -1 = no portal

  let playerIdx = -1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const ch = lines[r][c];

      if (ch === '~') {
        terrain[idx] = TERRAIN.WATER;
      } else if (ch === 'H') {
        terrain[idx] = TERRAIN.GRASS;
        playerIdx = idx;
      } else if (ch === 'C') {
        terrain[idx] = TERRAIN.GRASS;
        cherries[idx] = 1;
      } else if (ch === 'G') {
        terrain[idx] = TERRAIN.GRASS;
        gems[idx] = 1;
      } else if (/[0-9]/.test(ch)) {
        terrain[idx] = TERRAIN.GRASS;
        portals[idx] = parseInt(ch, 10);
      } else if (/[a-z]/.test(ch)) {
        terrain[idx] = TERRAIN.GRASS;
        portals[idx] = ch.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
      } else {
        // '.' ou tout autre caractère → herbe
        terrain[idx] = TERRAIN.GRASS;
      }
    }
  }

  return {
    rows,
    cols,
    terrain,
    walls,
    cherries,
    gems,
    portals,
    playerIdx,
  };
}

/**
 * Convertit un index linéaire en coordonnées (row, col)
 */
export function idxToPos(idx, cols) {
  return {
    row: Math.floor(idx / cols),
    col: idx % cols,
  };
}

/**
 * Convertit des coordonnées (row, col) en index linéaire
 */
export function posToIdx(row, col, cols) {
  return row * cols + col;
}
