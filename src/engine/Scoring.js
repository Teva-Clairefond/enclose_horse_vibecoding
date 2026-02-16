// ─── Scoring ───
// Calcul des scores à partir des résultats du BFS

import { CHERRY_BONUS, GEM_BONUS, SKULL_PENALTY } from '../utils/constants.js';

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
      skullPenalty: 0,
      escaped: true,
    };
  }

  const area = bfsResult.area || bfsResult.visited.size;
  const cherryBonus = (bfsResult.cherryCount || 0) * CHERRY_BONUS;
  const gemBonus = (bfsResult.gemCount || 0) * GEM_BONUS;
  const skullPenalty = (bfsResult.skullCount || 0) * SKULL_PENALTY;

  const total = Math.max(0, area + cherryBonus + gemBonus - skullPenalty);

  return {
    total,
    area,
    cherryBonus,
    gemBonus,
    skullPenalty,
    escaped: false,
  };
}
