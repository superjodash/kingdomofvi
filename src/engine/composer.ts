import type { EditorState, Range } from './types.ts';
import { mapKey, type KeyAction } from './keymap.ts';
import { motionRange } from './motions.ts';
import { textObjectRange } from './textObjects.ts';
import { deleteOp, changeOp, yankOp, deleteCharOp, replaceCharOp, putAfterOp, putBeforeOp } from './operators.ts';
import {
  enterInsertMode,
  enterInsertAfter,
  enterInsertAtLineStart,
  enterInsertAtLineEnd,
  enterInsertNewLineBelow,
  enterInsertNewLineAbove,
  enterNormalMode,
  enterVisualMode,
  enterVisualLineMode,
  enterCommandMode,
} from './modes.ts';
import { insertCharAt, deleteCharAt } from './buffer.ts';
import { searchForward, searchBackward, findCharForward, findCharBackward, tillCharForward, tillCharBackward, repeatFindChar } from './search.ts';
import { parseExCommand } from './commands.ts';
import { createHistory, pushSnapshot, undo as require_undo, redo as require_redo, type HistoryState } from './history.ts';

/**
 * The composer processes keystrokes and orchestrates the vim grammar:
 * [count] operator [count] motion/text-object
 * It also handles multi-key sequences like gg, dd, cc, yy, r+char, f+char.
 */

export interface ComposerState {
  editorState: EditorState;
  history: HistoryState;
  searchBuffer: string | null; // non-null = currently entering search
  waitingForChar: 'r' | 'f' | 'F' | 't' | 'T' | null;
  waitingForTextObject: 'i' | 'a' | null;
  lastChange: string[] | null; // keys for dot repeat
  currentChangeKeys: string[];
  insertStarted: boolean;
}

export function createComposerState(lines: string[], fileName = 'untitled'): ComposerState {
  return {
    editorState: {
      buffers: [{
        lines,
        fileName,
        modified: false,
        savedSnapshot: [...lines],
      }],
      activeBufferIndex: 0,
      cursor: { line: 0, col: 0 },
      mode: 'normal',
      pendingOperator: null,
      selection: null,
      register: '',
      registerLinewise: false,
      lastSearch: null,
      lastFindChar: null,
      lastChange: null,
      commandLineText: '',
      message: null,
      keyBuffer: '',
      countBuffer: '',
      splits: null,
    },
    history: createHistory(),
    searchBuffer: null,
    waitingForChar: null,
    waitingForTextObject: null,
    lastChange: null,
    currentChangeKeys: [],
    insertStarted: false,
  };
}

export interface ProcessResult {
  composer: ComposerState;
  command?: string; // composed command name for tracking (e.g., 'dw', 'dd')
  exResult?: ReturnType<typeof parseExCommand>;
}

export function processKey(composerState: ComposerState, key: string): ProcessResult {
  let cs = { ...composerState };
  const es = cs.editorState;
  const mode = es.mode;

  // Handle search input mode
  if (cs.searchBuffer !== null) {
    return handleSearchInput(cs, key);
  }

  // Handle waiting for character (r, f, F, t, T)
  if (cs.waitingForChar !== null) {
    return handleCharWait(cs, key);
  }

  // Handle waiting for text object (i, a) after operator
  if (cs.waitingForTextObject !== null) {
    return handleTextObjectWait(cs, key);
  }

  const action = mapKey(key, mode, es.pendingOperator !== null);

  if (mode === 'insert') {
    return handleInsertAction(cs, action, key);
  }

  if (mode === 'command') {
    return handleCommandAction(cs, action);
  }

  // Normal / visual / visual-line
  return handleNormalAction(cs, action, key);
}

function handleSearchInput(cs: ComposerState, key: string): ProcessResult {
  if (key === 'Escape' || key === 'Esc') {
    return {
      composer: {
        ...cs,
        searchBuffer: null,
        editorState: enterNormalMode(cs.editorState),
      },
    };
  }

  if (key === 'Enter') {
    const pattern = cs.searchBuffer!;
    const buf = cs.editorState.buffers[cs.editorState.activeBufferIndex];
    const found = searchForward(buf, cs.editorState.cursor, pattern);
    return {
      composer: {
        ...cs,
        searchBuffer: null,
        editorState: {
          ...cs.editorState,
          cursor: found ?? cs.editorState.cursor,
          lastSearch: pattern,
          mode: 'normal',
          message: found ? null : `Pattern not found: ${pattern}`,
        },
      },
    };
  }

  if (key === 'Backspace') {
    const current = cs.searchBuffer!;
    if (current.length === 0) {
      return {
        composer: {
          ...cs,
          searchBuffer: null,
          editorState: enterNormalMode(cs.editorState),
        },
      };
    }
    return {
      composer: {
        ...cs,
        searchBuffer: current.slice(0, -1),
      },
    };
  }

  if (key.length === 1) {
    return {
      composer: {
        ...cs,
        searchBuffer: (cs.searchBuffer ?? '') + key,
      },
    };
  }

  return { composer: cs };
}

