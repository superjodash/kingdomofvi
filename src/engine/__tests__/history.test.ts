import { describe, it, expect } from 'vitest';
import {
  createHistory,
  pushSnapshot,
  undo,
  redo,
  applyUndo,
  applyRedo,
} from '../history.ts';
import { createBuffer } from '../buffer.ts';
import { createInitialEditorState } from '../modes.ts';

describe('createHistory', () => {
  it('creates empty history', () => {
    const h = createHistory();
    expect(h.past).toEqual([]);
    expect(h.future).toEqual([]);
  });
});

describe('pushSnapshot', () => {
  it('adds to past and clears future', () => {
    const buf = createBuffer('hello');
    let h = createHistory();
    h = pushSnapshot(h, buf, { line: 0, col: 0 });
    expect(h.past).toHaveLength(1);
    expect(h.future).toHaveLength(0);
  });

  it('clears future on new edit', () => {
    const buf = createBuffer('hello');
    let h = createHistory();
    h = pushSnapshot(h, buf, { line: 0, col: 0 });
    // Simulate undo
    const undoResult = undo(h, createBuffer('world'), { line: 0, col: 0 });
    expect(undoResult).not.toBeNull();
    // New edit clears future
    const h2 = pushSnapshot(undoResult!.history, createBuffer('hello'), { line: 0, col: 0 });
    expect(h2.future).toHaveLength(0);
  });
});

describe('undo', () => {
  it('returns null when nothing to undo', () => {
    expect(undo(createHistory(), createBuffer('x'), { line: 0, col: 0 })).toBeNull();
  });

  it('restores previous state', () => {
    const buf = createBuffer('hello');
    let h = createHistory();
    h = pushSnapshot(h, buf, { line: 0, col: 0 });

    const result = undo(h, createBuffer('changed'), { line: 0, col: 3 });
    expect(result).not.toBeNull();
    expect(result!.lines).toEqual(['hello']);
    expect(result!.cursor).toEqual({ line: 0, col: 0 });
    expect(result!.history.future).toHaveLength(1);
  });
});

describe('redo', () => {
  it('returns null when nothing to redo', () => {
    expect(redo(createHistory(), createBuffer('x'), { line: 0, col: 0 })).toBeNull();
  });

  it('restores future state after undo', () => {
    const buf = createBuffer('original');
    let h = createHistory();
    h = pushSnapshot(h, buf, { line: 0, col: 0 });

    const undoResult = undo(h, createBuffer('modified'), { line: 0, col: 5 })!;
    const redoResult = redo(undoResult.history, createBuffer(undoResult.lines.join('\n')), undoResult.cursor);
    expect(redoResult).not.toBeNull();
    expect(redoResult!.lines).toEqual(['modified']);
  });
});

describe('applyUndo / applyRedo', () => {
  it('applies undo to editor state', () => {
    let state = createInitialEditorState(['original']);
    const h = pushSnapshot(createHistory(), state.buffers[0], state.cursor);

    // Modify state
    const buf = { ...state.buffers[0], lines: ['changed'], modified: true };
    state = { ...state, buffers: [buf], cursor: { line: 0, col: 3 } };

    const result = applyUndo(state, h);
    expect(result).not.toBeNull();
    expect(result!.state.buffers[0].lines).toEqual(['original']);
  });

  it('applies redo after undo', () => {
    let state = createInitialEditorState(['original']);
    const h = pushSnapshot(createHistory(), state.buffers[0], state.cursor);

    const buf = { ...state.buffers[0], lines: ['changed'], modified: true };
    state = { ...state, buffers: [buf], cursor: { line: 0, col: 3 } };

    const undoResult = applyUndo(state, h)!;
    const redoResult = applyRedo(undoResult.state, undoResult.history);
    expect(redoResult).not.toBeNull();
    expect(redoResult!.state.buffers[0].lines).toEqual(['changed']);
  });
});
