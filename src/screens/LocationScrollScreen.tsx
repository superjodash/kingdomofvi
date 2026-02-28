import { useKeyCapture } from '../hooks/useKeyCapture.ts';
import { useTypewriter } from '../hooks/useTypewriter.ts';
import { ScrollModal } from '../components/ScrollModal.tsx';
import type { LessonDef } from '../game/lessons/types.ts';

interface LocationScrollScreenProps {
  lesson: LessonDef;
  onContinue: () => void;
  onBack: () => void;
}

export function LocationScrollScreen({ lesson, onContinue, onBack }: LocationScrollScreenProps) {
  const { text: vignetteText, done: vignetteDone } = useTypewriter(lesson.scroll.vignette, 300, 10, 60);
  const { text: storyText, done: storyDone } = useTypewriter(
    vignetteDone ? lesson.scroll.storyBeat : '',
    200, 5, 30,
  );

  useKeyCapture((key) => {
    if (key === 'Enter' && storyDone) onContinue();
    if (key === 'Esc') onBack();
  });

  return (
    <ScrollModal onContinue={onContinue} onBack={onBack}>
      <pre className="text-center whitespace-pre-wrap mb-4 text-amber-800 font-bold">
        {vignetteText}
      </pre>
      {vignetteDone && (
        <>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{storyText}</p>
          {storyDone && (
            <div className="mt-4 pt-3 border-t border-amber-300">
              <p className="text-xs font-bold text-amber-700">New Power:</p>
              <p className="text-sm text-amber-900 font-mono">{lesson.scroll.newPowerDescription}</p>
            </div>
          )}
        </>
      )}
    </ScrollModal>
  );
}
