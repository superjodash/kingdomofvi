import type { Buffer, Cursor, Mode, Range } from './types.ts';

export function createBuffer(text: string, fileName = 'untitled'): Buffer {
  const lines = text === '' ? [''] : text.split('\n');
  return {
    lines,
    fileName,
    modified: false,
    savedSnapshot: [...lines],
  };
}

export function getLine(buffer: Buffer, lineNum: number): string {
  if (lineNum < 0 || lineNum >= buffer.lines.length) return '';
  return buffer.lines[lineNum];
}

export function lineCount(buffer: Buffer): number {
  return buffer.lines.length;
}

export function insertCharAt(
  lines: string[],
  line: number,
  col: number,
  char: string,
): string[] {
  const result = [...lines];
  const l = result[line];
  result[line] = l.slice(0, col) + char + l.slice(col);
  return result;
}

export function deleteCharAt(
  lines: string[],
  line: number,
  col: number,
): string[] {
  const result = [...lines];
  const l = result[line];
  if (col < l.length) {
    result[line] = l.slice(0, col) + l.slice(col + 1);
  } else if (line + 1 < result.length) {
    // Join with next line
    result[line] = l + result[line + 1];
    result.splice(line + 1, 1);
  }
  return result;
}

export function replaceCharAt(
  lines: string[],
  line: number,
  col: number,
  char: string,
): string[] {
  const result = [...lines];
  const l = result[line];
  if (col < l.length) {
    result[line] = l.slice(0, col) + char + l.slice(col + 1);
  }
  return result;
}

export function deleteRange(
  lines: string[],
  range: Range,
): { lines: string[]; cursor: Cursor; deleted: string } {
  const result = [...lines];
  const { start, end, linewise } = range;

  if (linewise) {
    const deleted = result.slice(start.line, end.line + 1).join('\n');
    result.splice(start.line, end.line - start.line + 1);
    if (result.length === 0) result.push('');
    const cursorLine = Math.min(start.line, result.length - 1);
    return {
      lines: result,
      cursor: { line: cursorLine, col: 0 },
      deleted,
    };
  }

  // Characterwise
  if (start.line === end.line) {
    const l = result[start.line];
    const endCol = range.inclusive ? end.col + 1 : end.col;
    const deleted = l.slice(start.col, endCol);
    result[start.line] = l.slice(0, start.col) + l.slice(endCol);
    const col = Math.min(start.col, Math.max(0, result[start.line].length - 1));
    return { lines: result, cursor: { line: start.line, col }, deleted };
  }

  // Multi-line characterwise
  const firstLine = result[start.line];
  const lastLine = result[end.line];
  const endCol = range.inclusive ? end.col + 1 : end.col;
  const deletedParts: string[] = [firstLine.slice(start.col)];
  for (let i = start.line + 1; i < end.line; i++) {
    deletedParts.push(result[i]);
  }
  deletedParts.push(lastLine.slice(0, endCol));
  const deleted = deletedParts.join('\n');

  const merged = firstLine.slice(0, start.col) + lastLine.slice(endCol);
  result.splice(start.line, end.line - start.line + 1, merged);
  if (result.length === 0) result.push('');
  const col = Math.min(start.col, Math.max(0, result[start.line].length - 1));
  return { lines: result, cursor: { line: start.line, col }, deleted };
}

export function insertTextAt(
  lines: string[],
  cursor: Cursor,
  text: string,
): { lines: string[]; cursor: Cursor } {
  const result = [...lines];
  const l = result[cursor.line];
  const before = l.slice(0, cursor.col);
  const after = l.slice(cursor.col);

  const parts = text.split('\n');
  if (parts.length === 1) {
    result[cursor.line] = before + parts[0] + after;
    return {
      lines: result,
      cursor: { line: cursor.line, col: cursor.col + parts[0].length },
    };
  }

  const newLines: string[] = [];
  newLines.push(before + parts[0]);
  for (let i = 1; i < parts.length - 1; i++) {
    newLines.push(parts[i]);
  }
  newLines.push(parts[parts.length - 1] + after);
  result.splice(cursor.line, 1, ...newLines);

  return {
    lines: result,
    cursor: {
      line: cursor.line + parts.length - 1,
      col: parts[parts.length - 1].length,
    },
  };
}

export function insertLineAfter(
  lines: string[],
  afterLine: number,
  text: string,
): string[] {
  const result = [...lines];
  result.splice(afterLine + 1, 0, text);
  return result;
}

export function insertLineBefore(
  lines: string[],
  beforeLine: number,
  text: string,
): string[] {
  const result = [...lines];
  result.splice(beforeLine, 0, text);
  return result;
}

export function deleteLine(lines: string[], lineNum: number): string[] {
  const result = [...lines];
  result.splice(lineNum, 1);
  if (result.length === 0) result.push('');
  return result;
}

export function clampCursor(buffer: Buffer, cursor: Cursor, mode: Mode): Cursor {
  const maxLine = Math.max(0, buffer.lines.length - 1);
  const line = Math.max(0, Math.min(cursor.line, maxLine));
  const lineLen = buffer.lines[line].length;

  let maxCol: number;
  if (mode === 'insert') {
    maxCol = lineLen; // can be one past last char
  } else {
    maxCol = Math.max(0, lineLen - 1); // can't be past last char
  }
  if (lineLen === 0) {
    return { line, col: 0 };
  }
  const col = Math.max(0, Math.min(cursor.col, maxCol));
  return { line, col };
}

export function getText(buffer: Buffer): string {
  return buffer.lines.join('\n');
}
