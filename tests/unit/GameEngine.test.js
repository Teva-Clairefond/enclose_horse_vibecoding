// ─── GameEngine Tests ───
import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../../src/engine/GameEngine.js';
import { parseMap } from '../../src/levels/MapParser.js';

describe('GameEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new GameEngine();
  });

  describe('loadLevel', () => {
    it('should load a level correctly', () => {
      const level = parseMap('...\n.H.\n...');
      engine.loadLevel(level, 5);

      expect(engine.level).toBe(level);
      expect(engine.wallBudget).toBe(5);
      expect(engine.wallsPlaced).toBe(0);
      expect(engine.submitted).toBe(false);
    });

    it('should solve immediately after loading', () => {
      const level = parseMap('...\n.H.\n...');
      engine.loadLevel(level, 5);

      expect(engine.bfsResult).not.toBeNull();
      expect(engine.scoreResult).not.toBeNull();
    });
  });

  describe('toggleWall', () => {
    it('should place a wall on valid grass tile', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      const result = engine.toggleWall(0); // (0,0) grass
      expect(result).toBe(true);
      expect(engine.wallsPlaced).toBe(1);
      expect(engine.playerWalls[0]).toBe(1);
    });

    it('should remove a wall when toggling again', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      engine.toggleWall(0);
      expect(engine.wallsPlaced).toBe(1);

      engine.toggleWall(0);
      expect(engine.wallsPlaced).toBe(0);
      expect(engine.playerWalls[0]).toBe(0);
    });

    it('should not place wall on water', () => {
      const level = parseMap('~....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      const result = engine.toggleWall(0); // (0,0) water
      expect(result).toBe(false);
      expect(engine.wallsPlaced).toBe(0);
    });

    it('should not place wall on horse', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      const result = engine.toggleWall(level.playerIdx);
      expect(result).toBe(false);
    });

    it('should not place wall on cherry', () => {
      const level = parseMap('C....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      const result = engine.toggleWall(0); // (0,0) cherry
      expect(result).toBe(false);
    });

    it('should not place wall on gem', () => {
      const level = parseMap('G....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      const result = engine.toggleWall(0);
      expect(result).toBe(false);
    });

    it('should not place wall on portal', () => {
      const level = parseMap('0....\n..H..\n.....\n.....\n..0..');
      engine.loadLevel(level, 10);

      const result = engine.toggleWall(0);
      expect(result).toBe(false);
    });

    it('should respect wall budget', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 2);

      engine.toggleWall(0);
      engine.toggleWall(1);

      const result = engine.toggleWall(2); // Over budget
      expect(result).toBe(false);
      expect(engine.wallsPlaced).toBe(2);
    });

    it('should not place walls after submission', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      engine.submit();
      const result = engine.toggleWall(0);
      expect(result).toBe(false);
    });

    it('should re-solve after placing wall', () => {
      const level = parseMap('~~~~~\n~...~\n~.H.~\n~...~\n~~~~~');
      engine.loadLevel(level, 5);

      // Initially enclosed
      expect(engine.bfsResult.escaped).toBe(false);
      const initialScore = engine.scoreResult.total;

      // Place a wall — score should change
      engine.toggleWall(1 * 5 + 1); // (1,1)
      expect(engine.scoreResult.total).not.toBe(initialScore);
    });
  });

  describe('undo/redo', () => {
    it('should undo wall placement', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      engine.toggleWall(0);
      expect(engine.wallsPlaced).toBe(1);

      engine.undo();
      expect(engine.wallsPlaced).toBe(0);
      expect(engine.playerWalls[0]).toBe(0);
    });

    it('should redo wall placement', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      engine.toggleWall(0);
      engine.undo();
      engine.redo();

      expect(engine.wallsPlaced).toBe(1);
      expect(engine.playerWalls[0]).toBe(1);
    });

    it('should not undo after submission', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      engine.toggleWall(0);
      engine.submit();
      const result = engine.undo();
      expect(result).toBe(false);
    });
  });

  describe('reset', () => {
    it('should remove all walls', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      engine.toggleWall(0);
      engine.toggleWall(1);
      engine.toggleWall(2);

      engine.reset();
      expect(engine.wallsPlaced).toBe(0);
    });

    it('should return false when no walls to reset', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      const result = engine.reset();
      expect(result).toBe(false);
    });
  });

  describe('submit', () => {
    it('should return score result', () => {
      const level = parseMap('~~~~~\n~...~\n~.H.~\n~...~\n~~~~~');
      engine.loadLevel(level, 5);

      const result = engine.submit();
      expect(result).not.toBeNull();
      expect(result.total).toBeGreaterThan(0);
      expect(result.escaped).toBe(false);
    });

    it('should prevent double submission', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      engine.submit();
      const result = engine.submit();
      expect(result).toBeNull();
    });

    it('should set submitted flag', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      engine.submit();
      expect(engine.submitted).toBe(true);
    });
  });

  describe('canPlaceWall', () => {
    it('should return true for valid grass tile', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      expect(engine.canPlaceWall(0)).toBe(true);
    });

    it('should return false for water', () => {
      const level = parseMap('~....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      expect(engine.canPlaceWall(0)).toBe(false);
    });

    it('should return true for existing wall (removal)', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 10);

      engine.toggleWall(0);
      expect(engine.canPlaceWall(0)).toBe(true); // Can remove
    });

    it('should return false when budget exhausted', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 1);

      engine.toggleWall(0);
      expect(engine.canPlaceWall(1)).toBe(false); // Budget full
    });
  });

  describe('getState', () => {
    it('should return complete state object', () => {
      const level = parseMap('.....\n..H..\n.....\n.....\n.....');
      engine.loadLevel(level, 5);

      const state = engine.getState();
      expect(state.level).toBe(level);
      expect(state.playerWalls).toBeDefined();
      expect(state.wallBudget).toBe(5);
      expect(state.wallsPlaced).toBe(0);
      expect(state.bfsResult).not.toBeNull();
      expect(state.scoreResult).not.toBeNull();
      expect(state.submitted).toBe(false);
      expect(state.canUndo).toBe(false);
      expect(state.canRedo).toBe(false);
    });
  });
});
