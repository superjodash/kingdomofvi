import { useCallback, useEffect, useState, useRef } from 'react';
import { useEditor } from '../hooks/useEditor.ts';
import { useKeyCapture } from '../hooks/useKeyCapture.ts';
import { BufferRenderer } from '../components/BufferRenderer.tsx';
import { StatusLine } from '../components/StatusLine.tsx';
import { CommandLine } from '../components/CommandLine.tsx';
import { evaluateGems } from '../game/gemEvaluator.ts';
import { buildGemContext } from '../game/keystrokeTracker.ts';
import type { LessonDef } from '../game/lessons/types.ts';

interface LessonScreenProps {
  lesson: LessonDef;
  allowedKeys: Set<string>;
  onComplete: (gems: number) => void;
  onQuit: () => void;
}

export function LessonScreen({ lesson, allowedKeys, onComplete, onQuit }: LessonScreenProps) {
  const { lines, state, keystrokeState, processKey, isComplete, searchBuffer } = useEditor({
    initialBuffer: lesson.arena.initialBuffer,
    targetBuffer: lesson.arena.targetBuffer,
    allowedKeys,
    fileName: lesson.title,
  });

  const completedRef = useRef(false);
  const hasTarget = !!lesson.arena.targetBuffer;

  // For lessons WITH a targetBuffer, auto-complete when buffer matches
  useEffect(() => {
    if (hasTarget && isComplete && !completedRef.current) {
      completedRef.current = true;
      const gems = evaluateGems(lesson, keystrokeState, lines);
      onComplete(gems);
    }
  }, [hasTarget, isComplete, lesson, keystrokeState, lines, onComplete]);

  // For lessons WITHOUT a targetBuffer, track when gem1 is met
  const [questReady, setQuestReady] = useState(false);

  useEffect(() => {
    if (hasTarget || completedRef.current) return;

    const targetLines = lesson.arena.targetBuffer
      ? lesson.arena.targetBuffer.split('\n')
      : null;
    const ctx = buildGemContext(keystrokeState, lines, targetLines);

    try {
      if (lesson.gems.gem1(ctx)) {
        setQuestReady(true);
      }
    } catch {
      // gem check failed
    }
  }, [hasTarget, keystrokeState, lines, lesson]);

  const handleKey = useCallback((key: string) => {
    if (completedRef.current) return;

    // For no-target lessons, Enter when quest is ready completes the lesson
    if (!hasTarget && questReady && key === 'Enter') {
      completedRef.current = true;
      const gems = evaluateGems(lesson, keystrokeState, lines);
      onComplete(gems);
      return;
    }

    processKey(key);
  }, [onComplete, processKey, hasTarget, questReady, lesson, keystrokeState, lines]);

  useKeyCapture(handleKey);

  const buf = state.buffers[state.activeBufferIndex];

  return (
    <div className="flex-1 flex flex-col">
      <BufferRenderer
        lines={lines}
        cursor={state.cursor}
        mode={state.mode}
        selection={state.selection}
      />
      <CommandLine
        text={state.commandLineText}
        searchBuffer={searchBuffer}
      />
      <StatusLine
        mode={state.mode}
        cursor={state.cursor}
        fileName={buf.fileName}
        modified={buf.modified}
        message={questReady && !hasTarget && !completedRef.current
          ? 'Quest complete! Press Enter to finish.'
          : state.message}
      />
    </div>
  );
}
