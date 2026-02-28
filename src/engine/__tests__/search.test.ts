import { describe, it, expect } from 'vitest';
import { createBuffer } from '../buffer.ts';
import {
  searchForward,
  searchBackward,
  findCharForward,
  findCharBackward,
  tillCharForward,
  tillCharBackward,
  repeatFindChar,
} from '../search.ts';

const buf = createBuffer('hello world\nfoo bar baz\nhello again');

describe('searchForward', () => {
  it('finds pattern after cursor', () => {
    const result = searchForward(buf, { line: 0, col: 0 }, 'world');
    expect(result).toEqual({ line: 0, col: 6 });
  });

  it('wraps around to beginning', () => {
    const result = searchForward(buf, { line: 2, col: 0 }, 'foo');
    expect(result).toEqual({ line: 1, col: 0 });
  });

  it('returns null if not found', () => {
    expect(searchForward(buf, { line: 0, col: 0 }, 'zzz')).toBeNull();
  });

  it('returns null for empty pattern', () => {
    expect(searchForward(buf, { line: 0, col: 0 }, '')).toBeNull();
  });

  it('handles regex pattern', () => {
    const result = searchForward(buf, { line: 0, col: 0 }, 'b.r');
    expect(result).toEqual({ line: 1, col: 4 });
  });
});

describe('searchBackward', () => {
  it('finds pattern before cursor', () => {
    const result = searchBackward(buf, { line: 0, col: 10 }, 'hello');
    expect(result).toEqual({ line: 0, col: 0 });
  });

  it('wraps around to end', () => {
    const result = searchBackward(buf, { line: 0, col: 0 }, 'again');
    expect(result).toEqual({ line: 2, col: 6 });
  });
});

describe('findCharForward', () => {
  it('finds next occurrence of char', () => {
    const result = findCharForward(buf, { line: 0, col: 0 }, 'o');
    expect(result).toEqual({ line: 0, col: 4 });
  });

  it('returns null if char not found', () => {
    expect(findCharForward(buf, { line: 0, col: 0 }, 'z')).toBeNull();
  });

  it('supports count', () => {
    const result = findCharForward(buf, { line: 0, col: 0 }, 'l', 2);
    expect(result).toEqual({ line: 0, col: 3 });
  });
});

describe('findCharBackward', () => {
  it('finds previous occurrence of char', () => {
    const result = findCharBackward(buf, { line: 0, col: 10 }, 'o');
    expect(result).toEqual({ line: 0, col: 7 });
  });

  it('returns null if not found', () => {
    expect(findCharBackward(buf, { line: 0, col: 0 }, 'z')).toBeNull();
  });
});

describe('tillCharForward', () => {
  it('stops one before the char', () => {
    const result = tillCharForward(buf, { line: 0, col: 0 }, 'o');
    expect(result).toEqual({ line: 0, col: 3 });
  });
});

describe('tillCharBackward', () => {
  it('stops one after the char', () => {
    const result = tillCharBackward(buf, { line: 0, col: 10 }, 'o');
    expect(result).toEqual({ line: 0, col: 8 });
  });
});

describe('repeatFindChar', () => {
  it('repeats forward find', () => {
    const result = repeatFindChar(buf, { line: 0, col: 4 }, { direction: 'f', char: 'o' });
    expect(result).toEqual({ line: 0, col: 7 });
  });

  it('reverses direction', () => {
    const result = repeatFindChar(buf, { line: 0, col: 7 }, { direction: 'f', char: 'o' }, true);
    expect(result).toEqual({ line: 0, col: 4 });
  });
});
