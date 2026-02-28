import { useState, useCallback, useRef } from 'react';
import { createEditor, editorProcessKey, getEditorState, getEditorLines, isBufferMatchingTarget, type EditorConfig, type EditorInstance } from '../engine/editor.ts';
import { createKeystrokeState, recordKey, recordComposed, recordModeChange, recordCursorPosition, type KeystrokeState } from '../game/keystrokeTracker.ts';
import type { ExCommandResult } from '../engine/types.ts';

/**
 * React hook wrapping the Editor facade with keystroke tracking.
 * Uses useRef for the editor to ensure synchronous key processing,
 * and useState for render-triggering state.
 */

export interface UseEditorResult {
  lines: string[];
  state: ReturnType<typeof getEditorState>;
  keystrokeState: KeystrokeState;
  processKey: (key: string) => { blocked: boolean; command?: string; exResult?: ExCommandResult };
  isComplete: boolean;
  searchBuffer: string | null;
}

export function useEditor(config: EditorConfig): UseEditorResult {
  const editorRef = useRef<EditorInstance>(createEditor(config));
  const keystrokesRef = useRef<KeystrokeState>(createKeystrokeState());
  const [, forceRender] = useState(0);

  const processKey = useCallback((key: string) => {
    const prevMode = editorRef.current.composerState.editorState.mode;
    const result = editorProcessKey(editorRef.current, key);

    editorRef.current = result.editor;

    // Track keystrokes
    let ks = recordKey(keystrokesRef.current, key);

    if (result.command) {
      ks = recordComposed(ks, result.command);
    }

    const newMode = result.state.mode;
    if (prevMode !== newMode) {
      ks = recordModeChange(ks);
    }

    const cursor = result.state.cursor;
    ks = recordCursorPosition(ks, cursor.line, cursor.col);

    keystrokesRef.current = ks;

    // Trigger re-render
    forceRender((n) => n + 1);

    return { blocked: result.blocked, command: result.command, exResult: result.exResult };
  }, []);

  const editor = editorRef.current;
  const state = getEditorState(editor);
  const lines = getEditorLines(editor);
  const isComplete = isBufferMatchingTarget(editor);
  const searchBuffer = editor.composerState.searchBuffer;

  return { lines, state, keystrokeState: keystrokesRef.current, processKey, isComplete, searchBuffer };
}
