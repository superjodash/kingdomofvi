import { describe, it, expect } from 'vitest';
import { mapKey, isKeyAllowed } from '../keymap.ts';

describe('mapKey in normal mode', () => {
  it('maps h to motion', () => {
    expect(mapKey('h', 'normal', false)).toEqual({ type: 'motion', name: 'h' });
  });

  it('maps arrow keys to motions', () => {
    expect(mapKey('ArrowLeft', 'normal', false)).toEqual({ type: 'motion', name: 'h' });
    expect(mapKey('ArrowDown', 'normal', false)).toEqual({ type: 'motion', name: 'j' });
  });

  it('maps i to enter-insert', () => {
    expect(mapKey('i', 'normal', false)).toEqual({ type: 'enter-insert', variant: 'i' });
  });

  it('maps i to text-object-prefix when operator pending', () => {
    expect(mapKey('i', 'normal', true)).toEqual({ type: 'text-object-prefix', kind: 'i' });
  });

  it('maps d to operator', () => {
    expect(mapKey('d', 'normal', false)).toEqual({ type: 'operator', name: 'd' });
  });

  it('maps x to delete-char', () => {
    expect(mapKey('x', 'normal', false)).toEqual({ type: 'delete-char' });
  });

  it('maps digits to count', () => {
    expect(mapKey('3', 'normal', false)).toEqual({ type: 'count-digit', digit: '3' });
  });

  it('maps 0 to motion (line start)', () => {
    expect(mapKey('0', 'normal', false)).toEqual({ type: 'motion', name: '0' });
  });

  it('maps / to search', () => {
    expect(mapKey('/', 'normal', false)).toEqual({ type: 'search-forward' });
  });

  it('maps : to command mode', () => {
    expect(mapKey(':', 'normal', false)).toEqual({ type: 'enter-command' });
  });

  it('maps . to dot-repeat', () => {
    expect(mapKey('.', 'normal', false)).toEqual({ type: 'dot-repeat' });
  });

  it('maps u to undo', () => {
    expect(mapKey('u', 'normal', false)).toEqual({ type: 'undo' });
  });

  it('returns noop for unmapped key', () => {
    expect(mapKey('F12', 'normal', false)).toEqual({ type: 'noop' });
  });
});

describe('mapKey in insert mode', () => {
  it('maps Escape to enter-normal', () => {
    expect(mapKey('Escape', 'insert', false)).toEqual({ type: 'enter-normal' });
    expect(mapKey('Esc', 'insert', false)).toEqual({ type: 'enter-normal' });
  });

  it('maps Backspace', () => {
    expect(mapKey('Backspace', 'insert', false)).toEqual({ type: 'insert-backspace' });
  });

  it('maps Enter', () => {
    expect(mapKey('Enter', 'insert', false)).toEqual({ type: 'insert-enter' });
  });

  it('maps printable chars', () => {
    expect(mapKey('a', 'insert', false)).toEqual({ type: 'insert-char', char: 'a' });
  });
});

describe('mapKey in command mode', () => {
  it('maps Escape to enter-normal', () => {
    expect(mapKey('Escape', 'command', false)).toEqual({ type: 'enter-normal' });
  });

  it('maps Enter to execute', () => {
    expect(mapKey('Enter', 'command', false)).toEqual({ type: 'command-execute' });
  });

  it('maps chars to command-char', () => {
    expect(mapKey('w', 'command', false)).toEqual({ type: 'command-char', char: 'w' });
  });
});

describe('isKeyAllowed', () => {
  it('allows all keys when allowedKeys is null', () => {
    expect(isKeyAllowed('x', null)).toBe(true);
  });

  it('always allows Escape', () => {
    const allowed = new Set(['h', 'j']);
    expect(isKeyAllowed('Escape', allowed)).toBe(true);
    expect(isKeyAllowed('Esc', allowed)).toBe(true);
  });

  it('allows keys in the set', () => {
    const allowed = new Set(['h', 'j', 'k', 'l']);
    expect(isKeyAllowed('h', allowed)).toBe(true);
    expect(isKeyAllowed('w', allowed)).toBe(false);
  });

  it('checks arrow keys', () => {
    const allowed = new Set(['ArrowLeft']);
    expect(isKeyAllowed('ArrowLeft', allowed)).toBe(true);
    expect(isKeyAllowed('ArrowRight', allowed)).toBe(false);
  });

  it('always allows Backspace and Enter', () => {
    const allowed = new Set(['h']);
    expect(isKeyAllowed('Backspace', allowed)).toBe(true);
    expect(isKeyAllowed('Enter', allowed)).toBe(true);
  });
});
