import type { ExCommandResult } from './types.ts';

/**
 * Ex command parser: :w, :e, :wq, :q!, :split, :vsplit, :ls, :bnext, :bprev, :bd
 */

export function parseExCommand(input: string): ExCommandResult {
  const trimmed = input.trim();

  switch (trimmed) {
    case 'w':
    case 'write':
      return { type: 'save' };

    case 'e':
    case 'edit':
      return { type: 'reload' };

    case 'wq':
    case 'x':
      return { type: 'save-quit' };

    case 'q':
    case 'quit':
      return { type: 'quit' };

    case 'q!':
      return { type: 'force-quit' };

    case 'split':
    case 'sp':
      return { type: 'split', direction: 'horizontal' };

    case 'vsplit':
    case 'vs':
      return { type: 'split', direction: 'vertical' };

    case 'ls':
    case 'buffers':
      return { type: 'buffer-list' };

    case 'bnext':
    case 'bn':
      return { type: 'buffer-next' };

    case 'bprev':
    case 'bp':
      return { type: 'buffer-prev' };

    case 'bd':
    case 'bdelete':
      return { type: 'buffer-delete' };

    default:
      return { type: 'unknown', command: trimmed };
  }
}
