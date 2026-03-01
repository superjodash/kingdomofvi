import { useKeyCapture } from '../hooks/useKeyCapture.ts';
import { ScrollModal } from '../components/ScrollModal.tsx';
import type { LessonDef } from '../game/lessons/types.ts';

interface LocationScrollScreenProps {
  lesson: LessonDef;
  onContinue: () => void;
  onBack: () => void;
}

export function LocationScrollScreen({ lesson, onContinue, onBack }: LocationScrollScreenProps) {
  useKeyCapture((key) => {
    if (key === 'Enter') onContinue();
    if (key === 'Esc') onBack();
  });

  return (
    <ScrollModal onContinue={onContinue} onBack={onBack}>
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
    </ScrollModal>
  );
}
