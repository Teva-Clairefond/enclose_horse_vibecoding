// ─── BFS Pathfinding ───
// Algorithme de recherche en largeur pour déterminer si le cheval peut s'échapper

import { TERRAIN, DIRECTIONS } from '../utils/constants.js';
import { idxToPos, posToIdx } from '../levels/MapParser.js';

/**
 * Exécute un BFS depuis la position du cheval pour déterminer :
 * 1. Si le cheval peut s'échapper (atteindre un bord)
 * 2. La zone enclose (cellules visitées si pas d'échappement)
 * 3. Le chemin d'échappement (si échappement)
 *
 * @param {Object} level - Données du niveau
 * @param {Uint8Array} playerWalls - Murs placés par le joueur
 * @returns {Object} Résultat du BFS
 */
export function solveBFS(level, playerWalls) {
  const { rows, cols, terrain, cherries, gems, skulls, portals, playerIdx } = level;

  if (playerIdx < 0) {
    return { escaped: true, visited: new Set(), escapePath: [], score: 0 };
  }

  const visited = new Set();
  const parent = new Map();
  const queue = [playerIdx];
  visited.add(playerIdx);
  parent.set(playerIdx, -1);

  let escapeBorderIdx = -1;

  while (queue.length > 0) {
    const current = queue.shift();
    const { row, col } = idxToPos(current, cols);

    // Vérifier si on est au bord → échappement
    if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
      escapeBorderIdx = current;
      break;
    }

    // Explorer les 4 directions
    for (const [dr, dc] of DIRECTIONS) {
      const nr = row + dr;
      const nc = col + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      const nIdx = posToIdx(nr, nc, cols);

      if (visited.has(nIdx)) continue;
      if (terrain[nIdx] === TERRAIN.WATER) continue;
      if (playerWalls[nIdx]) continue;

      visited.add(nIdx);
      parent.set(nIdx, current);
      queue.push(nIdx);
    }

    // Vérifier les portails — si la case courante est un portail,
    // on peut se téléporter vers toutes les autres cases du même canal
    if (portals[current] >= 0) {
      const channel = portals[current];
      for (let i = 0; i < rows * cols; i++) {
        if (i === current) continue;
        if (portals[i] !== channel) continue;
        if (visited.has(i)) continue;
        if (terrain[i] === TERRAIN.WATER) continue;
        if (playerWalls[i]) continue;

        visited.add(i);
        parent.set(i, current);
        queue.push(i);
      }
    }
  }

  // Si le cheval s'échappe
  if (escapeBorderIdx >= 0) {
    const escapePath = reconstructPath(parent, escapeBorderIdx);
    return {
      escaped: true,
      visited,
      escapePath,
      score: 0,
    };
  }

  // Le cheval est enclos — calculer le score
  let cherryCount = 0;
  let gemCount = 0;
  let skullCount = 0;

  for (const idx of visited) {
    if (cherries[idx]) cherryCount++;
    if (gems[idx]) gemCount++;
    if (skulls[idx]) skullCount++;
  }

  const area = visited.size;
  const score = area + cherryCount * 3 + gemCount * 10 - skullCount * 5;

  return {
    escaped: false,
    visited,
    escapePath: [],
    score: Math.max(0, score),
    area,
    cherryCount,
    gemCount,
    skullCount,
  };
}

/**
 * Reconstruit le chemin depuis la map parent
 */
function reconstructPath(parent, target) {
  const path = [];
  let current = target;
  while (current !== -1) {
    path.unshift(current);
    current = parent.get(current);
  }
  return path;
}

/**
 * Variante du BFS qui retourne les niveaux de distance (pour l'animation wheat)
 * @returns {Map<number, number>} idx → distance depuis le cheval
 */
export function bfsDistances(level, playerWalls) {
  const { rows, cols, terrain, portals, playerIdx } = level;
  const distances = new Map();
  const queue = [[playerIdx, 0]];
  distances.set(playerIdx, 0);

  while (queue.length > 0) {
    const [current, dist] = queue.shift();
    const { row, col } = idxToPos(current, cols);

    // Si au bord → arrêter (le cheval s'échappe)
    if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
      return null; // Pas d'enclos
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      const nIdx = posToIdx(nr, nc, cols);
      if (distances.has(nIdx)) continue;
      if (terrain[nIdx] === TERRAIN.WATER) continue;
      if (playerWalls[nIdx]) continue;

      distances.set(nIdx, dist + 1);
      queue.push([nIdx, dist + 1]);
    }

    // Portails
    if (portals[current] >= 0) {
      const channel = portals[current];
      for (let i = 0; i < rows * cols; i++) {
        if (i === current || portals[i] !== channel) continue;
        if (distances.has(i)) continue;
        if (terrain[i] === TERRAIN.WATER) continue;
        if (playerWalls[i]) continue;

        distances.set(i, dist + 1);
        queue.push([i, dist + 1]);
      }
    }
  }

  return distances;
}
