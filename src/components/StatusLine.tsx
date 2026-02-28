import type { Mode, Cursor } from '../engine/types.ts';

interface StatusLineProps {
  mode: Mode;
  cursor: Cursor;
  fileName: string;
  modified: boolean;
  message: string | null;
  gems?: number;
}

export function StatusLine({ mode, cursor, fileName, modified, message, gems }: StatusLineProps) {
  const modeLabel = getModeLabel(mode);
  const modeColor = getModeColor(mode);

  return (
    <div className="flex items-center justify-between px-2 h-6 bg-gray-800 text-xs font-mono border-t border-gray-700">
      <div className="flex items-center gap-2">
        <span className={`px-1 font-bold ${modeColor}`}>{modeLabel}</span>
        <span className="text-gray-400">
          {fileName}{modified ? ' [+]' : ''}
        </span>
        {message && (
          <span className="text-yellow-300 ml-2">{message}</span>
        )}
      </div>
      <div className="flex items-center gap-3 text-gray-500">
        {gems !== undefined && (
          <span className="text-amber-400">{gems} gems</span>
        )}
        <span>{cursor.line + 1}:{cursor.col + 1}</span>
      </div>
    </div>
  );
}

function getModeLabel(mode: Mode): string {
  switch (mode) {
    case 'normal': return 'NORMAL';
    case 'insert': return 'INSERT';
    case 'visual': return 'VISUAL';
    case 'visual-line': return 'V-LINE';
    case 'command': return 'COMMAND';
  }
}

function getModeColor(mode: Mode): string {
  switch (mode) {
    case 'normal': return 'text-green-400';
    case 'insert': return 'text-blue-400';
    case 'visual': return 'text-purple-400';
    case 'visual-line': return 'text-purple-400';
    case 'command': return 'text-yellow-400';
  }
}
