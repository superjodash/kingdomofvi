export type Mode = 'normal' | 'insert' | 'visual' | 'visual-line' | 'command';

export interface Buffer {
  lines: string[];
  fileName: string;
  modified: boolean;
  savedSnapshot: string[];
}

export interface Cursor {
  line: number;
  col: number;
}

export interface Selection {
  anchor: Cursor;
  head: Cursor;
}

export interface PendingOperator {
  operator: 'd' | 'c' | 'y';
  count?: number;
}

export interface Range {
  start: Cursor;
  end: Cursor;
  linewise: boolean;
  inclusive: boolean;
}

export type MotionName =
  | 'h' | 'j' | 'k' | 'l'
  | '0' | '^' | '$'
  | 'gg' | 'G'
  | 'w' | 'b' | 'e'
  | 'W' | 'B' | 'E';

export type OperatorName = 'd' | 'c' | 'y';

export type TextObjectName =
  | 'iw' | 'aw'
  | 'i"' | 'a"'
  | 'i)' | 'a)'
  | 'i]' | 'a]';

export type ExCommandResult =
  | { type: 'save' }
  | { type: 'reload' }
  | { type: 'quit' }
  | { type: 'save-quit' }
  | { type: 'force-quit' }
  | { type: 'split'; direction: 'horizontal' | 'vertical' }
  | { type: 'buffer-list' }
  | { type: 'buffer-next' }
  | { type: 'buffer-prev' }
  | { type: 'buffer-delete' }
  | { type: 'unknown'; command: string };

export type SplitLayout =
  | { type: 'single'; bufferIndex: number }
  | {
      type: 'hsplit' | 'vsplit';
      children: [SplitLayout, SplitLayout];
      activePaneIndex: 0 | 1;
    };

export interface RecordedChange {
  keys: string[];
}

export interface EditorState {
  buffers: Buffer[];
  activeBufferIndex: number;
  cursor: Cursor;
  mode: Mode;
  pendingOperator: PendingOperator | null;
  selection: Selection | null;
  register: string;
  registerLinewise: boolean;
  lastSearch: string | null;
  lastFindChar: { direction: 'f' | 'F' | 't' | 'T'; char: string } | null;
  lastChange: RecordedChange | null;
  commandLineText: string;
  message: string | null;
  keyBuffer: string;
  countBuffer: string;
  splits: SplitLayout | null;
}
