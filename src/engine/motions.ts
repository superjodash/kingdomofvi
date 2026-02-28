import type { Buffer, Cursor, Range } from './types.ts';

/**
 * Basic motions: h, j, k, l, 0, ^, $, gg, G, w, b, e, W, B, E
 * Each motion returns a new cursor position and optionally a range for operators.
 */

// --- Character motions ---

export function moveLeft(_buffer: Buffer, cursor: Cursor, count = 1): Cursor {
  const col = Math.max(0, cursor.col - count);
  return { line: cursor.line, col };
}

export function moveDown(buffer: Buffer, cursor: Cursor, count = 1): Cursor {
  const maxLine = buffer.lines.length - 1;
  const line = Math.min(maxLine, cursor.line + count);
  const lineLen = buffer.lines[line].length;
  const col = Math.min(cursor.col, Math.max(0, lineLen - 1));
  return { line, col };
}

export function moveUp(buffer: Buffer, cursor: Cursor, count = 1): Cursor {
  const line = Math.max(0, cursor.line - count);
  const lineLen = buffer.lines[line].length;
  const col = Math.min(cursor.col, Math.max(0, lineLen - 1));
  return { line, col };
}

export function moveRight(buffer: Buffer, cursor: Cursor, count = 1): Cursor {
  const lineLen = buffer.lines[cursor.line].length;
  const maxCol = Math.max(0, lineLen - 1);
  const col = Math.min(maxCol, cursor.col + count);
  return { line: cursor.line, col };
}

// --- Line motions ---

export function moveToLineStart(_buffer: Buffer, cursor: Cursor): Cursor {
  return { line: cursor.line, col: 0 };
}

export function moveToFirstNonBlank(buffer: Buffer, cursor: Cursor): Cursor {
  const line = buffer.lines[cursor.line];
  const match = line.match(/\S/);
  const col = match ? line.indexOf(match[0]) : 0;
  return { line: cursor.line, col };
}

export function moveToLineEnd(buffer: Buffer, cursor: Cursor): Cursor {
  const lineLen = buffer.lines[cursor.line].length;
  const col = Math.max(0, lineLen - 1);
  return { line: cursor.line, col };
}

// --- File motions ---

export function moveToFileStart(_buffer: Buffer, _cursor: Cursor): Cursor {
  return { line: 0, col: 0 };
}

export function moveToFileEnd(buffer: Buffer, _cursor: Cursor): Cursor {
  const lastLine = buffer.lines.length - 1;
  const line = buffer.lines[lastLine];
  const match = line.match(/\S/);
  const col = match ? line.indexOf(match[0]) : 0;
  return { line: lastLine, col };
}

export function moveToLine(buffer: Buffer, lineNum: number): Cursor {
  const line = Math.max(0, Math.min(lineNum, buffer.lines.length - 1));
  const text = buffer.lines[line];
  const match = text.match(/\S/);
  const col = match ? text.indexOf(match[0]) : 0;
  return { line, col };
}

// --- Word motions ---

function isWordChar(ch: string): boolean {
  return /\w/.test(ch);
}

function isWhitespace(ch: string): boolean {
  return /\s/.test(ch);
}

function isBigWordChar(ch: string): boolean {
  return !isWhitespace(ch);
}

export function moveWordForward(
  buffer: Buffer,
  cursor: Cursor,
  count = 1,
): Cursor {
  let { line, col } = cursor;
  for (let i = 0; i < count; i++) {
    const result = nextWordStart(buffer, line, col);
    line = result.line;
    col = result.col;
  }
  return { line, col };
}

function nextWordStart(
  buffer: Buffer,
  line: number,
  col: number,
): Cursor {
  const lines = buffer.lines;
  const maxLine = lines.length - 1;

  if (line > maxLine) return { line: maxLine, col: Math.max(0, lines[maxLine].length - 1) };

  const text = lines[line];

  // Skip current word characters
  if (col < text.length) {
    const startChar = text[col];
    if (isWordChar(startChar)) {
      while (col < text.length && isWordChar(text[col])) col++;
    } else if (!isWhitespace(startChar)) {
      while (col < text.length && !isWordChar(text[col]) && !isWhitespace(text[col])) col++;
    }
  }

  // Skip whitespace
  while (col < text.length && isWhitespace(text[col])) col++;

  // If we're past end of line, move to next line's first non-blank
  if (col >= text.length) {
    line++;
    while (line <= maxLine && lines[line].length === 0) line++;
    if (line > maxLine) return { line: maxLine, col: Math.max(0, lines[maxLine].length - 1) };
    const nextText = lines[line];
    col = 0;
    while (col < nextText.length && isWhitespace(nextText[col])) col++;
    if (col >= nextText.length) col = 0;
  }

  return { line, col };
}

