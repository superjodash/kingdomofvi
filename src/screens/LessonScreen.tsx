import { useCallback, useEffect, useLayoutEffect, useState, useRef } from 'react';
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
  const [showEscHint, setShowEscHint] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // For lessons WITH a targetBuffer, auto-complete when buffer matches
  useEffect(() => {
    if (hasTarget && isComplete && !completedRef.current) {
      completedRef.current = true;
      const gems = evaluateGems(lesson, keystrokeState, lines);
      onComplete(gems);
    }
  }, [hasTarget, isComplete, lesson, keystrokeState, lines, onComplete]);

  // For lessons WITHOUT a targetBuffer, track when all quest objectives are met
  const [questReady, setQuestReady] = useState(false);

  useEffect(() => {
    if (hasTarget || completedRef.current) return;

    const targetLines = lesson.arena.targetBuffer
      ? lesson.arena.targetBuffer.split('\n')
      : null;
    const ctx = buildGemContext(keystrokeState, lines, targetLines);

    try {
      const obj1 = lesson.gems.gem1(ctx);
      const obj2 = lesson.gems.gem2(ctx);
      if (obj1 && obj2) {
        setQuestReady(true);
      }
    } catch {
      // gem check failed
    }
  }, [hasTarget, keystrokeState, lines, lesson]);

  const handleKey = useCallback((key: string) => {
    if (completedRef.current) return;

    // Dismiss the scroll reference overlay
    if (showScroll) {
      if (key === 'Esc' || key === 'q' || key === 'F1') {
        setShowScroll(false);
      }
      return;
    }

    // F1 opens the lesson scroll for reference
    if (key === 'F1') {
      setShowScroll(true);
      return;
    }

    // Dismiss the Esc hint on any key
    if (showEscHint) {
      setShowEscHint(false);
      return;
    }

    // Show hint when pressing Esc in normal mode
    if (key === 'Esc' && state.mode === 'normal') {
      setShowEscHint(true);
      return;
    }

    const result = processKey(key);

    // Handle :q and :q! to exit (checked first — ex commands take priority)
    if (result.exResult?.type === 'quit' || result.exResult?.type === 'force-quit') {
      onQuit();
      return;
    }

    // For no-target lessons, Enter on the quest-complete overlay finishes
    if (!hasTarget && questReady && key === 'Enter') {
      completedRef.current = true;
      const gems = evaluateGems(lesson, keystrokeState, lines);
      onComplete(gems);
      return;
    }
  }, [onComplete, onQuit, processKey, hasTarget, questReady, lesson, keystrokeState, lines, showEscHint, showScroll, state.mode]);

  useKeyCapture(handleKey);

  // Auto-scroll the buffer viewport to keep the cursor visible
  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const lineHeight = 20; // h-5 = 1.25rem = 20px
    const cursorTop = state.cursor.line * lineHeight;
    const cursorBottom = cursorTop + lineHeight;

    if (cursorBottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = cursorBottom - container.clientHeight;
    }
    if (cursorTop < container.scrollTop) {
      container.scrollTop = cursorTop;
    }
  }, [state.cursor.line]);

  const buf = state.buffers[state.activeBufferIndex];

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto buffer-viewport">
        <BufferRenderer
          lines={lines}
          cursor={state.cursor}
          mode={state.mode}
          selection={state.selection}
        />
      </div>
      <CommandLine
        text={state.commandLineText}
        searchBuffer={searchBuffer}
      />
      <StatusLine
        mode={state.mode}
        cursor={state.cursor}
        fileName=""
        modified={buf.modified}
        message={state.message}
      />
      {showEscHint && <EscHintModal />}
      {showScroll && <LessonScrollOverlay lesson={lesson} />}
      {questReady && !hasTarget && !completedRef.current && <QuestCompleteOverlay />}
    </div>
  );
}

function EscHintModal() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
      <div className="font-mono text-sm text-center leading-6">
        <pre className="text-amber-400">{`
  +-------------------------------+
  |                               |
  |   To exit a lesson, type:     |
  |                               |
  |       :q  then  Enter         |
  |                               |
  |   F1  opens lesson reference  |
  |                               |
  |   Press any key to dismiss    |
  +-------------------------------+
        `.trim()}</pre>
      </div>
    </div>
  );
}

function LessonScrollOverlay({ lesson }: { lesson: LessonDef }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
      <div className="parchment max-w-xl w-full mx-4 p-8 rounded border-2 border-amber-700 bg-amber-50 text-amber-900 font-mono text-sm max-h-[80vh] overflow-y-auto">
        <pre className="whitespace-pre mb-4 text-amber-800 font-bold">
          {lesson.scroll.vignette}
        </pre>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{lesson.story}</p>
        <div className="mt-4 pt-3 border-t border-amber-300">
          <p className="text-xs font-bold text-amber-700 mb-1">New Keys:</p>
          <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{lesson.teach}</p>
        </div>
        <div className="mt-3 pt-2 border-t border-amber-300">
          <p className="text-xs font-bold text-amber-700">Summary:</p>
          <p className="text-sm text-amber-900 font-mono">{lesson.scroll.newPowerDescription}</p>
        </div>
        <div className="mt-4 text-center text-xs text-amber-600">
          Press Esc or q to close
        </div>
      </div>
    </div>
  );
}

function QuestCompleteOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
      <div className="font-mono text-sm text-center leading-6">
        <pre className="text-amber-400">{`
  +-------------------------------+
  |                               |
  |       Quest Complete!         |
  |                               |
  |     Press Enter to finish     |
  |                               |
  +-------------------------------+
        `.trim()}</pre>
      </div>
    </div>
  );
}
