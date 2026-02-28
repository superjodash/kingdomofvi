import type { Buffer, Cursor, Range } from './types.ts';

/**
 * Text objects: iw, aw, i", a", i), a), i], a]
 * Each returns a Range for use by operators.
 */

function isWordChar(ch: string): boolean {
  return /\w/.test(ch);
}

function isWhitespace(ch: string): boolean {
  return /\s/.test(ch);
}

export function innerWord(buffer: Buffer, cursor: Cursor): Range | null {
  const line = buffer.lines[cursor.line];
  if (line.length === 0) return null;

  const col = cursor.col;
  const ch = line[col];

  let start = col;
  let end = col;

  if (isWordChar(ch)) {
    while (start > 0 && isWordChar(line[start - 1])) start--;
    while (end < line.length - 1 && isWordChar(line[end + 1])) end++;
  } else if (isWhitespace(ch)) {
    while (start > 0 && isWhitespace(line[start - 1])) start--;
    while (end < line.length - 1 && isWhitespace(line[end + 1])) end++;
  } else {
    // Punctuation
    while (start > 0 && !isWordChar(line[start - 1]) && !isWhitespace(line[start - 1])) start--;
    while (end < line.length - 1 && !isWordChar(line[end + 1]) && !isWhitespace(line[end + 1])) end++;
  }

  return {
    start: { line: cursor.line, col: start },
    end: { line: cursor.line, col: end },
    linewise: false,
    inclusive: true,
  };
}

export function aWord(buffer: Buffer, cursor: Cursor): Range | null {
  const inner = innerWord(buffer, cursor);
  if (!inner) return null;

  const line = buffer.lines[cursor.line];
  let { start, end } = inner;

  // Include trailing whitespace, or leading if at end
  if (end.col < line.length - 1 && isWhitespace(line[end.col + 1])) {
    let e = end.col + 1;
    while (e < line.length - 1 && isWhitespace(line[e + 1])) e++;
    return { start, end: { line: cursor.line, col: e }, linewise: false, inclusive: true };
  }

  if (start.col > 0 && isWhitespace(line[start.col - 1])) {
    let s = start.col - 1;
    while (s > 0 && isWhitespace(line[s - 1])) s--;
    return { start: { line: cursor.line, col: s }, end, linewise: false, inclusive: true };
  }

  return { start, end, linewise: false, inclusive: true };
}

// Generic pair matcher for quotes, parens, brackets
function findPairRange(
  buffer: Buffer,
  cursor: Cursor,
  open: string,
  close: string,
  inner: boolean,
): Range | null {
  const line = buffer.lines[cursor.line];

  if (open === close) {
    // For quotes: find surrounding pair on same line
    return findQuoteRange(line, cursor, open, inner);
  }

  // For brackets: search outward
  return findBracketRange(buffer, cursor, open, close, inner);
}

function findQuoteRange(
  line: string,
  cursor: Cursor,
  quote: string,
  inner: boolean,
): Range | null {
  const positions: number[] = [];
  for (let i = 0; i < line.length; i++) {
    if (line[i] === quote && (i === 0 || line[i - 1] !== '\\')) {
      positions.push(i);
    }
  }

  // Find the pair that surrounds the cursor
  for (let i = 0; i < positions.length - 1; i += 2) {
    const openPos = positions[i];
    const closePos = positions[i + 1];
    if (cursor.col >= openPos && cursor.col <= closePos) {
      if (inner) {
        return {
          start: { line: cursor.line, col: openPos + 1 },
          end: { line: cursor.line, col: closePos - 1 },
          linewise: false,
          inclusive: true,
        };
      }
      return {
        start: { line: cursor.line, col: openPos },
        end: { line: cursor.line, col: closePos },
        linewise: false,
        inclusive: true,
      };
    }
  }

  return null;
}

function findBracketRange(
  buffer: Buffer,
  cursor: Cursor,
  open: string,
  close: string,
  inner: boolean,
): Range | null {
  // Search backward for opening bracket
  let depth = 0;
  let openPos: Cursor | null = null;

  for (let line = cursor.line; line >= 0; line--) {
    const text = buffer.lines[line];
    const startCol = line === cursor.line ? cursor.col : text.length - 1;
    for (let col = startCol; col >= 0; col--) {
      if (text[col] === close && !(line === cursor.line && col === cursor.col)) depth++;
      if (text[col] === open) {
        if (depth === 0) {
          openPos = { line, col };
          break;
        }
        depth--;
      }
    }
    if (openPos) break;
  }

  if (!openPos) return null;

  // Search forward for closing bracket
  depth = 0;
  let closePos: Cursor | null = null;

  for (let line = cursor.line; line < buffer.lines.length; line++) {
    const text = buffer.lines[line];
    const startCol = line === cursor.line ? cursor.col : 0;
    for (let col = startCol; col < text.length; col++) {
      if (text[col] === open && !(line === openPos.line && col === openPos.col)) depth++;
      if (text[col] === close) {
        if (depth === 0) {
          closePos = { line, col };
          break;
        }
        depth--;
      }
    }
    if (closePos) break;
  }

  if (!closePos) return null;

  if (inner) {
    return {
      start: { line: openPos.line, col: openPos.col + 1 },
      end: { line: closePos.line, col: closePos.col - 1 },
      linewise: false,
      inclusive: true,
    };
  }

  return {
    start: openPos,
    end: closePos,
    linewise: false,
    inclusive: true,
  };
}

export function textObjectRange(
  buffer: Buffer,
  cursor: Cursor,
  objectName: string,
): Range | null {
  switch (objectName) {
    case 'iw': return innerWord(buffer, cursor);
    case 'aw': return aWord(buffer, cursor);
    case 'i"': return findPairRange(buffer, cursor, '"', '"', true);
    case 'a"': return findPairRange(buffer, cursor, '"', '"', false);
    case 'i)': return findPairRange(buffer, cursor, '(', ')', true);
    case 'a)': return findPairRange(buffer, cursor, '(', ')', false);
    case 'i]': return findPairRange(buffer, cursor, '[', ']', true);
    case 'a]': return findPairRange(buffer, cursor, '[', ']', false);
    default: return null;
  }
}
