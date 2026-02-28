import { describe, it, expect } from 'vitest';
import {
  createInitialEditorState,
  enterInsertMode,
  enterInsertAfter,
  enterInsertAtLineStart,
  enterInsertAtLineEnd,
  enterInsertNewLineBelow,
  enterInsertNewLineAbove,
  enterNormalMode,
  enterVisualMode,
  enterVisualLineMode,
  enterCommandMode,
  isInsertMode,
  isVisualMode,
  isNormalMode,
  isCommandMode,
} from '../modes.ts';

function makeState() {
  return createInitialEditorState(['hello world', '  foo bar'], 'test.txt');
}

describe('createInitialEditorState', () => {
  it('creates state with normal mode and cursor at 0,0', () => {
    const state = makeState();
    expect(state.mode).toBe('normal');
    expect(state.cursor).toEqual({ line: 0, col: 0 });
    expect(state.buffers).toHaveLength(1);
    expect(state.buffers[0].lines).toEqual(['hello world', '  foo bar']);
  });
});

describe('enterInsertMode', () => {
  it('switches to insert mode', () => {
    const state = enterInsertMode(makeState());
    expect(state.mode).toBe('insert');
    expect(state.pendingOperator).toBeNull();
  });
});

describe('enterInsertAfter', () => {
  it('moves cursor one right and enters insert', () => {
    const state = makeState();
    state.cursor = { line: 0, col: 3 };
    const result = enterInsertAfter({ ...state });
    expect(result.mode).toBe('insert');
    expect(result.cursor.col).toBe(4);
  });
});

describe('enterInsertAtLineStart', () => {
  it('moves to first non-blank and enters insert', () => {
    const state = makeState();
    state.cursor = { line: 1, col: 5 };
    const result = enterInsertAtLineStart({ ...state });
    expect(result.mode).toBe('insert');
    expect(result.cursor.col).toBe(2); // skips '  '
  });
});

describe('enterInsertAtLineEnd', () => {
  it('moves to end of line and enters insert', () => {
    const result = enterInsertAtLineEnd(makeState());
    expect(result.mode).toBe('insert');
    expect(result.cursor.col).toBe(11); // past last char for insert
  });
});

describe('enterInsertNewLineBelow', () => {
  it('inserts empty line below and enters insert', () => {
    const result = enterInsertNewLineBelow(makeState());
    expect(result.mode).toBe('insert');
    expect(result.cursor).toEqual({ line: 1, col: 0 });
    expect(result.buffers[0].lines).toHaveLength(3);
    expect(result.buffers[0].lines[1]).toBe('');
  });
});

describe('enterInsertNewLineAbove', () => {
  it('inserts empty line above and enters insert', () => {
    const result = enterInsertNewLineAbove(makeState());
    expect(result.mode).toBe('insert');
    expect(result.cursor).toEqual({ line: 0, col: 0 });
    expect(result.buffers[0].lines).toHaveLength(3);
    expect(result.buffers[0].lines[0]).toBe('');
  });
});

describe('enterNormalMode', () => {
  it('from insert mode backs cursor up by 1', () => {
    let state = makeState();
    state = { ...state, mode: 'insert', cursor: { line: 0, col: 5 } };
    const result = enterNormalMode(state);
    expect(result.mode).toBe('normal');
    expect(result.cursor.col).toBe(4);
  });

  it('clears pending operator and selection', () => {
    let state = makeState();
    state = { ...state, pendingOperator: { operator: 'd' }, selection: { anchor: { line: 0, col: 0 }, head: { line: 0, col: 3 } } };
    const result = enterNormalMode(state);
    expect(result.pendingOperator).toBeNull();
    expect(result.selection).toBeNull();
  });
});

describe('enterVisualMode', () => {
  it('enters visual mode with selection at cursor', () => {
    const result = enterVisualMode(makeState());
    expect(result.mode).toBe('visual');
    expect(result.selection).not.toBeNull();
    expect(result.selection!.anchor).toEqual(result.cursor);
  });

  it('toggles back to normal if already in visual', () => {
    let state = makeState();
    state = enterVisualMode(state);
    const result = enterVisualMode(state);
    expect(result.mode).toBe('normal');
  });
});

describe('enterVisualLineMode', () => {
  it('enters visual-line mode', () => {
    const result = enterVisualLineMode(makeState());
    expect(result.mode).toBe('visual-line');
  });
});

describe('enterCommandMode', () => {
  it('enters command mode with empty command line', () => {
    const result = enterCommandMode(makeState());
    expect(result.mode).toBe('command');
    expect(result.commandLineText).toBe('');
  });
});

describe('mode predicates', () => {
  it('correctly identifies modes', () => {
    expect(isInsertMode('insert')).toBe(true);
    expect(isInsertMode('normal')).toBe(false);
    expect(isVisualMode('visual')).toBe(true);
    expect(isVisualMode('visual-line')).toBe(true);
    expect(isVisualMode('normal')).toBe(false);
    expect(isNormalMode('normal')).toBe(true);
    expect(isCommandMode('command')).toBe(true);
  });
});
