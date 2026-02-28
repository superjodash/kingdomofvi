import type { EditorState, Range, Cursor } from './types.ts';
import { deleteRange, insertCharAt, replaceCharAt } from './buffer.ts';

/**
 * Operator implementations: d, c, y, x, r, p, P
 * Each takes editor state + range and returns new state.
 */

export function deleteOp(state: EditorState, range: Range): EditorState {
  const buf = state.buffers[state.activeBufferIndex];
  const result = deleteRange(buf.lines, range);
  const newBuf = { ...buf, lines: result.lines, modified: true };
  const newBuffers = [...state.buffers];
  newBuffers[state.activeBufferIndex] = newBuf;
  return {
    ...state,
    buffers: newBuffers,
    cursor: result.cursor,
    register: result.deleted,
    registerLinewise: range.linewise,
    pendingOperator: null,
    keyBuffer: '',
    countBuffer: '',
  };
}

export function changeOp(state: EditorState, range: Range): EditorState {
  const deleted = deleteOp(state, range);
  // Change enters insert mode after deleting
  return {
    ...deleted,
    mode: 'insert',
  };
}

export function yankOp(state: EditorState, range: Range): EditorState {
  const buf = state.buffers[state.activeBufferIndex];
  const lines = buf.lines;

  let yanked: string;
  if (range.linewise) {
    yanked = lines.slice(range.start.line, range.end.line + 1).join('\n');
  } else if (range.start.line === range.end.line) {
    const endCol = range.inclusive ? range.end.col + 1 : range.end.col;
    yanked = lines[range.start.line].slice(range.start.col, endCol);
  } else {
    const parts: string[] = [lines[range.start.line].slice(range.start.col)];
    for (let i = range.start.line + 1; i < range.end.line; i++) {
      parts.push(lines[i]);
    }
    const endCol = range.inclusive ? range.end.col + 1 : range.end.col;
    parts.push(lines[range.end.line].slice(0, endCol));
    yanked = parts.join('\n');
  }

  return {
    ...state,
    register: yanked,
    registerLinewise: range.linewise,
    pendingOperator: null,
    keyBuffer: '',
    countBuffer: '',
  };
}

export function deleteCharOp(state: EditorState): EditorState {
  const buf = state.buffers[state.activeBufferIndex];
  const line = buf.lines[state.cursor.line];
  if (line.length === 0) return state;

  const col = state.cursor.col;
  if (col >= line.length) return state;

  const deleted = line[col];
  const newLine = line.slice(0, col) + line.slice(col + 1);
  const newLines = [...buf.lines];
  newLines[state.cursor.line] = newLine;

  const newBuf = { ...buf, lines: newLines, modified: true };
  const newBuffers = [...state.buffers];
  newBuffers[state.activeBufferIndex] = newBuf;

  const maxCol = Math.max(0, newLine.length - 1);
  return {
    ...state,
    buffers: newBuffers,
    cursor: { line: state.cursor.line, col: Math.min(col, maxCol) },
    register: deleted,
  };
}

export function replaceCharOp(state: EditorState, char: string): EditorState {
  const buf = state.buffers[state.activeBufferIndex];
  const line = buf.lines[state.cursor.line];
  if (state.cursor.col >= line.length) return state;

  const newLines = replaceCharAt(buf.lines, state.cursor.line, state.cursor.col, char);
  const newBuf = { ...buf, lines: newLines, modified: true };
  const newBuffers = [...state.buffers];
  newBuffers[state.activeBufferIndex] = newBuf;

  return {
    ...state,
    buffers: newBuffers,
  };
}

export function putAfterOp(state: EditorState): EditorState {
  if (!state.register) return state;
  const buf = state.buffers[state.activeBufferIndex];

  let newLines: string[];
  let newCursor: Cursor;

  if (state.registerLinewise) {
    // Linewise paste: insert lines below current line
    const pasteLines = state.register.split('\n');
    newLines = [...buf.lines];
    newLines.splice(state.cursor.line + 1, 0, ...pasteLines);
    newCursor = { line: state.cursor.line + 1, col: 0 };
  } else {
    // Characterwise paste: insert after cursor
    newLines = insertCharAt(
      buf.lines,
      state.cursor.line,
      state.cursor.col + 1,
      state.register,
    );
    newCursor = {
      line: state.cursor.line,
      col: state.cursor.col + state.register.length,
    };
  }

  const newBuf = { ...buf, lines: newLines, modified: true };
  const newBuffers = [...state.buffers];
  newBuffers[state.activeBufferIndex] = newBuf;

  return {
    ...state,
    buffers: newBuffers,
    cursor: newCursor,
  };
}

export function putBeforeOp(state: EditorState): EditorState {
  if (!state.register) return state;
  const buf = state.buffers[state.activeBufferIndex];

  let newLines: string[];
  let newCursor: Cursor;

  if (state.registerLinewise) {
    const pasteLines = state.register.split('\n');
    newLines = [...buf.lines];
    newLines.splice(state.cursor.line, 0, ...pasteLines);
    newCursor = { line: state.cursor.line, col: 0 };
  } else {
    newLines = insertCharAt(
      buf.lines,
      state.cursor.line,
      state.cursor.col,
      state.register,
    );
    newCursor = {
      line: state.cursor.line,
      col: state.cursor.col + state.register.length - 1,
    };
  }

  const newBuf = { ...buf, lines: newLines, modified: true };
  const newBuffers = [...state.buffers];
  newBuffers[state.activeBufferIndex] = newBuf;

  return {
    ...state,
    buffers: newBuffers,
    cursor: newCursor,
  };
}