export function moveWordBackward(
  buffer: Buffer,
  cursor: Cursor,
  count = 1,
): Cursor {
  let { line, col } = cursor;
  for (let i = 0; i < count; i++) {
    const result = prevWordStart(buffer, line, col);
    line = result.line;
    col = result.col;
  }
  return { line, col };
}

function prevWordStart(
  buffer: Buffer,
  line: number,
  col: number,
): Cursor {
  const lines = buffer.lines;

  // Move back one if possible
  if (col > 0) {
    col--;
  } else if (line > 0) {
    line--;
    col = Math.max(0, lines[line].length - 1);
  } else {
    return { line: 0, col: 0 };
  }

  const text = lines[line];

  // Skip whitespace backward
  while (col >= 0 && isWhitespace(text[col])) {
    col--;
  }

  if (col < 0) {
    if (line > 0) {
      line--;
      col = Math.max(0, lines[line].length - 1);
      return prevWordStart(buffer, line, col + 1);
    }
    return { line: 0, col: 0 };
  }

  // Find start of current word
  const ch = text[col];
  if (isWordChar(ch)) {
    while (col > 0 && isWordChar(text[col - 1])) col--;
  } else {
    while (col > 0 && !isWordChar(text[col - 1]) && !isWhitespace(text[col - 1])) col--;
  }

  return { line, col };
}

export function moveWordEnd(
  buffer: Buffer,
  cursor: Cursor,
  count = 1,
): Cursor {
  let { line, col } = cursor;
  for (let i = 0; i < count; i++) {
    const result = nextWordEnd(buffer, line, col);
    line = result.line;
    col = result.col;
  }
  return { line, col };
}

function nextWordEnd(
  buffer: Buffer,
  line: number,
  col: number,
): Cursor {
  const lines = buffer.lines;
  const maxLine = lines.length - 1;

  // Move forward one
  col++;
  if (col >= lines[line].length) {
    line++;
    col = 0;
    while (line <= maxLine && lines[line].length === 0) line++;
    if (line > maxLine) return { line: maxLine, col: Math.max(0, lines[maxLine].length - 1) };
  }

  const text = lines[line];

  // Skip whitespace
  while (col < text.length && isWhitespace(text[col])) col++;

  if (col >= text.length) {
    line++;
    while (line <= maxLine && lines[line].length === 0) line++;
    if (line > maxLine) return { line: maxLine, col: Math.max(0, lines[maxLine].length - 1) };
    col = 0;
    const nextText = lines[line];
    while (col < nextText.length && isWhitespace(nextText[col])) col++;
  }

  // Find end of current word
  const lineText = lines[line];
  const ch = lineText[col];
  if (isWordChar(ch)) {
    while (col + 1 < lineText.length && isWordChar(lineText[col + 1])) col++;
  } else if (!isWhitespace(ch)) {
    while (col + 1 < lineText.length && !isWordChar(lineText[col + 1]) && !isWhitespace(lineText[col + 1])) col++;
  }

  return { line, col };
}

// --- WORD motions (space-delimited) ---

export function moveBigWordForward(
  buffer: Buffer,
  cursor: Cursor,
  count = 1,
): Cursor {
  let { line, col } = cursor;
  for (let i = 0; i < count; i++) {
    const result = nextBigWordStart(buffer, line, col);
    line = result.line;
    col = result.col;
  }
  return { line, col };
}

function nextBigWordStart(
  buffer: Buffer,
  line: number,
  col: number,
): Cursor {
  const lines = buffer.lines;
  const maxLine = lines.length - 1;

  const text = lines[line];

  // Skip current WORD characters
  while (col < text.length && isBigWordChar(text[col])) col++;

  // Skip whitespace
  while (col < text.length && isWhitespace(text[col])) col++;

  if (col >= text.length) {
    line++;
    while (line <= maxLine && lines[line].length === 0) line++;
    if (line > maxLine) return { line: maxLine, col: Math.max(0, lines[maxLine].length - 1) };
    col = 0;
    const nextText = lines[line];
    while (col < nextText.length && isWhitespace(nextText[col])) col++;
  }

  return { line, col };
}

