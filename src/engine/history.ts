import type { EditorState, Buffer, Cursor } from './types.ts';

/**
 * Undo/redo history using snapshot stacks.
 * - Push snapshot before each normal-mode edit
 * - Push snapshot on entering insert mode
 * - All chars typed during one insert session = one undo atom
 * - u pops from past → pushes current to future
 * - New edit after undo clears future stack
 */

export interface HistoryEntry {
  lines: string[];
  cursor: Cursor;
}

export interface HistoryState {
  past: HistoryEntry[];
  future: HistoryEntry[];
}

export function createHistory(): HistoryState {
  return { past: [], future: [] };
}

export function pushSnapshot(
  history: HistoryState,
  buffer: Buffer,
  cursor: Cursor,
): HistoryState {
  return {
    past: [
      ...history.past,
      { lines: [...buffer.lines], cursor: { ...cursor } },
    ],
    // New edit clears future (can't redo after new change)
    future: [],
  };
}

export function undo(
  history: HistoryState,
  buffer: Buffer,
  cursor: Cursor,
): { history: HistoryState; lines: string[]; cursor: Cursor } | null {
  if (history.past.length === 0) return null;

  const past = [...history.past];
  const entry = past.pop()!;

  return {
    history: {
      past,
      future: [
        ...history.future,
        { lines: [...buffer.lines], cursor: { ...cursor } },
      ],
    },
    lines: entry.lines,
    cursor: entry.cursor,
  };
}

export function redo(
  history: HistoryState,
  buffer: Buffer,
  cursor: Cursor,
): { history: HistoryState; lines: string[]; cursor: Cursor } | null {
  if (history.future.length === 0) return null;

  const future = [...history.future];
  const entry = future.pop()!;

  return {
    history: {
      past: [
        ...history.past,
        { lines: [...buffer.lines], cursor: { ...cursor } },
      ],
      future,
    },
    lines: entry.lines,
    cursor: entry.cursor,
  };
}

export function applyUndo(state: EditorState, history: HistoryState): {
  state: EditorState;
  history: HistoryState;
} | null {
  const buf = state.buffers[state.activeBufferIndex];
  const result = undo(history, buf, state.cursor);
  if (!result) return null;

  const newBuf = { ...buf, lines: result.lines, modified: true };
  const newBuffers = [...state.buffers];
  newBuffers[state.activeBufferIndex] = newBuf;

  return {
    state: {
      ...state,
      buffers: newBuffers,
      cursor: result.cursor,
    },
    history: result.history,
  };
}

export function applyRedo(state: EditorState, history: HistoryState): {
  state: EditorState;
  history: HistoryState;
} | null {
  const buf = state.buffers[state.activeBufferIndex];
  const result = redo(history, buf, state.cursor);
  if (!result) return null;

  const newBuf = { ...buf, lines: result.lines, modified: true };
  const newBuffers = [...state.buffers];
  newBuffers[state.activeBufferIndex] = newBuf;

  return {
    state: {
      ...state,
      buffers: newBuffers,
      cursor: result.cursor,
    },
    history: result.history,
  };
}
