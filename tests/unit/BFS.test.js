// ─── BFS Tests ───
import { describe, it, expect } from 'vitest';
import { solveBFS, bfsDistances } from '../../src/engine/BFS.js';
import { parseMap } from '../../src/levels/MapParser.js';

describe('BFS Pathfinding', () => {
  describe('solveBFS', () => {
    it('should detect escape when horse can reach border', () => {
      const map = [
        '.....',
        '..H..',
        '.....',
        '.....',
        '.....',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);

      const result = solveBFS(level, walls);
      expect(result.escaped).toBe(true);
      expect(result.score).toBe(0);
      expect(result.escapePath.length).toBeGreaterThan(0);
    });

    it('should detect enclosure when horse is fully enclosed', () => {
      const map = [
        '.....',
        '.....',
        '..H..',
        '.....',
        '.....',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);

      // Place walls around the horse forming a complete enclosure
      //   row 1: cols 1,2,3
      //   row 2: cols 1 and 3
      //   row 3: cols 1,2,3
      const cols = level.cols;
      walls[1 * cols + 1] = 1; // (1,1)
      walls[1 * cols + 2] = 1; // (1,2)
      walls[1 * cols + 3] = 1; // (1,3)
      walls[2 * cols + 1] = 1; // (2,1)
      walls[2 * cols + 3] = 1; // (2,3)
      walls[3 * cols + 1] = 1; // (3,1)
      walls[3 * cols + 2] = 1; // (3,2)
      walls[3 * cols + 3] = 1; // (3,3)

      const result = solveBFS(level, walls);
      expect(result.escaped).toBe(false);
      expect(result.score).toBeGreaterThan(0);
      expect(result.visited.size).toBe(1); // Only the horse cell
    });

    it('should not allow diagonal movement', () => {
      // Horse at (1,1), walls blocking all 4 cardinal directions
      // but open diagonally
      const map = [
        '.....',
        '.H...',
        '.....',
        '.....',
        '.....',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);
      const cols = level.cols;

      // Block N, S, E, W from horse at (1,1)
      walls[0 * cols + 1] = 1; // (0,1) North
      walls[2 * cols + 1] = 1; // (2,1) South
      walls[1 * cols + 0] = 1; // (1,0) West
      walls[1 * cols + 2] = 1; // (1,2) East

      const result = solveBFS(level, walls);
      expect(result.escaped).toBe(false);
      // Horse can't move diagonally, so it's enclosed
      expect(result.visited.size).toBe(1);
    });

    it('should block movement through water', () => {
      const map = [
        '~~~~~',
        '~.H.~',
        '~...~',
        '~...~',
        '~~~~~',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);

      // Horse is surrounded by water — it IS enclosed because water blocks
      // BUT the visited cells reach the border row 1 col 0 which is water.
      // Actually water cells are not traversable, so BFS can't reach them.
      // The horse at (1,2) can move to (1,1), (1,3), (2,1), (2,2), (2,3), (3,1), (3,2), (3,3)
      // None of these are at the border? (1,1) — row=1, col=1 → not border
      // Wait: (1,1) row=1 which is not 0 or 4, col=1 which is not 0 or 4. 
      // So the horse IS enclosed by water!
      const result = solveBFS(level, walls);
      expect(result.escaped).toBe(false);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should handle portal teleportation', () => {
      // Horse is enclosed by water, but two portals connect inside to outside
      const map = [
        '~~~~~',
        '~.0.~',
        '~.H.~',
        '~...~',
        '~~0~~',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);

      // Without portals, horse would be enclosed (water surrounds it)
      // But portal 0 at (1,2) connects to portal 0 at (4,2) which is at the border
      // The horse can teleport out!
      const result = solveBFS(level, walls);
      // Horse reaches portal at (1,2), teleports to (4,2) which is row 4 (border)
      expect(result.escaped).toBe(true);
    });

    it('should count cherries in enclosed area', () => {
      const map = [
        '~~~~~',
        '~.C.~',
        '~.H.~',
        '~...~',
        '~~~~~',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);

      const result = solveBFS(level, walls);
      expect(result.escaped).toBe(false);
      expect(result.cherryCount).toBe(1);
    });

    it('should count gems in enclosed area', () => {
      const map = [
        '~~~~~',
        '~.G.~',
        '~.H.~',
        '~...~',
        '~~~~~',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);

      const result = solveBFS(level, walls);
      expect(result.escaped).toBe(false);
      expect(result.gemCount).toBe(1);
    });

    it('should count skulls in enclosed area', () => {
      const map = [
        '~~~~~',
        '~.S.~',
        '~.H.~',
        '~...~',
        '~~~~~',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);

      const result = solveBFS(level, walls);
      expect(result.escaped).toBe(false);
      expect(result.skullCount).toBe(1);
    });

    it('should return escaped with no player', () => {
      const map = [
        '.....',
        '.....',
        '.....',
      ].join('\n');
      // Manually create level without horse
      const level = parseMap(map);
      level.playerIdx = -1;
      const walls = new Uint8Array(level.rows * level.cols);

      const result = solveBFS(level, walls);
      expect(result.escaped).toBe(true);
    });

    it('should reconstruct escape path from horse to border', () => {
      const map = [
        '.....',
        '..H..',
        '.....',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);

      const result = solveBFS(level, walls);
      expect(result.escaped).toBe(true);
      expect(result.escapePath[0]).toBe(level.playerIdx);
      // Last element should be on a border
      const lastIdx = result.escapePath[result.escapePath.length - 1];
      const row = Math.floor(lastIdx / level.cols);
      const col = lastIdx % level.cols;
      const isOnBorder =
        row === 0 || row === level.rows - 1 || col === 0 || col === level.cols - 1;
      expect(isOnBorder).toBe(true);
    });
  });

  describe('bfsDistances', () => {
    it('should return null if horse can escape', () => {
      const map = [
        '.....',
        '..H..',
        '.....',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);

      const distances = bfsDistances(level, walls);
      expect(distances).toBeNull();
    });

    it('should return correct distances for enclosed horse', () => {
      const map = [
        '~~~~~',
        '~...~',
        '~.H.~',
        '~...~',
        '~~~~~',
      ].join('\n');
      const level = parseMap(map);
      const walls = new Uint8Array(level.rows * level.cols);

      const distances = bfsDistances(level, walls);
      expect(distances).not.toBeNull();
      expect(distances.get(level.playerIdx)).toBe(0);

      // Adjacent cells should be distance 1
      const cols = level.cols;
      const horseRow = Math.floor(level.playerIdx / cols);
      const horseCol = level.playerIdx % cols;
      expect(distances.get((horseRow - 1) * cols + horseCol)).toBe(1);
      expect(distances.get((horseRow + 1) * cols + horseCol)).toBe(1);
      expect(distances.get(horseRow * cols + (horseCol - 1))).toBe(1);
      expect(distances.get(horseRow * cols + (horseCol + 1))).toBe(1);
    });
  });
});