function handleCharWait(cs: ComposerState, key: string): ProcessResult {
  if (key === 'Escape' || key === 'Esc') {
    return {
      composer: {
        ...cs,
        waitingForChar: null,
        editorState: { ...cs.editorState, pendingOperator: null, keyBuffer: '' },
      },
    };
  }

  if (key.length !== 1) return { composer: cs };

  const waiting = cs.waitingForChar!;
  const buf = cs.editorState.buffers[cs.editorState.activeBufferIndex];
  const cursor = cs.editorState.cursor;

  if (waiting === 'r') {
    // Replace char
    const history = pushSnapshot(cs.history, buf, cursor);
    const newState = replaceCharOp(cs.editorState, key);
    return {
      composer: {
        ...cs,
        waitingForChar: null,
        editorState: newState,
        history,
        lastChange: [...cs.currentChangeKeys, key],
        currentChangeKeys: [],
      },
      command: 'r',
    };
  }

  // Find/till char
  let found;
  switch (waiting) {
    case 'f': found = findCharForward(buf, cursor, key); break;
    case 'F': found = findCharBackward(buf, cursor, key); break;
    case 't': found = tillCharForward(buf, cursor, key); break;
    case 'T': found = tillCharBackward(buf, cursor, key); break;
  }

  const newFindChar = { direction: waiting as 'f' | 'F' | 't' | 'T', char: key };
  let newEs: EditorState = {
    ...cs.editorState,
    lastFindChar: newFindChar,
  };

  if (found) {
    if (newEs.pendingOperator) {
      // Apply operator with find range
      const opName = newEs.pendingOperator.operator;
      const range: Range = {
        start: cursor.line <= found.line ? cursor : found,
        end: cursor.line <= found.line ? found : cursor,
        linewise: false,
        inclusive: waiting === 'f' || waiting === 'F',
      };
      const history = pushSnapshot(cs.history, buf, cursor);
      newEs = applyOperator(newEs, range);
      return {
        composer: {
          ...cs,
          waitingForChar: null,
          editorState: newEs,
          history,
          lastChange: [...cs.currentChangeKeys, key],
          currentChangeKeys: [],
        },
        command: `${opName}${waiting}${key}`,
      };
    }
    newEs = { ...newEs, cursor: found };
  }

  return {
    composer: {
      ...cs,
      waitingForChar: null,
      editorState: newEs,
    },
  };
}

function handleTextObjectWait(cs: ComposerState, key: string): ProcessResult {
  const kind = cs.waitingForTextObject!;
  const objectName = `${kind}${key}`;

  const buf = cs.editorState.buffers[cs.editorState.activeBufferIndex];
  const range = textObjectRange(buf, cs.editorState.cursor, objectName);

  if (!range) {
    return {
      composer: {
        ...cs,
        waitingForTextObject: null,
        editorState: { ...cs.editorState, pendingOperator: null, keyBuffer: '' },
      },
    };
  }

  if (cs.editorState.pendingOperator) {
    const history = pushSnapshot(cs.history, buf, cs.editorState.cursor);
    const newEs = applyOperator(cs.editorState, range);
    const opName = cs.editorState.pendingOperator.operator;
    return {
      composer: {
        ...cs,
        waitingForTextObject: null,
        editorState: newEs,
        history,
        lastChange: [...cs.currentChangeKeys, key],
        currentChangeKeys: [],
      },
      command: `${opName}${objectName}`,
    };
  }

  return {
    composer: {
      ...cs,
      waitingForTextObject: null,
    },
  };
}

