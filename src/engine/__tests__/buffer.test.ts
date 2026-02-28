import { describe, it, expect } from 'vitest';
import {
  createBuffer,
  getLine,
  lineCount,
  insertCharAt,
  deleteCharAt,
  replaceCharAt,
  deleteRange,
  insertTextAt,
  insertLineAfter,
  insertLineBefore,
  deleteLine,
  clampCursor,
  getText,
} from '../buffer.ts';

describe('createBuffer', () => {
  it('splits text into lines', () => {
    const buf = createBuffer('hello\nworld');
    expect(buf.lines).toEqual(['hello', 'world']);
    expect(buf.fileName).toBe('untitled');
    expect(buf.modified).toBe(false);
  });

  it('handles empty string', () => {
    const buf = createBuffer('');
    expect(buf.lines).toEqual(['']);
  });

  it('stores saved snapshot', () => {
    const buf = createBuffer('a\nb');
    expect(buf.savedSnapshot).toEqual(['a', 'b']);
    // Snapshot is a copy, not same reference
    expect(buf.savedSnapshot).not.toBe(buf.lines);
  });

  it('accepts custom filename', () => {
    const buf = createBuffer('x', 'test.txt');
    expect(buf.fileName).toBe('test.txt');
  });
});

describe('getLine', () => {
  it('returns line by index', () => {
    const buf = createBuffer('aaa\nbbb\nccc');
    expect(getLine(buf, 0)).toBe('aaa');
    expect(getLine(buf, 1)).toBe('bbb');
    expect(getLine(buf, 2)).toBe('ccc');
  });

  it('returns empty string for out-of-bounds', () => {
    const buf = createBuffer('x');
    expect(getLine(buf, -1)).toBe('');
    expect(getLine(buf, 5)).toBe('');
  });
});

describe('lineCount', () => {
  it('counts lines correctly', () => {
    expect(lineCount(createBuffer('a\nb\nc'))).toBe(3);
    expect(lineCount(createBuffer(''))).toBe(1);
  });
});

describe('insertCharAt', () => {
  it('inserts character at position', () => {
    const lines = ['hello'];
    expect(insertCharAt(lines, 0, 0, 'X')).toEqual(['Xhello']);
    expect(insertCharAt(lines, 0, 5, '!')).toEqual(['hello!']);
    expect(insertCharAt(lines, 0, 2, '-')).toEqual(['he-llo']);
  });

  it('does not mutate original', () => {
    const lines = ['abc'];
    const result = insertCharAt(lines, 0, 0, 'X');
    expect(lines).toEqual(['abc']);
    expect(result).toEqual(['Xabc']);
  });
});

describe('deleteCharAt', () => {
  it('deletes character at position', () => {
    expect(deleteCharAt(['hello'], 0, 0)).toEqual(['ello']);
    expect(deleteCharAt(['hello'], 0, 4)).toEqual(['hell']);
    expect(deleteCharAt(['hello'], 0, 2)).toEqual(['helo']);
  });

  it('joins lines when deleting at end of line', () => {
    expect(deleteCharAt(['abc', 'def'], 0, 3)).toEqual(['abcdef']);
  });

  it('does nothing when deleting at end of last line', () => {
    expect(deleteCharAt(['abc'], 0, 3)).toEqual(['abc']);
  });
});

describe('replaceCharAt', () => {
  it('replaces character at position', () => {
    expect(replaceCharAt(['hello'], 0, 0, 'H')).toEqual(['Hello']);
    expect(replaceCharAt(['hello'], 0, 4, '!')).toEqual(['hell!']);
  });

  it('does nothing if col is at or beyond line length', () => {
    expect(replaceCharAt(['ab'], 0, 2, 'X')).toEqual(['ab']);
  });
});

