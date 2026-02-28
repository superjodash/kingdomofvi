import type { LessonDef } from './lessons/types.ts';
import type { LessonProgress } from './types.ts';

export function getAllowedKeys(
  lessonId: number,
  allLessons: LessonDef[],
): Set<string> {
  const keys = new Set<string>();
  for (const lesson of allLessons) {
    if (lesson.id <= lessonId) {
      for (const key of lesson.unlocks) {
        keys.add(key);
      }
    }
  }
  keys.add('Esc');
  keys.add('Enter');
  return keys;
}

export function getArenaAllowedKeys(
  lessonId: number,
  allLessons: LessonDef[],
): Set<string> {
  const keys = getAllowedKeys(lessonId, allLessons);
  const lesson = allLessons.find((l) => l.id === lessonId);
  if (lesson?.arena.arrowsAllowed) {
    keys.add('ArrowLeft');
    keys.add('ArrowRight');
    keys.add('ArrowUp');
    keys.add('ArrowDown');
  }
  return keys;
}

export function isLessonAccessible(
  lessonId: number,
  progress: LessonProgress[],
): boolean {
  if (lessonId === 1) return true;
  const prereq = progress.find((p) => p.lessonId === lessonId - 1);
  return prereq?.completed ?? false;
}

export function getUnlockedKeysThrough(
  lessonId: number,
  allLessons: LessonDef[],
): string[] {
  return Array.from(getAllowedKeys(lessonId, allLessons)).sort();
}

export function initializeProgress(totalLessons: number): LessonProgress[] {
  return Array.from({ length: totalLessons }, (_, i) => ({
    lessonId: i + 1,
    completed: false,
    bestGems: 0,
    attempts: 0,
  }));
}

export function updateLessonProgress(
  progress: LessonProgress[],
  lessonId: number,
  gems: number,
): LessonProgress[] {
  return progress.map((p) => {
    if (p.lessonId !== lessonId) return p;
    return {
      ...p,
      completed: true,
      bestGems: Math.max(p.bestGems, gems),
      attempts: p.attempts + 1,
    };
  });
}

export function getTotalGems(progress: LessonProgress[]): number {
  return progress.reduce((sum, p) => sum + p.bestGems, 0);
}