function handleInsertAction(cs: ComposerState, action: KeyAction, key: string): ProcessResult {
  const es = cs.editorState;
  const buf = es.buffers[es.activeBufferIndex];

  if (action.type === 'enter-normal') {
    const newEs = enterNormalMode(es);
    return {
      composer: {
        ...cs,
        editorState: newEs,
        insertStarted: false,
        lastChange: cs.currentChangeKeys.length > 0 ? [...cs.currentChangeKeys] : cs.lastChange,
        currentChangeKeys: [],
      },
    };
  }

  // Track insert keys for dot repeat
  const changeKeys = [...cs.currentChangeKeys, key];

  if (action.type === 'insert-char') {
    const newLines = insertCharAt(buf.lines, es.cursor.line, es.cursor.col, action.char);
    const newBuf = { ...buf, lines: newLines, modified: true };
    const newBuffers = [...es.buffers];
    newBuffers[es.activeBufferIndex] = newBuf;
    return {
      composer: {
        ...cs,
        currentChangeKeys: changeKeys,
        editorState: {
          ...es,
          buffers: newBuffers,
          cursor: { line: es.cursor.line, col: es.cursor.col + 1 },
        },
      },
    };
  }

  if (action.type === 'insert-backspace') {
    if (es.cursor.col === 0) {
      if (es.cursor.line === 0) return { composer: cs };
      // Join with previous line
      const prevLine = buf.lines[es.cursor.line - 1];
      const curLine = buf.lines[es.cursor.line];
      const newLines = [...buf.lines];
      newLines[es.cursor.line - 1] = prevLine + curLine;
      newLines.splice(es.cursor.line, 1);
      const newBuf = { ...buf, lines: newLines, modified: true };
      const newBuffers = [...es.buffers];
      newBuffers[es.activeBufferIndex] = newBuf;
      return {
        composer: {
          ...cs,
          currentChangeKeys: changeKeys,
          editorState: {
            ...es,
            buffers: newBuffers,
            cursor: { line: es.cursor.line - 1, col: prevLine.length },
          },
        },
      };
    }

    const newLines = deleteCharAt(buf.lines, es.cursor.line, es.cursor.col - 1);
    const newBuf = { ...buf, lines: newLines, modified: true };
    const newBuffers = [...es.buffers];
    newBuffers[es.activeBufferIndex] = newBuf;
    return {
      composer: {
        ...cs,
        currentChangeKeys: changeKeys,
        editorState: {
          ...es,
          buffers: newBuffers,
          cursor: { line: es.cursor.line, col: es.cursor.col - 1 },
        },
      },
    };
  }

  if (action.type === 'insert-enter') {
    const line = buf.lines[es.cursor.line];
    const before = line.slice(0, es.cursor.col);
    const after = line.slice(es.cursor.col);
    const newLines = [...buf.lines];
    newLines[es.cursor.line] = before;
    newLines.splice(es.cursor.line + 1, 0, after);
    const newBuf = { ...buf, lines: newLines, modified: true };
    const newBuffers = [...es.buffers];
    newBuffers[es.activeBufferIndex] = newBuf;
    return {
      composer: {
        ...cs,
        currentChangeKeys: changeKeys,
        editorState: {
          ...es,
          buffers: newBuffers,
          cursor: { line: es.cursor.line + 1, col: 0 },
        },
      },
    };
  }

  return { composer: cs };
}

function handleCommandAction(cs: ComposerState, action: KeyAction): ProcessResult {
  const es = cs.editorState;

  if (action.type === 'enter-normal') {
    return { composer: { ...cs, editorState: enterNormalMode(es) } };
  }

  if (action.type === 'command-char') {
    return {
      composer: {
        ...cs,
        editorState: { ...es, commandLineText: es.commandLineText + action.char },
      },
    };
  }

  if (action.type === 'command-backspace') {
    if (es.commandLineText.length === 0) {
      return { composer: { ...cs, editorState: enterNormalMode(es) } };
    }
    return {
      composer: {
        ...cs,
        editorState: { ...es, commandLineText: es.commandLineText.slice(0, -1) },
      },
    };
  }

  if (action.type === 'command-execute') {
    const result = parseExCommand(es.commandLineText);
    const newEs = enterNormalMode(es);
    return {
      composer: {
        ...cs,
        editorState: {
          ...newEs,
          message: result.type === 'unknown' ? `Not a command: ${result.command}` : null,
        },
      },
      exResult: result,
    };
  }

  return { composer: cs };
}

