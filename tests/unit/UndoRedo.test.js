// ─── UndoRedo Tests ───
import { describe, it, expect } from 'vitest';
import { UndoRedo } from '../../src/engine/UndoRedo.js';

describe('UndoRedo', () => {
  it('should start with empty stacks', () => {
    const ur = new UndoRedo();
    expect(ur.canUndo).toBe(false);
    expect(ur.canRedo).toBe(false);
  });

  it('should push states to undo stack', () => {
    const ur = new UndoRedo();
    ur.push(new Uint8Array([0, 0, 0]));
    expect(ur.canUndo).toBe(true);
    expect(ur.canRedo).toBe(false);
  });

  it('should undo to previous state', () => {
    const ur = new UndoRedo();
    const state1 = new Uint8Array([0, 0, 0]);
    const state2 = new Uint8Array([1, 0, 0]);

    ur.push(state1);
    const prev = ur.undo(state2);

    expect(prev).not.toBeNull();
    expect(prev[0]).toBe(0); // state1
    expect(ur.canUndo).toBe(false);
    expect(ur.canRedo).toBe(true);
  });

  it('should redo after undo', () => {
    const ur = new UndoRedo();
    const state0 = new Uint8Array([0, 0, 0]);
    const state1 = new Uint8Array([1, 0, 0]);

    ur.push(state0);
    ur.undo(state1);

    const next = ur.redo(state0);
    expect(next).not.toBeNull();
    expect(next[0]).toBe(1); // state1
  });

  it('should clear redo stack on new push', () => {
    const ur = new UndoRedo();
    ur.push(new Uint8Array([0, 0, 0]));
    ur.push(new Uint8Array([1, 0, 0]));
    ur.undo(new Uint8Array([1, 1, 0]));

    expect(ur.canRedo).toBe(true);

    // New action clears redo
    ur.push(new Uint8Array([1, 1, 0]));
    expect(ur.canRedo).toBe(false);
  });

  it('should return null when nothing to undo', () => {
    const ur = new UndoRedo();
    const result = ur.undo(new Uint8Array([0]));
    expect(result).toBeNull();
  });

  it('should return null when nothing to redo', () => {
    const ur = new UndoRedo();
    const result = ur.redo(new Uint8Array([0]));
    expect(result).toBeNull();
  });

  it('should reset both stacks', () => {
    const ur = new UndoRedo();
    ur.push(new Uint8Array([0]));
    ur.push(new Uint8Array([1]));
    ur.undo(new Uint8Array([2]));

    ur.reset();
    expect(ur.canUndo).toBe(false);
    expect(ur.canRedo).toBe(false);
  });

  it('should not exceed max undo limit', () => {
    const ur = new UndoRedo();

    // Push 60 states (MAX_UNDO = 50)
    for (let i = 0; i < 60; i++) {
      ur.push(new Uint8Array([i]));
    }

    // Should only have 50
    let count = 0;
    let current = new Uint8Array([99]);
    while (ur.canUndo) {
      current = ur.undo(current);
      count++;
    }
    expect(count).toBe(50);
  });

  it('should preserve state copies (not references)', () => {
    const ur = new UndoRedo();
    const original = new Uint8Array([1, 2, 3]);
    ur.push(original);

    // Modify the original
    original[0] = 99;

    // Undo should return the copy, not the modified original
    const restored = ur.undo(new Uint8Array([0, 0, 0]));
    expect(restored[0]).toBe(1);
  });
});
