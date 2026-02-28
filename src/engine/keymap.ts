import type { Mode } from './types.ts';

/**
 * Keymap: maps raw key events to engine commands.
 * Handles key restriction (allowedKeys filter) for progressive unlock.
 */

export type KeyAction =
  // Motions
  | { type: 'motion'; name: string }
  // Mode switches
  | { type: 'enter-insert'; variant: 'i' | 'a' | 'I' | 'A' | 'o' | 'O' }
  | { type: 'enter-normal' }
  | { type: 'enter-visual' }
  | { type: 'enter-visual-line' }
  | { type: 'enter-command' }
  // Operators
  | { type: 'operator'; name: 'd' | 'c' | 'y' }
  | { type: 'delete-char' }  // x
  | { type: 'replace-char' } // r (waits for next char)
  // Paste
  | { type: 'put-after' }
  | { type: 'put-before' }
  // Search
  | { type: 'search-forward' }
  | { type: 'search-next' }
  | { type: 'search-prev' }
  // Find char
  | { type: 'find-char'; direction: 'f' | 'F' | 't' | 'T' }
  | { type: 'repeat-find' }
  | { type: 'repeat-find-reverse' }
  // Repeat
  | { type: 'dot-repeat' }
  // Undo/Redo
  | { type: 'undo' }
  | { type: 'redo' }
  // Text object prefix
  | { type: 'text-object-prefix'; kind: 'i' | 'a' }
  // Insert mode typing
  | { type: 'insert-char'; char: string }
  | { type: 'insert-backspace' }
  | { type: 'insert-enter' }
  // Command line
  | { type: 'command-char'; char: string }
  | { type: 'command-backspace' }
  | { type: 'command-execute' }
  // Digit for count buffer
  | { type: 'count-digit'; digit: string }
  // No-op (key not mapped)
  | { type: 'noop' };

export function mapKey(key: string, mode: Mode, hasOperatorPending: boolean): KeyAction {
  if (mode === 'insert') {
    return mapInsertKey(key);
  }

  if (mode === 'command') {
    return mapCommandKey(key);
  }

  // Normal, visual, visual-line modes
  return mapNormalKey(key, hasOperatorPending);
}

function mapInsertKey(key: string): KeyAction {
  if (key === 'Escape' || key === 'Esc') return { type: 'enter-normal' };
  if (key === 'Backspace') return { type: 'insert-backspace' };
  if (key === 'Enter') return { type: 'insert-enter' };

  // Single printable character
  if (key.length === 1) {
    return { type: 'insert-char', char: key };
  }

  return { type: 'noop' };
}

function mapCommandKey(key: string): KeyAction {
  if (key === 'Escape' || key === 'Esc') return { type: 'enter-normal' };
  if (key === 'Enter') return { type: 'command-execute' };
  if (key === 'Backspace') return { type: 'command-backspace' };

  if (key.length === 1) {
    return { type: 'command-char', char: key };
  }

  return { type: 'noop' };
}

function mapNormalKey(key: string, hasOperatorPending: boolean): KeyAction {
  // Escape always returns to normal
  if (key === 'Escape' || key === 'Esc') return { type: 'enter-normal' };

  // Count digits (1-9 start count, 0 is line-start motion unless in count)
  if (/^[1-9]$/.test(key)) return { type: 'count-digit', digit: key };
  if (key === '0' && !hasOperatorPending) return { type: 'motion', name: '0' };

  // Motions
  switch (key) {
    case 'h': case 'ArrowLeft':  return { type: 'motion', name: 'h' };
    case 'j': case 'ArrowDown':  return { type: 'motion', name: 'j' };
    case 'k': case 'ArrowUp':    return { type: 'motion', name: 'k' };
    case 'l': case 'ArrowRight': return { type: 'motion', name: 'l' };
    case '0': return { type: 'motion', name: '0' };
    case '^': return { type: 'motion', name: '^' };
    case '$': return { type: 'motion', name: '$' };
    case 'w': return { type: 'motion', name: 'w' };
    case 'b': return { type: 'motion', name: 'b' };
    case 'e': return { type: 'motion', name: 'e' };
    case 'W': return { type: 'motion', name: 'W' };
    case 'B': return { type: 'motion', name: 'B' };
    case 'E': return { type: 'motion', name: 'E' };
    case 'G': return { type: 'motion', name: 'G' };
  }

  // Mode changes
  switch (key) {
    case 'i': {
      if (hasOperatorPending) return { type: 'text-object-prefix', kind: 'i' };
      return { type: 'enter-insert', variant: 'i' };
    }
    case 'a': {
      if (hasOperatorPending) return { type: 'text-object-prefix', kind: 'a' };
      return { type: 'enter-insert', variant: 'a' };
    }
    case 'I': return { type: 'enter-insert', variant: 'I' };
    case 'A': return { type: 'enter-insert', variant: 'A' };
    case 'o': return { type: 'enter-insert', variant: 'o' };
    case 'O': return { type: 'enter-insert', variant: 'O' };
    case 'v': return { type: 'enter-visual' };
    case 'V': return { type: 'enter-visual-line' };
    case ':': return { type: 'enter-command' };
  }

  // Operators
  switch (key) {
    case 'd': return { type: 'operator', name: 'd' };
    case 'c': return { type: 'operator', name: 'c' };
    case 'y': return { type: 'operator', name: 'y' };
    case 'x': return { type: 'delete-char' };
    case 'r': return { type: 'replace-char' };
    case 'p': return { type: 'put-after' };
    case 'P': return { type: 'put-before' };
  }

  // Search
  if (key === '/') return { type: 'search-forward' };
  if (key === 'n') return { type: 'search-next' };
  if (key === 'N') return { type: 'search-prev' };

  // Find char
  if (key === 'f') return { type: 'find-char', direction: 'f' };
  if (key === 'F') return { type: 'find-char', direction: 'F' };
  if (key === 't') return { type: 'find-char', direction: 't' };
  if (key === 'T') return { type: 'find-char', direction: 'T' };
  if (key === ';') return { type: 'repeat-find' };
  if (key === ',') return { type: 'repeat-find-reverse' };

  // Repeat + undo/redo
  if (key === '.') return { type: 'dot-repeat' };
  if (key === 'u') return { type: 'undo' };
  if (key === 'Control+r' || key === 'Ctrl+r') return { type: 'redo' };

  return { type: 'noop' };
}

export function isKeyAllowed(
  key: string,
  allowedKeys: Set<string> | null,
): boolean {
  // null means no restrictions
  if (!allowedKeys) return true;

  // Always allow Escape
  if (key === 'Escape' || key === 'Esc') return true;

  // Map arrow keys to their canonical names
  const arrowMap: Record<string, string> = {
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
  };

  if (arrowMap[key]) {
    return allowedKeys.has(arrowMap[key]);
  }

  // Check direct key
  if (allowedKeys.has(key)) return true;

  // Special keys that are always allowed in certain contexts
  if (key === 'Backspace' || key === 'Enter') return true;

  return false;
}
