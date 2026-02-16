// ─── Scoring ───
// Calcul des scores à partir des résultats du BFS

import { CHERRY_BONUS, GEM_BONUS } from '../utils/constants.js';

/**
 * Calcule le score détaillé à partir du résultat BFS
 * @param {Object} bfsResult - Résultat de solveBFS
 * @returns {Object} Score détaillé
 */
export function calculateScore(bfsResult) {
  if (bfsResult.escaped) {
    return {
      total: 0,
      area: 0,
      cherryBonus: 0,
      gemBonus: 0,
      escaped: true,
    };
  }

  const area = bfsResult.area || bfsResult.visited.size;
  const cherryBonus = (bfsResult.cherryCount || 0) * CHERRY_BONUS;
  const gemBonus = (bfsResult.gemCount || 0) * GEM_BONUS;

  const total = Math.max(0, area + cherryBonus + gemBonus);

  return {
    total,
    area,
    cherryBonus,
    gemBonus,
    escaped: false,
  };
}