describe('deleteRange', () => {
  it('deletes linewise range', () => {
    const lines = ['aaa', 'bbb', 'ccc', 'ddd'];
    const result = deleteRange(lines, {
      start: { line: 1, col: 0 },
      end: { line: 2, col: 0 },
      linewise: true,
      inclusive: false,
    });
    expect(result.lines).toEqual(['aaa', 'ddd']);
    expect(result.deleted).toBe('bbb\nccc');
    expect(result.cursor).toEqual({ line: 1, col: 0 });
  });

  it('handles deleting all lines', () => {
    const result = deleteRange(['only'], {
      start: { line: 0, col: 0 },
      end: { line: 0, col: 0 },
      linewise: true,
      inclusive: false,
    });
    expect(result.lines).toEqual(['']);
  });

  it('deletes characterwise on same line (non-inclusive)', () => {
    const result = deleteRange(['hello world'], {
      start: { line: 0, col: 0 },
      end: { line: 0, col: 5 },
      linewise: false,
      inclusive: false,
    });
    // Non-inclusive: deletes chars 0..4 ("hello"), space at col 5 remains
    expect(result.lines).toEqual([' world']);
    expect(result.deleted).toBe('hello');
  });

  it('deletes inclusive characterwise', () => {
    const result = deleteRange(['abcdef'], {
      start: { line: 0, col: 1 },
      end: { line: 0, col: 3 },
      linewise: false,
      inclusive: true,
    });
    expect(result.lines).toEqual(['aef']);
    expect(result.deleted).toBe('bcd');
  });

  it('deletes multi-line characterwise', () => {
    const lines = ['first line', 'second line', 'third line'];
    const result = deleteRange(lines, {
      start: { line: 0, col: 5 },
      end: { line: 2, col: 5 },
      linewise: false,
      inclusive: false,
    });
    expect(result.lines).toEqual(['first line']);
    expect(result.deleted).toBe(' line\nsecond line\nthird');
  });
});

describe('insertTextAt', () => {
  it('inserts single-line text', () => {
    const result = insertTextAt(['hello'], { line: 0, col: 5 }, ' world');
    expect(result.lines).toEqual(['hello world']);
    expect(result.cursor).toEqual({ line: 0, col: 11 });
  });

  it('inserts multi-line text', () => {
    const result = insertTextAt(['hello'], { line: 0, col: 2 }, 'X\nY\nZ');
    expect(result.lines).toEqual(['heX', 'Y', 'Zllo']);
    expect(result.cursor).toEqual({ line: 2, col: 1 });
  });

  it('inserts at beginning', () => {
    const result = insertTextAt(['abc'], { line: 0, col: 0 }, 'XY');
    expect(result.lines).toEqual(['XYabc']);
    expect(result.cursor).toEqual({ line: 0, col: 2 });
  });
});

describe('insertLineAfter / insertLineBefore', () => {
  it('inserts line after', () => {
    expect(insertLineAfter(['a', 'c'], 0, 'b')).toEqual(['a', 'b', 'c']);
  });

  it('inserts line before', () => {
    expect(insertLineBefore(['b', 'c'], 0, 'a')).toEqual(['a', 'b', 'c']);
  });
});

describe('deleteLine', () => {
  it('deletes a line', () => {
    expect(deleteLine(['a', 'b', 'c'], 1)).toEqual(['a', 'c']);
  });

  it('leaves at least one empty line', () => {
    expect(deleteLine(['only'], 0)).toEqual(['']);
  });
});

describe('clampCursor', () => {
  it('clamps cursor in normal mode (cannot be past last char)', () => {
    const buf = createBuffer('hello');
    expect(clampCursor(buf, { line: 0, col: 10 }, 'normal')).toEqual({
      line: 0,
      col: 4,
    });
  });

  it('allows cursor at end in insert mode', () => {
    const buf = createBuffer('hello');
    expect(clampCursor(buf, { line: 0, col: 5 }, 'insert')).toEqual({
      line: 0,
      col: 5,
    });
  });

  it('clamps line to valid range', () => {
    const buf = createBuffer('a\nb');
    expect(clampCursor(buf, { line: 5, col: 0 }, 'normal')).toEqual({
      line: 1,
      col: 0,
    });
    expect(clampCursor(buf, { line: -1, col: 0 }, 'normal')).toEqual({
      line: 0,
      col: 0,
    });
  });

  it('handles empty line', () => {
    const buf = createBuffer('');
    expect(clampCursor(buf, { line: 0, col: 5 }, 'normal')).toEqual({
      line: 0,
      col: 0,
    });
  });
});

describe('getText', () => {
  it('joins lines with newline', () => {
    const buf = createBuffer('a\nb\nc');
    expect(getText(buf)).toBe('a\nb\nc');
  });
});
