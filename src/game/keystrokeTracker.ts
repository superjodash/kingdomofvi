import type { GemContext } from './lessons/types.ts';

export interface KeystrokeState {
  keys: string[];
  keyCounts: Record<string, number>;
  composedCounts: Record<string, number>;
  modeChanges: number;
  cursorVisited: Set<string>;
}

export function createKeystrokeState(): KeystrokeState {
  return {
    keys: [],
    keyCounts: {},
    composedCounts: {},
    modeChanges: 0,
    cursorVisited: new Set(),
  };
}

export function recordKey(state: KeystrokeState, key: string): KeystrokeState {
  const keyCounts = { ...state.keyCounts };
  keyCounts[key] = (keyCounts[key] ?? 0) + 1;
  return {
    ...state,
    keys: [...state.keys, key],
    keyCounts,
  };
}

export function recordComposed(
  state: KeystrokeState,
  command: string,
): KeystrokeState {
  const composedCounts = { ...state.composedCounts };
  composedCounts[command] = (composedCounts[command] ?? 0) + 1;
  return {
    ...state,
    composedCounts,
  };
}

export function recordModeChange(state: KeystrokeState): KeystrokeState {
  return {
    ...state,
    modeChanges: state.modeChanges + 1,
  };
}

export function recordCursorPosition(
  state: KeystrokeState,
  line: number,
  col: number,
): KeystrokeState {
  const key = `${line}:${col}`;
  if (state.cursorVisited.has(key)) return state;
  const cursorVisited = new Set(state.cursorVisited);
  cursorVisited.add(key);
  return {
    ...state,
    cursorVisited,
  };
}

export function buildGemContext(
  state: KeystrokeState,
  finalLines: string[],
  targetLines: string[] | null,
): GemContext {
  return {
    finalLines,
    targetLines,
    keys: state.keys,
    keyCounts: state.keyCounts,
    composedCounts: state.composedCounts,
    totalKeystrokes: state.keys.length,
    modeChanges: state.modeChanges,
    cursorVisited: state.cursorVisited,
  };
}
