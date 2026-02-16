// ─── MapParser Tests ───
import { describe, it, expect } from 'vitest';
import { parseMap, idxToPos, posToIdx } from '../../src/levels/MapParser.js';
import { TERRAIN } from '../../src/utils/constants.js';

describe('MapParser', () => {
  describe('parseMap', () => {
    it('should parse a simple grass map', () => {
      const map = '...\n...\n...';
      const result = parseMap(map);

      expect(result.rows).toBe(3);
      expect(result.cols).toBe(3);
      expect(result.terrain.length).toBe(9);
      expect(result.terrain.every((t) => t === TERRAIN.GRASS)).toBe(true);
      expect(result.playerIdx).toBe(-1);
    });

    it('should identify horse position', () => {
      const map = '...\n.H.\n...';
      const result = parseMap(map);

      expect(result.playerIdx).toBe(4); // center of 3x3
    });

    it('should identify water tiles', () => {
      const map = '.~.\n...\n.~.';
      const result = parseMap(map);

      expect(result.terrain[1]).toBe(TERRAIN.WATER);
      expect(result.terrain[7]).toBe(TERRAIN.WATER);
      expect(result.terrain[0]).toBe(TERRAIN.GRASS);
    });

    it('should identify cherries', () => {
      const map = 'C..\n...\n..C';
      const result = parseMap(map);

      expect(result.cherries[0]).toBe(1);
      expect(result.cherries[8]).toBe(1);
      expect(result.cherries[1]).toBe(0);
      // Cherries should be on grass
      expect(result.terrain[0]).toBe(TERRAIN.GRASS);
    });

    it('should identify gems', () => {
      const map = '.G.\n...\n...';
      const result = parseMap(map);

      expect(result.gems[1]).toBe(1);
      expect(result.terrain[1]).toBe(TERRAIN.GRASS);
    });

    it('should identify skulls', () => {
      const map = '..S\n...\n...';
      const result = parseMap(map);

      expect(result.skulls[2]).toBe(1);
      expect(result.terrain[2]).toBe(TERRAIN.GRASS);
    });

    it('should identify numeric portals (0-9)', () => {
      const map = '0..\n...\n..0';
      const result = parseMap(map);

      expect(result.portals[0]).toBe(0);
      expect(result.portals[8]).toBe(0);
      expect(result.portals[1]).toBe(-1); // No portal
    });

    it('should identify letter portals (a-z)', () => {
      const map = 'a..\n...\n..a';
      const result = parseMap(map);

      expect(result.portals[0]).toBe(10); // a = 10
      expect(result.portals[8]).toBe(10);
    });

    it('should handle mixed tile types', () => {
      const map = '.~C\nGHS\n0.1';
      const result = parseMap(map);

      expect(result.terrain[1]).toBe(TERRAIN.WATER);
      expect(result.cherries[2]).toBe(1);
      expect(result.gems[3]).toBe(1);
      expect(result.playerIdx).toBe(4);
      expect(result.skulls[5]).toBe(1);
      expect(result.portals[6]).toBe(0);
      expect(result.portals[8]).toBe(1);
    });

    it('should handle trailing whitespace/newlines', () => {
      const map = '  ...\n  ...\n  ...  \n';
      const result = parseMap(map);
      expect(result.rows).toBe(3);
      expect(result.cols).toBe(3);
    });
  });

  describe('idxToPos', () => {
    it('should convert linear index to row/col', () => {
      expect(idxToPos(0, 5)).toEqual({ row: 0, col: 0 });
      expect(idxToPos(4, 5)).toEqual({ row: 0, col: 4 });
      expect(idxToPos(5, 5)).toEqual({ row: 1, col: 0 });
      expect(idxToPos(7, 5)).toEqual({ row: 1, col: 2 });
    });
  });

  describe('posToIdx', () => {
    it('should convert row/col to linear index', () => {
      expect(posToIdx(0, 0, 5)).toBe(0);
      expect(posToIdx(0, 4, 5)).toBe(4);
      expect(posToIdx(1, 0, 5)).toBe(5);
      expect(posToIdx(1, 2, 5)).toBe(7);
    });

    it('should be inverse of idxToPos', () => {
      for (let idx = 0; idx < 25; idx++) {
        const { row, col } = idxToPos(idx, 5);
        expect(posToIdx(row, col, 5)).toBe(idx);
      }
    });
  });
});
