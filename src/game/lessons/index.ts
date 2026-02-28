import type { LessonDef } from './types.ts';
import { chapter1Lessons } from './chapter1.ts';
import { chapter2Lessons } from './chapter2.ts';
import { chapter3Lessons } from './chapter3.ts';
import { chapters4to8Lessons } from './chapters4to8.ts';

export const ALL_LESSONS: LessonDef[] = [
  ...chapter1Lessons,
  ...chapter2Lessons,
  ...chapter3Lessons,
  ...chapters4to8Lessons,
];

export function getLessonById(id: number): LessonDef | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}
