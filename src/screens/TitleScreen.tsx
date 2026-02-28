import { useState } from 'react';
import { useKeyCapture } from '../hooks/useKeyCapture.ts';

interface TitleScreenProps {
  hasSavedGame: boolean;
  onNewGame: () => void;
  onContinue: () => void;
}

const MENU_ITEMS = ['New Game', 'Continue'] as const;

export function TitleScreen({ hasSavedGame, onNewGame, onContinue }: TitleScreenProps) {
  const [selected, setSelected] = useState(0);
  const items = hasSavedGame ? MENU_ITEMS : (['New Game'] as const);

  useKeyCapture((key) => {
    if (key === 'j' || key === 'ArrowDown') {
      setSelected((s) => Math.min(s + 1, items.length - 1));
    } else if (key === 'k' || key === 'ArrowUp') {
      setSelected((s) => Math.max(s - 1, 0));
    } else if (key === 'Enter') {
      if (items[selected] === 'New Game') onNewGame();
      else if (items[selected] === 'Continue') onContinue();
    }
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <pre className="terminal-text text-green-400 text-center mb-8">
{`
          .     *    .        .
     *        |>>>        .
    .        /___\\     *     .
        .   |[] []|    .
     *      |_____|  .     *
            |     |
          __|_____|__
         /           \\
        / Kingdom of  \\
       /      VI       \\
      /________________ \\
`}
      </pre>
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
      <div className="mt-8 text-gray-600 text-xs font-mono">
        [j/k] Navigate  [Enter] Select
      </div>
    </div>
  );
}
