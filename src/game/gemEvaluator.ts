import type { GemContext, GemCheck, LessonDef } from './lessons/types.ts';
import type { KeystrokeState } from './keystrokeTracker.ts';
import { buildGemContext } from './keystrokeTracker.ts';

/**
 * Evaluates gem criteria for a completed lesson.
 * Returns 0-3 gems earned.
 */

export function evaluateGems(
  lesson: LessonDef,
  keystrokeState: KeystrokeState,
  finalLines: string[],
): number {
  const targetLines = lesson.arena.targetBuffer
    ? lesson.arena.targetBuffer.split('\n')
    : null;

  const ctx = buildGemContext(keystrokeState, finalLines, targetLines);

  let gems = 0;

  if (checkGem(lesson.gems.gem1, ctx)) gems++;
  if (gems > 0 && checkGem(lesson.gems.gem2, ctx)) gems++;
  if (gems > 1 && lesson.gems.gem3 && checkGem(lesson.gems.gem3, ctx)) gems++;

  return gems;
}

function checkGem(check: GemCheck, ctx: GemContext): boolean {
  try {
    return check(ctx);
  } catch {
    return false;
  }
}

// Common gem check helpers used in lesson definitions

export function bufferMatchesTarget(ctx: GemContext): boolean {
  if (!ctx.targetLines) return false;
  if (ctx.finalLines.length !== ctx.targetLines.length) return false;
  return ctx.finalLines.every((line, i) => line === ctx.targetLines![i]);
}

export function totalKeystrokesUnder(max: number): GemCheck {
  return (ctx) => ctx.totalKeystrokes <= max;
}

export function usedKey(key: string, minTimes = 1): GemCheck {
  return (ctx) => (ctx.keyCounts[key] ?? 0) >= minTimes;
}

export function usedComposed(command: string, minTimes = 1): GemCheck {
  return (ctx) => (ctx.composedCounts[command] ?? 0) >= minTimes;
}

export function visitedPositions(minPositions: number): GemCheck {
  return (ctx) => ctx.cursorVisited.size >= minPositions;
}

export function modeChangesUnder(max: number): GemCheck {
  return (ctx) => ctx.modeChanges <= max;
}
