import type { Mode, EditorState, Cursor } from './types.ts';

/**
 * Mode state machine: Normal ↔ Insert ↔ Visual ↔ Visual-Line ↔ Command
 * All transitions are pure functions returning new state.
 */

export function enterInsertMode(
  state: EditorState,
  cursorAdjust?: Cursor,
): EditorState {
  return {
    ...state,
    mode: 'insert',
    cursor: cursorAdjust ?? state.cursor,
    pendingOperator: null,
    selection: null,
    keyBuffer: '',
    countBuffer: '',
  };
}

export function enterInsertAfter(state: EditorState): EditorState {
  const line = state.buffers[state.activeBufferIndex].lines[state.cursor.line];
  const col = Math.min(state.cursor.col + 1, line.length);
  return enterInsertMode(state, { line: state.cursor.line, col });
}

export function enterInsertAtLineStart(state: EditorState): EditorState {
  const line = state.buffers[state.activeBufferIndex].lines[state.cursor.line];
  const match = line.match(/\S/);
  const col = match ? line.indexOf(match[0]) : 0;
  return enterInsertMode(state, { line: state.cursor.line, col });
}

export function enterInsertAtLineEnd(state: EditorState): EditorState {
  const line = state.buffers[state.activeBufferIndex].lines[state.cursor.line];
  return enterInsertMode(state, { line: state.cursor.line, col: line.length });
}

export function enterInsertNewLineBelow(state: EditorState): EditorState {
  const buf = state.buffers[state.activeBufferIndex];
  const newLines = [...buf.lines];
  newLines.splice(state.cursor.line + 1, 0, '');
  const newBuf = { ...buf, lines: newLines, modified: true };
  const newBuffers = [...state.buffers];
  newBuffers[state.activeBufferIndex] = newBuf;
  return {
    ...state,
    buffers: newBuffers,
    mode: 'insert',
    cursor: { line: state.cursor.line + 1, col: 0 },
    pendingOperator: null,
    selection: null,
    keyBuffer: '',
    countBuffer: '',
  };
}

export function enterInsertNewLineAbove(state: EditorState): EditorState {
  const buf = state.buffers[state.activeBufferIndex];
  const newLines = [...buf.lines];
  newLines.splice(state.cursor.line, 0, '');
  const newBuf = { ...buf, lines: newLines, modified: true };
  const newBuffers = [...state.buffers];
  newBuffers[state.activeBufferIndex] = newBuf;
  return {
    ...state,
    buffers: newBuffers,
    mode: 'insert',
    cursor: { line: state.cursor.line, col: 0 },
    pendingOperator: null,
    selection: null,
    keyBuffer: '',
    countBuffer: '',
  };
}

export function enterNormalMode(state: EditorState): EditorState {
  const buf = state.buffers[state.activeBufferIndex];
  const lineLen = buf.lines[state.cursor.line].length;
  // In normal mode, cursor can't be past last char
  const maxCol = Math.max(0, lineLen - 1);
  const col = state.mode === 'insert'
    ? Math.max(0, Math.min(state.cursor.col - 1, maxCol))
    : Math.min(state.cursor.col, maxCol);

  return {
    ...state,
    mode: 'normal',
    cursor: { line: state.cursor.line, col: lineLen === 0 ? 0 : col },
    pendingOperator: null,
    selection: null,
    keyBuffer: '',
    countBuffer: '',
  };
}

export function enterVisualMode(state: EditorState): EditorState {
  if (state.mode === 'visual') {
    return enterNormalMode(state);
  }
  return {
    ...state,
    mode: 'visual',
    selection: {
      anchor: { ...state.cursor },
      head: { ...state.cursor },
    },
    pendingOperator: null,
    keyBuffer: '',
    countBuffer: '',
  };
}

export function enterVisualLineMode(state: EditorState): EditorState {
  if (state.mode === 'visual-line') {
    return enterNormalMode(state);
  }
  return {
    ...state,
    mode: 'visual-line',
    selection: {
      anchor: { ...state.cursor },
      head: { ...state.cursor },
    },
    pendingOperator: null,
    keyBuffer: '',
    countBuffer: '',
  };
}

export function enterCommandMode(state: EditorState): EditorState {
  return {
    ...state,
    mode: 'command',
    commandLineText: '',
    pendingOperator: null,
    keyBuffer: '',
    countBuffer: '',
  };
}

export function isInsertMode(mode: Mode): boolean {
  return mode === 'insert';
}

export function isVisualMode(mode: Mode): boolean {
  return mode === 'visual' || mode === 'visual-line';
}

export function isNormalMode(mode: Mode): boolean {
  return mode === 'normal';
}

export function isCommandMode(mode: Mode): boolean {
  return mode === 'command';
}

export function createInitialEditorState(lines: string[], fileName = 'untitled'): EditorState {
  return {
    buffers: [{
      lines,
      fileName,
      modified: false,
      savedSnapshot: [...lines],
    }],
    activeBufferIndex: 0,
    cursor: { line: 0, col: 0 },
    mode: 'normal',
    pendingOperator: null,
    selection: null,
    register: '',
    registerLinewise: false,
    lastSearch: null,
    lastFindChar: null,
    lastChange: null,
    commandLineText: '',
    message: null,
    keyBuffer: '',
    countBuffer: '',
    splits: null,
  };
}
