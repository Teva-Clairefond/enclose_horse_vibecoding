// ─── Scoring Tests ───
import { describe, it, expect } from 'vitest';
import { calculateScore } from '../../src/engine/Scoring.js';

describe('Scoring', () => {
  it('should return 0 for escaped horse', () => {
    const result = calculateScore({
      escaped: true,
      visited: new Set(),
      escapePath: [0, 1, 2],
      score: 0,
    });

    expect(result.total).toBe(0);
    expect(result.escaped).toBe(true);
    expect(result.area).toBe(0);
  });

  it('should calculate area-only score correctly', () => {
    const result = calculateScore({
      escaped: false,
      visited: new Set([1, 2, 3, 4, 5]),
      area: 5,
      cherryCount: 0,
      gemCount: 0,
      skullCount: 0,
      score: 5,
    });

    expect(result.total).toBe(5);
    expect(result.area).toBe(5);
    expect(result.cherryBonus).toBe(0);
    expect(result.gemBonus).toBe(0);
    expect(result.skullPenalty).toBe(0);
  });

  it('should add cherry bonus (+3 per cherry)', () => {
    const result = calculateScore({
      escaped: false,
      visited: new Set([1, 2, 3]),
      area: 3,
      cherryCount: 2,
      gemCount: 0,
      skullCount: 0,
      score: 9,
    });

    expect(result.total).toBe(9); // 3 + 2*3
    expect(result.cherryBonus).toBe(6);
  });

  it('should add gem bonus (+10 per gem)', () => {
    const result = calculateScore({
      escaped: false,
      visited: new Set([1, 2, 3, 4]),
      area: 4,
      cherryCount: 0,
      gemCount: 1,
      skullCount: 0,
      score: 14,
    });

    expect(result.total).toBe(14); // 4 + 1*10
    expect(result.gemBonus).toBe(10);
  });

  it('should subtract skull penalty (-5 per skull)', () => {
    const result = calculateScore({
      escaped: false,
      visited: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      area: 10,
      cherryCount: 0,
      gemCount: 0,
      skullCount: 1,
      score: 5,
    });

    expect(result.total).toBe(5); // 10 - 1*5
    expect(result.skullPenalty).toBe(5);
  });

  it('should combine all bonuses and penalties', () => {
    const result = calculateScore({
      escaped: false,
      visited: new Set(Array.from({ length: 20 }, (_, i) => i)),
      area: 20,
      cherryCount: 3,
      gemCount: 1,
      skullCount: 2,
      score: 29,
    });

    // 20 + 3*3 + 1*10 - 2*5 = 20 + 9 + 10 - 10 = 29
    expect(result.total).toBe(29);
  });

  it('should not go below 0', () => {
    const result = calculateScore({
      escaped: false,
      visited: new Set([1]),
      area: 1,
      cherryCount: 0,
      gemCount: 0,
      skullCount: 5,
      score: 0,
    });

    // 1 - 5*5 = -24 → clamped to 0
    expect(result.total).toBe(0);
  });
});
