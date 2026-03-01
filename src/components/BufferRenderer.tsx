import type { Cursor, Mode, Selection } from '../engine/types.ts';

/**
 * Character-grid renderer for vim buffers.
 * Each character is a <span>, cursor and selection are overlaid.
 */

interface BufferRendererProps {
  lines: string[];
  cursor: Cursor;
  mode: Mode;
  selection: Selection | null;
}

const VISIBLE_ROWS = 30;

export function BufferRenderer({ lines, cursor, mode, selection }: BufferRendererProps) {
  const selRange = selection ? normalizeSelection(selection, mode) : null;
  const tildeRows = Math.max(0, VISIBLE_ROWS - lines.length);

  return (
    <div className="font-mono text-sm leading-5 w-[80ch]">
      {lines.map((line, lineIdx) => (
        <div key={lineIdx} className="buffer-line whitespace-pre h-5">
          {renderLine(line, lineIdx, cursor, mode, selRange)}
        </div>
      ))}
      {Array.from({ length: tildeRows }, (_, i) => (
        <div key={`tilde-${i}`} className="buffer-line whitespace-pre h-5 text-blue-500">~</div>
      ))}
    </div>
  );
}

function renderLine(
  line: string,
  lineIdx: number,
  cursor: Cursor,
  mode: Mode,
  selRange: NormalizedSelection | null,
) {
  // Ensure at least one char slot for empty lines (cursor can be at col 0)
  const chars = line.length > 0 ? line.split('') : [' '];

  return chars.map((ch, colIdx) => {
    const isCursor = lineIdx === cursor.line && colIdx === cursor.col;
    const isSelected = selRange ? isInSelection(lineIdx, colIdx, selRange) : false;

    let className = '';
    if (isCursor) {
      className = mode === 'insert' ? 'cursor-line' : 'cursor-block';
    } else if (isSelected) {
      className = 'visual-highlight';
    }

    return (
      <span key={colIdx} className={className}>
        {ch}
      </span>
    );
  });
}

interface NormalizedSelection {
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
  linewise: boolean;
}

function normalizeSelection(sel: Selection, mode: Mode): NormalizedSelection {
  const linewise = mode === 'visual-line';
  let startLine = sel.anchor.line;
  let startCol = sel.anchor.col;
  let endLine = sel.head.line;
  let endCol = sel.head.col;

  if (startLine > endLine || (startLine === endLine && startCol > endCol)) {
    [startLine, endLine] = [endLine, startLine];
    [startCol, endCol] = [endCol, startCol];
  }

  return { startLine, startCol, endLine, endCol, linewise };
}

function isInSelection(
  line: number,
  col: number,
  sel: NormalizedSelection,
): boolean {
  if (line < sel.startLine || line > sel.endLine) return false;

  if (sel.linewise) return true;

  if (line === sel.startLine && line === sel.endLine) {
    return col >= sel.startCol && col <= sel.endCol;
  }

  if (line === sel.startLine) return col >= sel.startCol;
  if (line === sel.endLine) return col <= sel.endCol;

  return true;
}