export function moveBigWordBackward(
  buffer: Buffer,
  cursor: Cursor,
  count = 1,
): Cursor {
  let { line, col } = cursor;
  for (let i = 0; i < count; i++) {
    const result = prevBigWordStart(buffer, line, col);
    line = result.line;
    col = result.col;
  }
  return { line, col };
}

function prevBigWordStart(
  buffer: Buffer,
  line: number,
  col: number,
): Cursor {
  const lines = buffer.lines;

  if (col > 0) {
    col--;
  } else if (line > 0) {
    line--;
    col = Math.max(0, lines[line].length - 1);
  } else {
    return { line: 0, col: 0 };
  }

  const text = lines[line];

  // Skip whitespace backward
  while (col >= 0 && isWhitespace(text[col])) col--;

  if (col < 0) {
    if (line > 0) {
      line--;
      col = Math.max(0, lines[line].length - 1);
      return prevBigWordStart(buffer, line, col + 1);
    }
    return { line: 0, col: 0 };
  }

  // Find start of WORD
  while (col > 0 && isBigWordChar(text[col - 1])) col--;

  return { line, col };
}

export function moveBigWordEnd(
  buffer: Buffer,
  cursor: Cursor,
  count = 1,
): Cursor {
  let { line, col } = cursor;
  for (let i = 0; i < count; i++) {
    const result = nextBigWordEnd(buffer, line, col);
    line = result.line;
    col = result.col;
  }
  return { line, col };
}

function nextBigWordEnd(
  buffer: Buffer,
  line: number,
  col: number,
): Cursor {
  const lines = buffer.lines;
  const maxLine = lines.length - 1;

  col++;
  if (col >= lines[line].length) {
    line++;
    col = 0;
    while (line <= maxLine && lines[line].length === 0) line++;
    if (line > maxLine) return { line: maxLine, col: Math.max(0, lines[maxLine].length - 1) };
  }

  const text = lines[line];

  // Skip whitespace
  while (col < text.length && isWhitespace(text[col])) col++;

  if (col >= text.length) {
    line++;
    while (line <= maxLine && lines[line].length === 0) line++;
    if (line > maxLine) return { line: maxLine, col: Math.max(0, lines[maxLine].length - 1) };
    col = 0;
    const nextText = lines[line];
    while (col < nextText.length && isWhitespace(nextText[col])) col++;
  }

  // Find end of WORD
  const lineText = lines[line];
  while (col + 1 < lineText.length && isBigWordChar(lineText[col + 1])) col++;

  return { line, col };
}

// --- Motion range helpers for operator-pending ---

export function motionRange(
  buffer: Buffer,
  cursor: Cursor,
  motionName: string,
  count: number,
): Range | null {
  let target: Cursor;
  let inclusive = false;
  let linewise = false;

  switch (motionName) {
    case 'h':
      target = moveLeft(buffer, cursor, count);
      break;
    case 'l':
      target = moveRight(buffer, cursor, count);
      inclusive = true;
      break;
    case 'j':
      target = moveDown(buffer, cursor, count);
      linewise = true;
      break;
    case 'k':
      target = moveUp(buffer, cursor, count);
      linewise = true;
      break;
    case '0':
      target = moveToLineStart(buffer, cursor);
      break;
    case '^':
      target = moveToFirstNonBlank(buffer, cursor);
      break;
    case '$':
      target = moveToLineEnd(buffer, cursor);
      inclusive = true;
      break;
    case 'gg':
      target = moveToFileStart(buffer, cursor);
      linewise = true;
      break;
    case 'G':
      target = moveToFileEnd(buffer, cursor);
      linewise = true;
      break;
    case 'w':
      target = moveWordForward(buffer, cursor, count);
      break;
    case 'b':
      target = moveWordBackward(buffer, cursor, count);
      break;
    case 'e':
      target = moveWordEnd(buffer, cursor, count);
      inclusive = true;
      break;
    case 'W':
      target = moveBigWordForward(buffer, cursor, count);
      break;
    case 'B':
      target = moveBigWordBackward(buffer, cursor, count);
      break;
    case 'E':
      target = moveBigWordEnd(buffer, cursor, count);
      inclusive = true;
      break;
    default:
      return null;
  }

  const [start, end] = compareCursors(cursor, target) <= 0
    ? [cursor, target]
    : [target, cursor];

  return { start, end, linewise, inclusive };
}

export function compareCursors(a: Cursor, b: Cursor): number {
  if (a.line !== b.line) return a.line - b.line;
  return a.col - b.col;
}