function handleNormalAction(cs: ComposerState, action: KeyAction, key: string): ProcessResult {
  const es = cs.editorState;
  const buf = es.buffers[es.activeBufferIndex];

  // Count digits
  if (action.type === 'count-digit') {
    return {
      composer: {
        ...cs,
        editorState: { ...es, countBuffer: es.countBuffer + action.digit },
      },
    };
  }

  const count = es.countBuffer ? parseInt(es.countBuffer, 10) : 1;

  // Mode changes
  switch (action.type) {
    case 'enter-insert': {
      const history = pushSnapshot(cs.history, buf, es.cursor);
      let newEs: EditorState;
      switch (action.variant) {
        case 'i': newEs = enterInsertMode(es); break;
        case 'a': newEs = enterInsertAfter(es); break;
        case 'I': newEs = enterInsertAtLineStart(es); break;
        case 'A': newEs = enterInsertAtLineEnd(es); break;
        case 'o': newEs = enterInsertNewLineBelow(es); break;
        case 'O': newEs = enterInsertNewLineAbove(es); break;
      }
      return {
        composer: {
          ...cs,
          editorState: newEs,
          history,
          insertStarted: true,
          currentChangeKeys: [key],
        },
      };
    }
    case 'enter-normal':
      return { composer: { ...cs, editorState: enterNormalMode(es) } };
    case 'enter-visual':
      return { composer: { ...cs, editorState: enterVisualMode(es) } };
    case 'enter-visual-line':
      return { composer: { ...cs, editorState: enterVisualLineMode(es) } };
    case 'enter-command':
      return { composer: { ...cs, editorState: enterCommandMode(es) } };
  }

  // Motions
  if (action.type === 'motion') {
    // Handle 'gg' multi-key
    if (key === 'g') {
      if (es.keyBuffer === 'g') {
        // gg motion
        return handleMotion(cs, 'gg', count);
      }
      return {
        composer: {
          ...cs,
          editorState: { ...es, keyBuffer: 'g' },
        },
      };
    }

    return handleMotion(cs, action.name, count);
  }

  // Handle 'g' key buffer for 'gg'
  if (key === 'g' && es.keyBuffer !== 'g') {
    return {
      composer: {
        ...cs,
        editorState: { ...es, keyBuffer: 'g' },
      },
    };
  }

  if (es.keyBuffer === 'g' && key === 'g') {
    return handleMotion(cs, 'gg', count);
  }

  // Clear key buffer on any other key
  if (es.keyBuffer) {
    cs = { ...cs, editorState: { ...es, keyBuffer: '' } };
  }

  // Operators
  if (action.type === 'operator') {
    if (es.pendingOperator?.operator === action.name) {
      // dd, cc, yy — line-wise operation on current line(s)
      const range: Range = {
        start: { line: es.cursor.line, col: 0 },
        end: { line: Math.min(es.cursor.line + count - 1, buf.lines.length - 1), col: 0 },
        linewise: true,
        inclusive: false,
      };
      const history = pushSnapshot(cs.history, buf, es.cursor);
      const newEs = applyOperator(es, range);
      return {
        composer: {
          ...cs,
          editorState: newEs,
          history,
          lastChange: [key, key],
          currentChangeKeys: [],
        },
        command: `${action.name}${action.name}`,
      };
    }
    return {
      composer: {
        ...cs,
        editorState: {
          ...es,
          pendingOperator: { operator: action.name, count },
          countBuffer: '',
        },
        currentChangeKeys: [key],
      },
    };
  }

  // Delete char (x)
  if (action.type === 'delete-char') {
    const history = pushSnapshot(cs.history, buf, es.cursor);
    let newEs = es;
    for (let i = 0; i < count; i++) {
      newEs = deleteCharOp(newEs);
    }
    return {
      composer: {
        ...cs,
        editorState: newEs,
        history,
        lastChange: [key],
        currentChangeKeys: [],
      },
      command: 'x',
    };
  }

  // Replace char (r) — wait for next char
  if (action.type === 'replace-char') {
    return {
      composer: {
        ...cs,
        waitingForChar: 'r',
        currentChangeKeys: [key],
      },
    };
  }

  // Paste
  if (action.type === 'put-after') {
    const history = pushSnapshot(cs.history, buf, es.cursor);
    return {
      composer: {
        ...cs,
        editorState: putAfterOp(es),
        history,
        lastChange: [key],
        currentChangeKeys: [],
      },
      command: 'p',
    };
  }

  if (action.type === 'put-before') {
    const history = pushSnapshot(cs.history, buf, es.cursor);
    return {
      composer: {
        ...cs,
        editorState: putBeforeOp(es),
        history,
        lastChange: [key],
        currentChangeKeys: [],
      },
      command: 'P',
    };
  }

  // Search
  if (action.type === 'search-forward') {
    return {
      composer: { ...cs, searchBuffer: '' },
    };
  }

  if (action.type === 'search-next') {
    if (es.lastSearch) {
      const found = searchForward(buf, es.cursor, es.lastSearch);
      return {
        composer: {
          ...cs,
          editorState: {
            ...es,
            cursor: found ?? es.cursor,
            message: found ? null : `Pattern not found: ${es.lastSearch}`,
          },
        },
      };
    }
    return { composer: cs };
  }

  if (action.type === 'search-prev') {
    if (es.lastSearch) {
      const found = searchBackward(buf, es.cursor, es.lastSearch);
      return {
        composer: {
          ...cs,
          editorState: {
            ...es,
            cursor: found ?? es.cursor,
            message: found ? null : `Pattern not found: ${es.lastSearch}`,
          },
        },
      };
    }
    return { composer: cs };
  }

  // Find char (f, F, t, T)
  if (action.type === 'find-char') {
    return {
      composer: {
        ...cs,
        waitingForChar: action.direction,
        currentChangeKeys: [...cs.currentChangeKeys, key],
      },
    };
  }

  // Repeat find (; and ,)
  if (action.type === 'repeat-find' || action.type === 'repeat-find-reverse') {
    if (es.lastFindChar) {
      const found = repeatFindChar(buf, es.cursor, es.lastFindChar, action.type === 'repeat-find-reverse');
      if (found) {
        return {
          composer: {
            ...cs,
            editorState: { ...es, cursor: found },
          },
        };
      }
    }
    return { composer: cs };
  }

  // Text object prefix (i/a when operator pending)
  if (action.type === 'text-object-prefix') {
    return {
      composer: {
        ...cs,
        waitingForTextObject: action.kind,
        currentChangeKeys: [...cs.currentChangeKeys, key],
      },
    };
  }

  // Undo
  if (action.type === 'undo') {
    const result = require_undo(cs.history, buf, es.cursor);
    if (!result) return { composer: cs };
    const newBuf = { ...buf, lines: result.lines, modified: true };
    const newBuffers = [...es.buffers];
    newBuffers[es.activeBufferIndex] = newBuf;
    return {
      composer: {
        ...cs,
        editorState: { ...es, buffers: newBuffers, cursor: result.cursor },
        history: result.history,
      },
    };
  }

  // Redo
  if (action.type === 'redo') {
    const result = require_redo(cs.history, buf, es.cursor);
    if (!result) return { composer: cs };
    const newBuf = { ...buf, lines: result.lines, modified: true };
    const newBuffers = [...es.buffers];
    newBuffers[es.activeBufferIndex] = newBuf;
    return {
      composer: {
        ...cs,
        editorState: { ...es, buffers: newBuffers, cursor: result.cursor },
        history: result.history,
      },
    };
  }

  // Dot repeat
  if (action.type === 'dot-repeat') {
    if (cs.lastChange && cs.lastChange.length > 0) {
      let result: ComposerState = cs;
      for (const k of cs.lastChange) {
        const pr = processKey(result, k);
        result = pr.composer;
      }
      return { composer: result };
    }
    return { composer: cs };
  }

  return { composer: { ...cs, editorState: { ...es, message: null } } };
}

