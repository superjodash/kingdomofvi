import { describe, it, expect } from 'vitest';
import { createBuffer } from '../buffer.ts';
import {
  moveLeft, moveRight, moveUp, moveDown,
  moveToLineStart, moveToFirstNonBlank, moveToLineEnd,
  moveToFileStart, moveToFileEnd, moveToLine,
  moveWordForward, moveWordBackward, moveWordEnd,
  moveBigWordForward, moveBigWordBackward, moveBigWordEnd,
  motionRange, compareCursors,
} from '../motions.ts';

const buf = createBuffer('hello world\n  foo bar\nbaz');

describe('character motions', () => {
  it('moveLeft clamps at 0', () => {
    expect(moveLeft(buf, { line: 0, col: 3 })).toEqual({ line: 0, col: 2 });
    expect(moveLeft(buf, { line: 0, col: 0 })).toEqual({ line: 0, col: 0 });
  });

  it('moveLeft with count', () => {
    expect(moveLeft(buf, { line: 0, col: 5 }, 3)).toEqual({ line: 0, col: 2 });
  });

  it('moveRight clamps at line end', () => {
    expect(moveRight(buf, { line: 0, col: 3 })).toEqual({ line: 0, col: 4 });
    expect(moveRight(buf, { line: 0, col: 10 })).toEqual({ line: 0, col: 10 });
  });

  it('moveDown clamps at last line', () => {
    expect(moveDown(buf, { line: 0, col: 0 })).toEqual({ line: 1, col: 0 });
    expect(moveDown(buf, { line: 2, col: 0 })).toEqual({ line: 2, col: 0 });
  });

  it('moveDown adjusts col to shorter line', () => {
    expect(moveDown(buf, { line: 0, col: 10 })).toEqual({ line: 1, col: 8 });
  });

  it('moveUp clamps at 0', () => {
    expect(moveUp(buf, { line: 1, col: 0 })).toEqual({ line: 0, col: 0 });
    expect(moveUp(buf, { line: 0, col: 0 })).toEqual({ line: 0, col: 0 });
  });
});

describe('line motions', () => {
  it('moveToLineStart goes to col 0', () => {
    expect(moveToLineStart(buf, { line: 1, col: 5 })).toEqual({ line: 1, col: 0 });
  });

  it('moveToFirstNonBlank skips whitespace', () => {
    expect(moveToFirstNonBlank(buf, { line: 1, col: 0 })).toEqual({ line: 1, col: 2 });
  });

  it('moveToLineEnd goes to last char', () => {
    expect(moveToLineEnd(buf, { line: 0, col: 0 })).toEqual({ line: 0, col: 10 });
  });
});

describe('file motions', () => {
  it('moveToFileStart goes to 0,0', () => {
    expect(moveToFileStart(buf, { line: 2, col: 1 })).toEqual({ line: 0, col: 0 });
  });

  it('moveToFileEnd goes to last line', () => {
    const result = moveToFileEnd(buf, { line: 0, col: 0 });
    expect(result.line).toBe(2);
  });

  it('moveToLine clamps to valid range', () => {
    expect(moveToLine(buf, 1).line).toBe(1);
    expect(moveToLine(buf, 100).line).toBe(2);
  });
});

describe('word motions', () => {
  const wordBuf = createBuffer('hello world\nfoo-bar baz');

  it('moveWordForward advances to next word', () => {
    const result = moveWordForward(wordBuf, { line: 0, col: 0 });
    expect(result).toEqual({ line: 0, col: 6 });
  });

  it('moveWordForward with count', () => {
    const result = moveWordForward(wordBuf, { line: 0, col: 0 }, 2);
    expect(result.line).toBe(1);
  });

  it('moveWordBackward goes to previous word start', () => {
    const result = moveWordBackward(wordBuf, { line: 0, col: 8 });
    expect(result).toEqual({ line: 0, col: 6 });
  });

  it('moveWordEnd goes to end of current/next word', () => {
    const result = moveWordEnd(wordBuf, { line: 0, col: 0 });
    expect(result).toEqual({ line: 0, col: 4 });
  });
});

describe('WORD motions', () => {
  const wordBuf = createBuffer('foo-bar baz');

  it('moveBigWordForward skips non-whitespace', () => {
    const result = moveBigWordForward(wordBuf, { line: 0, col: 0 });
    expect(result).toEqual({ line: 0, col: 8 });
  });

  it('moveBigWordBackward goes back to WORD start', () => {
    const result = moveBigWordBackward(wordBuf, { line: 0, col: 9 });
    expect(result).toEqual({ line: 0, col: 8 });
  });

  it('moveBigWordEnd goes to end of WORD', () => {
    const result = moveBigWordEnd(wordBuf, { line: 0, col: 0 });
    expect(result).toEqual({ line: 0, col: 6 });
  });
});

describe('motionRange', () => {
  it('returns linewise range for j', () => {
    const range = motionRange(buf, { line: 0, col: 0 }, 'j', 1);
    expect(range).not.toBeNull();
    expect(range!.linewise).toBe(true);
  });

  it('returns inclusive range for $', () => {
    const range = motionRange(buf, { line: 0, col: 0 }, '$', 1);
    expect(range!.inclusive).toBe(true);
  });

  it('returns null for unknown motion', () => {
    expect(motionRange(buf, { line: 0, col: 0 }, 'z', 1)).toBeNull();
  });
});

describe('compareCursors', () => {
  it('compares by line first', () => {
    expect(compareCursors({ line: 0, col: 5 }, { line: 1, col: 0 })).toBeLessThan(0);
  });

  it('compares by col on same line', () => {
    expect(compareCursors({ line: 0, col: 5 }, { line: 0, col: 3 })).toBeGreaterThan(0);
  });

  it('returns 0 for equal', () => {
    expect(compareCursors({ line: 1, col: 2 }, { line: 1, col: 2 })).toBe(0);
  });
});
