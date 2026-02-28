import { describe, it, expect } from 'vitest';
import { createBuffer } from '../buffer.ts';
import { textObjectRange, innerWord, aWord } from '../textObjects.ts';

describe('innerWord', () => {
  it('selects word under cursor', () => {
    const buf = createBuffer('hello world');
    const range = innerWord(buf, { line: 0, col: 2 });
    expect(range).not.toBeNull();
    expect(range!.start).toEqual({ line: 0, col: 0 });
    expect(range!.end).toEqual({ line: 0, col: 4 });
  });

  it('selects whitespace when on whitespace', () => {
    const buf = createBuffer('hello   world');
    const range = innerWord(buf, { line: 0, col: 6 });
    expect(range).not.toBeNull();
    expect(range!.start.col).toBe(5);
    expect(range!.end.col).toBe(7);
  });

  it('returns null on empty line', () => {
    const buf = createBuffer('');
    expect(innerWord(buf, { line: 0, col: 0 })).toBeNull();
  });
});

describe('aWord', () => {
  it('includes trailing whitespace', () => {
    const buf = createBuffer('hello world');
    const range = aWord(buf, { line: 0, col: 2 });
    expect(range).not.toBeNull();
    expect(range!.start).toEqual({ line: 0, col: 0 });
    expect(range!.end.col).toBe(5); // includes the space
  });
});

describe('textObjectRange', () => {
  it('handles i" for quoted strings', () => {
    const buf = createBuffer('say "hello" please');
    const range = textObjectRange(buf, { line: 0, col: 6 }, 'i"');
    expect(range).not.toBeNull();
    expect(range!.start.col).toBe(5);
    expect(range!.end.col).toBe(9);
  });

  it('handles a" including quotes', () => {
    const buf = createBuffer('say "hello" please');
    const range = textObjectRange(buf, { line: 0, col: 6 }, 'a"');
    expect(range).not.toBeNull();
    expect(range!.start.col).toBe(4);
    expect(range!.end.col).toBe(10);
  });

  it('handles i) for parentheses', () => {
    const buf = createBuffer('foo(bar, baz)');
    const range = textObjectRange(buf, { line: 0, col: 5 }, 'i)');
    expect(range).not.toBeNull();
    expect(range!.start.col).toBe(4);
    expect(range!.end.col).toBe(11);
  });

  it('handles a) including parens', () => {
    const buf = createBuffer('foo(bar, baz)');
    const range = textObjectRange(buf, { line: 0, col: 5 }, 'a)');
    expect(range).not.toBeNull();
    expect(range!.start.col).toBe(3);
    expect(range!.end.col).toBe(12);
  });

  it('handles i] for brackets', () => {
    const buf = createBuffer('arr[1, 2, 3]');
    const range = textObjectRange(buf, { line: 0, col: 5 }, 'i]');
    expect(range).not.toBeNull();
    expect(range!.start.col).toBe(4);
    expect(range!.end.col).toBe(10);
  });

  it('returns null for unknown object', () => {
    const buf = createBuffer('hello');
    expect(textObjectRange(buf, { line: 0, col: 0 }, 'iz')).toBeNull();
  });

  it('returns null when no surrounding pair', () => {
    const buf = createBuffer('no quotes here');
    expect(textObjectRange(buf, { line: 0, col: 3 }, 'i"')).toBeNull();
  });
});
