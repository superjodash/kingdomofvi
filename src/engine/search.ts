import type { Buffer, Cursor } from './types.ts';

/**
 * Search (/pattern, n, N) and find (f, F, t, T, ;, ,) implementations.
 */

export function searchForward(
  buffer: Buffer,
  cursor: Cursor,
  pattern: string,
): Cursor | null {
  if (!pattern) return null;

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, 'g');
  } catch {
    return null;
  }

  const lines = buffer.lines;

  // Search from cursor position forward
  for (let i = cursor.line; i < lines.length; i++) {
    const line = lines[i];
    regex.lastIndex = i === cursor.line ? cursor.col + 1 : 0;
    const match = regex.exec(line);
    if (match) {
      return { line: i, col: match.index };
    }
  }

  // Wrap around
  for (let i = 0; i <= cursor.line; i++) {
    const line = lines[i];
    regex.lastIndex = 0;
    const match = regex.exec(line);
    if (match) {
      if (i === cursor.line && match.index <= cursor.col) continue;
      return { line: i, col: match.index };
    }
  }

  return null;
}

export function searchBackward(
  buffer: Buffer,
  cursor: Cursor,
  pattern: string,
): Cursor | null {
  if (!pattern) return null;

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, 'g');
  } catch {
    return null;
  }

  const lines = buffer.lines;

  // Search backward from cursor
  for (let i = cursor.line; i >= 0; i--) {
    const line = lines[i];
    let lastMatch: RegExpExecArray | null = null;
    regex.lastIndex = 0;
    let match = regex.exec(line);
    while (match) {
      if (i === cursor.line && match.index >= cursor.col) break;
      lastMatch = match;
      match = regex.exec(line);
    }
    if (lastMatch) {
      return { line: i, col: lastMatch.index };
    }
  }

  // Wrap around
  for (let i = lines.length - 1; i >= cursor.line; i--) {
    const line = lines[i];
    let lastMatch: RegExpExecArray | null = null;
    regex.lastIndex = 0;
    let match = regex.exec(line);
    while (match) {
      lastMatch = match;
      match = regex.exec(line);
    }
    if (lastMatch) {
      if (i === cursor.line && lastMatch.index >= cursor.col) continue;
      return { line: i, col: lastMatch.index };
    }
  }

  return null;
}

export function findCharForward(
  buffer: Buffer,
  cursor: Cursor,
  char: string,
  count = 1,
): Cursor | null {
  const line = buffer.lines[cursor.line];
  let col = cursor.col;

  for (let i = 0; i < count; i++) {
    col++;
    while (col < line.length && line[col] !== char) col++;
    if (col >= line.length) return null;
  }

  return { line: cursor.line, col };
}

export function findCharBackward(
  buffer: Buffer,
  cursor: Cursor,
  char: string,
  count = 1,
): Cursor | null {
  const line = buffer.lines[cursor.line];
  let col = cursor.col;

  for (let i = 0; i < count; i++) {
    col--;
    while (col >= 0 && line[col] !== char) col--;
    if (col < 0) return null;
  }

  return { line: cursor.line, col };
}

export function tillCharForward(
  buffer: Buffer,
  cursor: Cursor,
  char: string,
  count = 1,
): Cursor | null {
  const found = findCharForward(buffer, cursor, char, count);
  if (!found) return null;
  return { line: found.line, col: found.col - 1 };
}

export function tillCharBackward(
  buffer: Buffer,
  cursor: Cursor,
  char: string,
  count = 1,
): Cursor | null {
  const found = findCharBackward(buffer, cursor, char, count);
  if (!found) return null;
  return { line: found.line, col: found.col + 1 };
}

export function repeatFindChar(
  buffer: Buffer,
  cursor: Cursor,
  lastFind: { direction: 'f' | 'F' | 't' | 'T'; char: string },
  reverse = false,
): Cursor | null {
  let { direction, char } = lastFind;

  if (reverse) {
    direction = reverseFindDirection(direction);
  }

  switch (direction) {
    case 'f': return findCharForward(buffer, cursor, char);
    case 'F': return findCharBackward(buffer, cursor, char);
    case 't': return tillCharForward(buffer, cursor, char);
    case 'T': return tillCharBackward(buffer, cursor, char);
  }
}

function reverseFindDirection(d: 'f' | 'F' | 't' | 'T'): 'f' | 'F' | 't' | 'T' {
  switch (d) {
    case 'f': return 'F';
    case 'F': return 'f';
    case 't': return 'T';
    case 'T': return 't';
  }
}
