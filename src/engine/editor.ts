import type { EditorState, ExCommandResult } from './types.ts';
import {
  createComposerState,
  processKey as composerProcessKey,
  type ComposerState,
  type ProcessResult,
} from './composer.ts';
import { isKeyAllowed } from './keymap.ts';

/**
 * Editor facade: single entry point for the React layer.
 * Wraps the composer and adds key restriction + completion detection.
 */

export interface EditorConfig {
  initialBuffer: string;
  targetBuffer?: string;
  allowedKeys: Set<string> | null;
  fileName?: string;
}

export interface EditorInstance {
  composerState: ComposerState;
  config: EditorConfig;
}

export interface KeyResult {
  editor: EditorInstance;
  state: EditorState;
  command?: string;
  exResult?: ExCommandResult;
  blocked: boolean;
}

export function createEditor(config: EditorConfig): EditorInstance {
  const lines = config.initialBuffer === ''
    ? ['']
    : config.initialBuffer.split('\n');
  return {
    composerState: createComposerState(lines, config.fileName ?? 'lesson'),
    config,
  };
}

export function editorProcessKey(editor: EditorInstance, key: string): KeyResult {
  const { composerState, config } = editor;
  const mode = composerState.editorState.mode;
  const bypassRestrictions =
    mode === 'insert' ||
    mode === 'command' ||
    composerState.searchBuffer !== null ||
    composerState.waitingForChar !== null;

  if (!bypassRestrictions && !isKeyAllowed(key, config.allowedKeys)) {
    return {
      editor,
      state: {
        ...composerState.editorState,
        message: 'Key not yet unlocked',
      },
      blocked: true,
    };
  }

  const result: ProcessResult = composerProcessKey(composerState, key);

  return {
    editor: {
      ...editor,
      composerState: result.composer,
    },
    state: result.composer.editorState,
    command: result.command,
    exResult: result.exResult,
    blocked: false,
  };
}

export function getEditorState(editor: EditorInstance): EditorState {
  return editor.composerState.editorState;
}

export function getEditorLines(editor: EditorInstance): string[] {
  return editor.composerState.editorState.buffers[
    editor.composerState.editorState.activeBufferIndex
  ].lines;
}

export function isBufferMatchingTarget(editor: EditorInstance): boolean {
  const { config } = editor;
  if (!config.targetBuffer) return false;

  const currentLines = getEditorLines(editor);
  const targetLines = config.targetBuffer.split('\n');

  if (currentLines.length !== targetLines.length) return false;
  return currentLines.every((line, i) => line === targetLines[i]);
}
