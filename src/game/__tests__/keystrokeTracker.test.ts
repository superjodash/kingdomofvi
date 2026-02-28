import { describe, it, expect } from 'vitest';
import {
  createKeystrokeState,
  recordKey,
  recordComposed,
  recordModeChange,
  recordCursorPosition,
  buildGemContext,
} from '../keystrokeTracker.ts';

describe('createKeystrokeState', () => {
  it('creates empty state', () => {
    const state = createKeystrokeState();
    expect(state.keys).toEqual([]);
    expect(state.keyCounts).toEqual({});
    expect(state.composedCounts).toEqual({});
    expect(state.modeChanges).toBe(0);
    expect(state.cursorVisited.size).toBe(0);
  });
});

describe('recordKey', () => {
  it('appends key and increments count', () => {
    let state = createKeystrokeState();
    state = recordKey(state, 'j');
    state = recordKey(state, 'j');
    state = recordKey(state, 'k');
    expect(state.keys).toEqual(['j', 'j', 'k']);
    expect(state.keyCounts).toEqual({ j: 2, k: 1 });
  });

  it('does not mutate original state', () => {
    const state = createKeystrokeState();
    const next = recordKey(state, 'h');
    expect(state.keys).toEqual([]);
    expect(next.keys).toEqual(['h']);
  });
});

describe('recordComposed', () => {
  it('tracks composed commands', () => {
    let state = createKeystrokeState();
    state = recordComposed(state, 'dw');
    state = recordComposed(state, 'dw');
    state = recordComposed(state, 'dd');
    expect(state.composedCounts).toEqual({ dw: 2, dd: 1 });
  });
});

describe('recordModeChange', () => {
  it('increments mode change counter', () => {
    let state = createKeystrokeState();
    state = recordModeChange(state);
    state = recordModeChange(state);
    expect(state.modeChanges).toBe(2);
  });
});

describe('recordCursorPosition', () => {
  it('records unique positions', () => {
    let state = createKeystrokeState();
    state = recordCursorPosition(state, 0, 0);
    state = recordCursorPosition(state, 1, 5);
    state = recordCursorPosition(state, 0, 0); // duplicate
    expect(state.cursorVisited.size).toBe(2);
    expect(state.cursorVisited.has('0:0')).toBe(true);
    expect(state.cursorVisited.has('1:5')).toBe(true);
  });

  it('returns same state when position already visited', () => {
    let state = createKeystrokeState();
    state = recordCursorPosition(state, 0, 0);
    const next = recordCursorPosition(state, 0, 0);
    expect(next).toBe(state); // same reference when no change
  });
});

describe('buildGemContext', () => {
  it('builds context from state', () => {
    let state = createKeystrokeState();
    state = recordKey(state, 'j');
    state = recordKey(state, 'k');
    state = recordComposed(state, 'dw');
    state = recordModeChange(state);
    state = recordCursorPosition(state, 0, 0);

    const ctx = buildGemContext(state, ['result'], ['target']);
    expect(ctx.finalLines).toEqual(['result']);
    expect(ctx.targetLines).toEqual(['target']);
    expect(ctx.keyCounts).toEqual({ j: 1, k: 1 });
    expect(ctx.composedCounts).toEqual({ dw: 1 });
    expect(ctx.totalKeystrokes).toBe(2);
    expect(ctx.modeChanges).toBe(1);
    expect(ctx.cursorVisited.size).toBe(1);
  });

  it('handles null target', () => {
    const state = createKeystrokeState();
    const ctx = buildGemContext(state, ['x'], null);
    expect(ctx.targetLines).toBeNull();
  });
});
