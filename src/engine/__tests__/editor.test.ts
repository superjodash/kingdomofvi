import { describe, expect, it } from 'vitest';
import { createEditor, editorProcessKey } from '../editor.ts';

describe('editorProcessKey', () => {
  it('allows arbitrary replacement characters after r even if not unlocked', () => {
    const allowedKeys = new Set(['h', 'j', 'k', 'l', 'r']);
    let editor = createEditor({
      initialBuffer: 'WELC0ME',
      allowedKeys,
      fileName: 'test',
    });

    editor = editorProcessKey(editor, 'l').editor;
    editor = editorProcessKey(editor, 'l').editor;
    editor = editorProcessKey(editor, 'l').editor;
    editor = editorProcessKey(editor, 'l').editor;

    const wait = editorProcessKey(editor, 'r');
    expect(wait.blocked).toBe(false);

    const replace = editorProcessKey(wait.editor, 'O');
    expect(replace.blocked).toBe(false);
    expect(replace.state.buffers[0].lines[0]).toBe('WELCOME');
  });

  it('allows arbitrary search characters after / even if not unlocked', () => {
    const allowedKeys = new Set(['/']);
    const editor = createEditor({
      initialBuffer: 'hello world',
      allowedKeys,
      fileName: 'test',
    });

    const startSearch = editorProcessKey(editor, '/');
    expect(startSearch.blocked).toBe(false);

    const typeH = editorProcessKey(startSearch.editor, 'h');
    expect(typeH.blocked).toBe(false);

    const typeE = editorProcessKey(typeH.editor, 'e');
    expect(typeE.blocked).toBe(false);
    expect(typeE.editor.composerState.searchBuffer).toBe('he');
  });
});
