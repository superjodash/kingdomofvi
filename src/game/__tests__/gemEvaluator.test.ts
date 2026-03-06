import { describe, expect, it } from 'vitest';
import { evaluateGems } from '../gemEvaluator.ts';
import { chapter3Lessons } from '../lessons/chapter3.ts';
import type { KeystrokeState } from '../keystrokeTracker.ts';

function makeKeystrokeState(overrides: Partial<KeystrokeState>): KeystrokeState {
  return {
    keys: [],
    keyCounts: {},
    composedCounts: {},
    modeChanges: 0,
    cursorVisited: new Set(),
    ...overrides,
  };
}

describe('Scribe\'s Camp gem criteria', () => {
  const lesson = chapter3Lessons.find((l) => l.id === 8)!;
  const finalLines = [
    "# SCRIBE'S CAMP",
    '#',
    '# Allowed Keys:',
    '#   previous + x r',
    '#',
    '# QUEST:',
    '#   - Use x at least 10 times total.',
    '#   - Use r at least 5 times total.',
    '#   - Repair the sign so it reads exactly:',
    '#       WELCOME, TRAVELER!',
    '#',
    '# Tip: Use r for single-character fixes. Use x if you want a character gone.',
    '',
    'CAMP SIGN (broken, slightly sad):',
    'WELCOME, TRAVELER!',
    '',
    'Camp notes:',
    '- The 0 should become O',
    '- The 3 should become E',
    '- The kettle is judging you kindly.',
    '',
    'Practice strip (use x to nibble):',
    'x  (delete some x\'s if you like)',
  ];

  it('does not count unfinished r prefixes toward gem progress', () => {
    const keystrokeState = makeKeystrokeState({
      keys: ['x', 'x', 'x', 'x', 'x', 'r', 'r', 'r'],
      keyCounts: { x: 5, r: 3 },
      composedCounts: {},
    });

    expect(evaluateGems(lesson, keystrokeState, finalLines)).toBe(1);
  });

  it('counts completed r commands toward gem progress', () => {
    const filler = Array.from({ length: 25 }, () => 'h');
    const keystrokeState = makeKeystrokeState({
      keys: ['x', 'x', 'x', 'x', 'x', 'r', 'O', 'r', 'E', 'r', '!', ...filler],
      keyCounts: { x: 5, r: 3, O: 1, E: 1, '!': 1, h: filler.length },
      composedCounts: { r: 3 },
    });

    expect(evaluateGems(lesson, keystrokeState, finalLines)).toBe(2);
  });
});
