import { describe, it, expect } from 'vitest';
import type { LessonDef } from '../lessons/types.ts';
import type { LessonProgress } from '../types.ts';
import {
  getAllowedKeys,
  getArenaAllowedKeys,
  isLessonAccessible,
  getUnlockedKeysThrough,
  initializeProgress,
  updateLessonProgress,
  getTotalGems,
} from '../progression.ts';

// Minimal lesson stubs for testing
const stubLessons: LessonDef[] = [
  {
    id: 1,
    chapter: 1,
    title: 'Lesson 1',
    subtitle: 'sub1',
    mapLabel: 'L1',
    unlocks: ['h', 'j', 'k', 'l'],
    prerequisite: null,
    scroll: { vignette: '', storyBeat: '', newPowerDescription: '' },
    arena: { initialBuffer: '', arrowsAllowed: true },
    gems: { gem1: () => true, gem2: () => false, gem3: null },
    award: { text: '' },
  },
  {
    id: 2,
    chapter: 1,
    title: 'Lesson 2',
    subtitle: 'sub2',
    mapLabel: 'L2',
    unlocks: ['w', 'b'],
    prerequisite: 1,
    scroll: { vignette: '', storyBeat: '', newPowerDescription: '' },
    arena: { initialBuffer: '', arrowsAllowed: false },
    gems: { gem1: () => true, gem2: () => true, gem3: () => false },
    award: { text: '' },
  },
  {
    id: 3,
    chapter: 2,
    title: 'Lesson 3',
    subtitle: 'sub3',
    mapLabel: 'L3',
    unlocks: ['d', 'x'],
    prerequisite: 2,
    scroll: { vignette: '', storyBeat: '', newPowerDescription: '' },
    arena: { initialBuffer: '', arrowsAllowed: false },
    gems: { gem1: () => true, gem2: () => true, gem3: () => true },
    award: { text: '' },
  },
];

describe('getAllowedKeys', () => {
  it('returns keys from lesson 1', () => {
    const keys = getAllowedKeys(1, stubLessons);
    expect(keys.has('h')).toBe(true);
    expect(keys.has('j')).toBe(true);
    expect(keys.has('k')).toBe(true);
    expect(keys.has('l')).toBe(true);
    // Always includes Esc and Enter
    expect(keys.has('Esc')).toBe(true);
    expect(keys.has('Enter')).toBe(true);
    // Does not include lesson 2 keys
    expect(keys.has('w')).toBe(false);
  });

  it('accumulates keys through lesson 2', () => {
    const keys = getAllowedKeys(2, stubLessons);
    expect(keys.has('h')).toBe(true);
    expect(keys.has('w')).toBe(true);
    expect(keys.has('b')).toBe(true);
    expect(keys.has('d')).toBe(false);
  });

  it('accumulates all keys through lesson 3', () => {
    const keys = getAllowedKeys(3, stubLessons);
    expect(keys.has('h')).toBe(true);
    expect(keys.has('w')).toBe(true);
    expect(keys.has('d')).toBe(true);
    expect(keys.has('x')).toBe(true);
  });
});

describe('getArenaAllowedKeys', () => {
  it('adds arrow keys when arrowsAllowed is true', () => {
    const keys = getArenaAllowedKeys(1, stubLessons);
    expect(keys.has('ArrowLeft')).toBe(true);
    expect(keys.has('ArrowRight')).toBe(true);
    expect(keys.has('ArrowUp')).toBe(true);
    expect(keys.has('ArrowDown')).toBe(true);
  });

  it('does not add arrow keys when arrowsAllowed is false', () => {
    const keys = getArenaAllowedKeys(2, stubLessons);
    expect(keys.has('ArrowLeft')).toBe(false);
  });
});

describe('isLessonAccessible', () => {
  it('lesson 1 is always accessible', () => {
    expect(isLessonAccessible(1, [])).toBe(true);
  });

  it('lesson 2 requires lesson 1 completed', () => {
    const progress: LessonProgress[] = [
      { lessonId: 1, completed: true, bestGems: 1, attempts: 1 },
    ];
    expect(isLessonAccessible(2, progress)).toBe(true);
  });

  it('lesson 2 not accessible if lesson 1 not completed', () => {
    const progress: LessonProgress[] = [
      { lessonId: 1, completed: false, bestGems: 0, attempts: 0 },
    ];
    expect(isLessonAccessible(2, progress)).toBe(false);
  });

  it('returns false if prerequisite not in progress array', () => {
    expect(isLessonAccessible(2, [])).toBe(false);
  });
});

describe('getUnlockedKeysThrough', () => {
  it('returns sorted array of keys', () => {
    const keys = getUnlockedKeysThrough(1, stubLessons);
    expect(keys).toEqual(['Enter', 'Esc', 'h', 'j', 'k', 'l']);
  });
});

describe('initializeProgress', () => {
  it('creates progress for N lessons', () => {
    const progress = initializeProgress(3);
    expect(progress).toEqual([
      { lessonId: 1, completed: false, bestGems: 0, attempts: 0 },
      { lessonId: 2, completed: false, bestGems: 0, attempts: 0 },
      { lessonId: 3, completed: false, bestGems: 0, attempts: 0 },
    ]);
  });
});

describe('updateLessonProgress', () => {
  it('marks lesson completed and records gems', () => {
    const progress = initializeProgress(3);
    const updated = updateLessonProgress(progress, 1, 2);
    expect(updated[0]).toEqual({
      lessonId: 1,
      completed: true,
      bestGems: 2,
      attempts: 1,
    });
  });

  it('keeps best gems on replay', () => {
    let progress = initializeProgress(3);
    progress = updateLessonProgress(progress, 1, 3);
    progress = updateLessonProgress(progress, 1, 1);
    expect(progress[0].bestGems).toBe(3);
    expect(progress[0].attempts).toBe(2);
  });

  it('does not modify other lessons', () => {
    const progress = initializeProgress(3);
    const updated = updateLessonProgress(progress, 2, 1);
    expect(updated[0]).toEqual(progress[0]);
    expect(updated[2]).toEqual(progress[2]);
  });
});

describe('getTotalGems', () => {
  it('sums best gems', () => {
    const progress: LessonProgress[] = [
      { lessonId: 1, completed: true, bestGems: 3, attempts: 1 },
      { lessonId: 2, completed: true, bestGems: 2, attempts: 1 },
      { lessonId: 3, completed: false, bestGems: 0, attempts: 0 },
    ];
    expect(getTotalGems(progress)).toBe(5);
  });
});
