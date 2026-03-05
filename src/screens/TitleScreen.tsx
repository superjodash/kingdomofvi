import { useState } from 'react';
import titleImage from '../assets/title.png';
import { useKeyCapture } from '../hooks/useKeyCapture.ts';

interface TitleScreenProps {
  hasSavedGame: boolean;
  onNewGame: () => void;
  onContinue: () => void;
}

const MENU_ITEMS = ['New Game', 'Continue'] as const;

export function TitleScreen({ hasSavedGame, onNewGame, onContinue }: TitleScreenProps) {
  const [selected, setSelected] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const items = hasSavedGame ? MENU_ITEMS : (['New Game'] as const);

  useKeyCapture((key) => {
    if (confirmReset) {
      if (key === 'y' || key === 'Y' || key === 'Enter') {
        onNewGame();
      } else if (key === 'n' || key === 'N' || key === 'Esc') {
        setConfirmReset(false);
      }
      return;
    }

    if (key === 'j' || key === 'ArrowDown') {
      setSelected((s) => Math.min(s + 1, items.length - 1));
    } else if (key === 'k' || key === 'ArrowUp') {
      setSelected((s) => Math.max(s - 1, 0));
    } else if (key === 'Enter') {
      if (items[selected] === 'New Game') {
        if (hasSavedGame) setConfirmReset(true);
        else onNewGame();
      } else if (items[selected] === 'Continue') {
        onContinue();
      }
    }
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <img
        src={titleImage}
        alt="Kingdom of VI"
        className="mb-8 w-full max-w-2xl h-auto"
      />
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={item}
            className={`text-center font-mono text-lg px-4 py-1 ${
              i === selected
                ? 'text-amber-400 bg-gray-800'
                : 'text-gray-500'
            }`}
          >
            {i === selected ? '> ' : '  '}{item}
          </div>
        ))}
      </div>

      {confirmReset && (
        <div className="mt-6 font-mono text-xs text-center border border-red-700 bg-red-950 px-4 py-3 text-red-200">
          <div className="mb-1">Start a new game and erase all current progress?</div>
          <div>[Enter/Y] Yes  [Esc/N] Cancel</div>
        </div>
      )}

      <div className="mt-8 text-gray-600 text-xs font-mono">
        {confirmReset
          ? 'Confirm restart'
          : '[j/k] Navigate  [Enter] Select'}
      </div>
    </div>
  );
}

export default TitleScreen;
