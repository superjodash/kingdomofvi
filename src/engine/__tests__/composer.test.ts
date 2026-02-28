import { describe, it, expect } from 'vitest';
import { createComposerState, processKey } from '../composer.ts';

function feedKeys(keys: string[]): ReturnType<typeof processKey> {
  let cs = createComposerState(['hello world', 'foo bar', 'baz qux']);
  let result: ReturnType<typeof processKey> = { composer: cs };
  for (const key of keys) {
    result = processKey(result.composer, key);
  }
  return result;
}

function getLines(result: ReturnType<typeof processKey>): string[] {
  return result.composer.editorState.buffers[0].lines;
}

function getCursor(result: ReturnType<typeof processKey>) {
  return result.composer.editorState.cursor;
}

function getMode(result: ReturnType<typeof processKey>) {
  return result.composer.editorState.mode;
}

describe('basic motions', () => {
  it('h/j/k/l move cursor', () => {
    expect(getCursor(feedKeys(['l']))).toEqual({ line: 0, col: 1 });
    expect(getCursor(feedKeys(['j']))).toEqual({ line: 1, col: 0 });
    expect(getCursor(feedKeys(['l', 'l', 'h']))).toEqual({ line: 0, col: 1 });
    expect(getCursor(feedKeys(['j', 'k']))).toEqual({ line: 0, col: 0 });
  });

  it('w moves to next word', () => {
    expect(getCursor(feedKeys(['w']))).toEqual({ line: 0, col: 6 });
  });

  it('$ moves to end of line', () => {
    expect(getCursor(feedKeys(['$']))).toEqual({ line: 0, col: 10 });
  });

  it('0 moves to start of line', () => {
    expect(getCursor(feedKeys(['$', '0']))).toEqual({ line: 0, col: 0 });
  });
});

describe('counts', () => {
  it('3l moves 3 right', () => {
    expect(getCursor(feedKeys(['3', 'l']))).toEqual({ line: 0, col: 3 });
  });

  it('2j moves 2 down', () => {
    expect(getCursor(feedKeys(['2', 'j']))).toEqual({ line: 2, col: 0 });
  });
});

describe('mode changes', () => {
  it('i enters insert mode', () => {
    expect(getMode(feedKeys(['i']))).toBe('insert');
  });

  it('Escape returns to normal', () => {
    expect(getMode(feedKeys(['i', 'Escape']))).toBe('normal');
  });

  it('v enters visual mode', () => {
    expect(getMode(feedKeys(['v']))).toBe('visual');
  });

  it(': enters command mode', () => {
    expect(getMode(feedKeys([':']))).toBe('command');
  });
});

describe('insert mode', () => {
  it('typing inserts characters', () => {
    const result = feedKeys(['i', 'X', 'Y', 'Escape']);
    expect(getLines(result)[0]).toBe('XYhello world');
    expect(getMode(result)).toBe('normal');
  });

  it('backspace deletes character', () => {
    const result = feedKeys(['l', 'l', 'i', 'Backspace', 'Escape']);
    expect(getLines(result)[0]).toBe('hllo world');
  });

  it('Enter splits line', () => {
    const result = feedKeys(['l', 'l', 'l', 'l', 'l', 'i', 'Enter', 'Escape']);
    expect(getLines(result)[0]).toBe('hello');
    expect(getLines(result)[1]).toBe(' world');
  });
});

describe('delete operations', () => {
  it('x deletes char at cursor', () => {
    expect(getLines(feedKeys(['x']))[0]).toBe('ello world');
  });

  it('dd deletes current line', () => {
    const result = feedKeys(['d', 'd']);
    expect(getLines(result)).toEqual(['foo bar', 'baz qux']);
    expect(result.command).toBe('dd');
  });

  it('dw deletes word', () => {
    const result = feedKeys(['d', 'w']);
    expect(getLines(result)[0]).toBe('world');
    expect(result.command).toContain('dw');
  });

  it('d$ deletes to end of line', () => {
    const result = feedKeys(['d', '$']);
    expect(getLines(result)[0]).toBe('');
  });
});

describe('change operations', () => {
  it('cc changes entire line (deletes line, enters insert)', () => {
    const result = feedKeys(['c', 'c']);
    // cc linewise-deletes the line, then enters insert on remaining first line
    expect(getLines(result)).toEqual(['foo bar', 'baz qux']);
    expect(getMode(result)).toBe('insert');
  });

  it('cw changes word', () => {
    const result = feedKeys(['c', 'w']);
    expect(getMode(result)).toBe('insert');
  });
});

describe('yank and paste', () => {
  it('yy + p pastes line below', () => {
    const result = feedKeys(['y', 'y', 'p']);
    expect(getLines(result)).toEqual([
      'hello world',
      'hello world',
      'foo bar',
      'baz qux',
    ]);
  });
});

describe('replace', () => {
  it('r replaces character', () => {
    const result = feedKeys(['r', 'X']);
    expect(getLines(result)[0]).toBe('Xello world');
  });
});

describe('undo/redo', () => {
  it('u undoes last change', () => {
    const result = feedKeys(['x', 'u']);
    expect(getLines(result)[0]).toBe('hello world');
  });
});

describe('search', () => {
  it('/pattern finds and moves cursor', () => {
    const result = feedKeys(['/', 'f', 'o', 'o', 'Enter']);
    expect(getCursor(result)).toEqual({ line: 1, col: 0 });
  });
});

describe('command mode', () => {
  it(':w executes save command', () => {
    const result = feedKeys([':', 'w', 'Enter']);
    expect(result.exResult).toEqual({ type: 'save' });
    expect(getMode(result)).toBe('normal');
  });

  it(':q! executes force-quit', () => {
    const result = feedKeys([':', 'q', '!', 'Enter']);
    expect(result.exResult).toEqual({ type: 'force-quit' });
  });
});

describe('dot repeat', () => {
  it('repeats last change', () => {
    // Delete first char, move right, repeat
    const result = feedKeys(['x', 'l', '.']);
    // After x: "ello world", cursor at 0
    // After l: cursor at 1
    // After .: "elo world", cursor at 1
    expect(getLines(result)[0]).toBe('elo world');
  });
});

describe('gg', () => {
  it('gg goes to first line', () => {
    expect(getCursor(feedKeys(['j', 'j', 'g', 'g']))).toEqual({ line: 0, col: 0 });
  });
});

describe('G', () => {
  it('G goes to last line', () => {
    const result = feedKeys(['G']);
    expect(getCursor(result).line).toBe(2);
  });
});
