import { describe, it, expect } from 'vitest';
import { createInitialEditorState } from '../modes.ts';
import {
  deleteOp,
  changeOp,
  yankOp,
  deleteCharOp,
  replaceCharOp,
  putAfterOp,
  putBeforeOp,
} from '../operators.ts';
import type { Range } from '../types.ts';

function makeState() {
  return createInitialEditorState(['hello world', 'foo bar', 'baz qux']);
}

describe('deleteOp', () => {
  it('deletes characterwise range', () => {
    const range: Range = {
      start: { line: 0, col: 0 },
      end: { line: 0, col: 5 },
      linewise: false,
      inclusive: false,
    };
    const result = deleteOp(makeState(), range);
    // Non-inclusive: deletes cols 0-4, space at col 5 remains
    expect(result.buffers[0].lines[0]).toBe(' world');
    expect(result.register).toBe('hello');
  });

  it('deletes linewise range', () => {
    const range: Range = {
      start: { line: 0, col: 0 },
      end: { line: 0, col: 0 },
      linewise: true,
      inclusive: false,
    };
    const result = deleteOp(makeState(), range);
    expect(result.buffers[0].lines).toEqual(['foo bar', 'baz qux']);
    expect(result.register).toBe('hello world');
  });
});

describe('changeOp', () => {
  it('deletes and enters insert mode', () => {
    const range: Range = {
      start: { line: 0, col: 0 },
      end: { line: 0, col: 5 },
      linewise: false,
      inclusive: false,
    };
    const result = changeOp(makeState(), range);
    expect(result.mode).toBe('insert');
    expect(result.buffers[0].lines[0]).toBe(' world');
  });
});

describe('yankOp', () => {
  it('yanks without modifying buffer', () => {
    const state = makeState();
    const range: Range = {
      start: { line: 0, col: 0 },
      end: { line: 0, col: 5 },
      linewise: false,
      inclusive: false,
    };
    const result = yankOp(state, range);
    expect(result.register).toBe('hello');
    expect(result.buffers[0].lines).toEqual(state.buffers[0].lines);
  });

  it('yanks linewise', () => {
    const range: Range = {
      start: { line: 0, col: 0 },
      end: { line: 1, col: 0 },
      linewise: true,
      inclusive: false,
    };
    const result = yankOp(makeState(), range);
    expect(result.register).toBe('hello world\nfoo bar');
  });
});

describe('deleteCharOp', () => {
  it('deletes char at cursor', () => {
    const result = deleteCharOp(makeState());
    expect(result.buffers[0].lines[0]).toBe('ello world');
    expect(result.register).toBe('h');
  });

  it('does nothing on empty line', () => {
    const state = createInitialEditorState(['']);
    const result = deleteCharOp(state);
    expect(result.buffers[0].lines).toEqual(['']);
  });
});

describe('replaceCharOp', () => {
  it('replaces char at cursor', () => {
    const result = replaceCharOp(makeState(), 'X');
    expect(result.buffers[0].lines[0]).toBe('Xello world');
  });
});

describe('putAfterOp', () => {
  it('pastes characterwise after cursor', () => {
    let state = makeState();
    state = { ...state, register: 'XY' };
    const result = putAfterOp(state);
    expect(result.buffers[0].lines[0]).toBe('hXYello world');
  });

  it('pastes linewise below', () => {
    let state = makeState();
    state = { ...state, register: 'new line\nanother', registerLinewise: true };
    const result = putAfterOp(state);
    expect(result.buffers[0].lines[1]).toBe('new line');
    expect(result.buffers[0].lines[2]).toBe('another');
  });

  it('does nothing with empty register', () => {
    const result = putAfterOp(makeState());
    expect(result.buffers[0].lines).toEqual(makeState().buffers[0].lines);
  });
});

describe('putBeforeOp', () => {
  it('pastes characterwise before cursor', () => {
    let state = makeState();
    state = { ...state, register: 'AB' };
    const result = putBeforeOp(state);
    expect(result.buffers[0].lines[0]).toBe('ABhello world');
  });
});
