import { describe, it, expect } from 'vitest';
import { parseExCommand } from '../commands.ts';

describe('parseExCommand', () => {
  it('parses :w', () => {
    expect(parseExCommand('w')).toEqual({ type: 'save' });
    expect(parseExCommand('write')).toEqual({ type: 'save' });
  });

  it('parses :e', () => {
    expect(parseExCommand('e')).toEqual({ type: 'reload' });
    expect(parseExCommand('edit')).toEqual({ type: 'reload' });
  });

  it('parses :wq', () => {
    expect(parseExCommand('wq')).toEqual({ type: 'save-quit' });
    expect(parseExCommand('x')).toEqual({ type: 'save-quit' });
  });

  it('parses :q!', () => {
    expect(parseExCommand('q!')).toEqual({ type: 'force-quit' });
  });

  it('parses :split', () => {
    expect(parseExCommand('split')).toEqual({ type: 'split', direction: 'horizontal' });
    expect(parseExCommand('sp')).toEqual({ type: 'split', direction: 'horizontal' });
  });

  it('parses :vsplit', () => {
    expect(parseExCommand('vsplit')).toEqual({ type: 'split', direction: 'vertical' });
    expect(parseExCommand('vs')).toEqual({ type: 'split', direction: 'vertical' });
  });

  it('parses buffer commands', () => {
    expect(parseExCommand('ls')).toEqual({ type: 'buffer-list' });
    expect(parseExCommand('bnext')).toEqual({ type: 'buffer-next' });
    expect(parseExCommand('bprev')).toEqual({ type: 'buffer-prev' });
    expect(parseExCommand('bd')).toEqual({ type: 'buffer-delete' });
  });

  it('returns unknown for unrecognized commands', () => {
    const result = parseExCommand('foobar');
    expect(result).toEqual({ type: 'unknown', command: 'foobar' });
  });

  it('trims whitespace', () => {
    expect(parseExCommand('  w  ')).toEqual({ type: 'save' });
  });
});