function handleMotion(cs: ComposerState, motionName: string, count: number): ProcessResult {
  const es = cs.editorState;
  const buf = es.buffers[es.activeBufferIndex];

  if (es.pendingOperator) {
    // Operator + motion → compute range and apply
    const range = motionRange(buf, es.cursor, motionName, count);
    if (!range) {
      return {
        composer: {
          ...cs,
          editorState: { ...es, pendingOperator: null, keyBuffer: '', countBuffer: '' },
        },
      };
    }
    const history = pushSnapshot(cs.history, buf, es.cursor);
    const opName = es.pendingOperator.operator;
    const newEs = applyOperator(es, range);
    return {
      composer: {
        ...cs,
        editorState: newEs,
        history,
        lastChange: [...cs.currentChangeKeys, motionName],
        currentChangeKeys: [],
      },
      command: `${opName}${count > 1 ? count : ''}${motionName}`,
    };
  }

  // Pure motion — just move cursor
  const range = motionRange(buf, es.cursor, motionName, count);
  if (!range) return { composer: cs };

  // Move to the target (end for forward motions, start for backward)
  const target = range.end.line > es.cursor.line || range.end.col > es.cursor.col
    ? range.end
    : range.start;

  // Update visual selection if in visual mode
  let newEs = { ...es, cursor: target, keyBuffer: '', countBuffer: '' };
  if (es.selection && (es.mode === 'visual' || es.mode === 'visual-line')) {
    newEs = { ...newEs, selection: { ...es.selection, head: target } };
  }

  return { composer: { ...cs, editorState: newEs } };
}

function applyOperator(es: EditorState, range: Range): EditorState {
  const op = es.pendingOperator;
  if (!op) return es;

  let newEs: EditorState;
  switch (op.operator) {
    case 'd': newEs = deleteOp(es, range); break;
    case 'c': newEs = changeOp(es, range); break;
    case 'y': newEs = yankOp(es, range); break;
    default: return es;
  }

  return { ...newEs, pendingOperator: null, keyBuffer: '', countBuffer: '' };
}

