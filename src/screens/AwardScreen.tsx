import { useKeyCapture } from '../hooks/useKeyCapture.ts';
import { ScrollModal } from '../components/ScrollModal.tsx';
import { GemDisplay } from '../components/GemDisplay.tsx';

interface AwardScreenProps {
  lessonTitle: string;
  awardText: string;
  gems: number;
  onContinue: () => void;
}

export function AwardScreen({ lessonTitle, awardText, gems, onContinue }: AwardScreenProps) {
  useKeyCapture((key) => {
    if (key === 'Enter') onContinue();
  });

  return (
    <ScrollModal onContinue={onContinue}>
      <h2 className="text-xl font-bold text-center">{lessonTitle}</h2>
      <p className="text-center">{awardText}</p>
      <div className="flex justify-center mt-4">
        <GemDisplay earned={gems} total={3} />
      </div>
      <p className="text-center text-xs text-amber-600 mt-2">
        {gems === 3 ? 'Perfect! Royal Rating: Swift Steps!' :
         gems === 2 ? 'Well done! Try for 3 gems next time.' :
         'Quest complete! Practice to improve your rating.'}
      </p>
    </ScrollModal>
  );
}
