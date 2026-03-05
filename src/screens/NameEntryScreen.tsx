import { useState } from 'react';
import scrollImage from '../assets/scroll.png';
import { useKeyCapture } from '../hooks/useKeyCapture.ts';

interface NameEntryScreenProps {
  onSubmit: (name: string) => void;
}

export function NameEntryScreen({ onSubmit }: NameEntryScreenProps) {
  const [name, setName] = useState('');

  useKeyCapture((key) => {
    if (key === 'Enter' && name.trim().length > 0) {
      onSubmit(name.trim());
    } else if (key === 'Backspace') {
      setName((n) => n.slice(0, -1));
    } else if (key === 'Esc') {
      setName('');
    } else if (key.length === 1 && name.length < 20) {
      setName((n) => n + key);
    }
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="relative w-full max-w-[640px] md:max-w-[700px]">
        <img
          src={scrollImage}
          alt="Ancient scroll"
          className="w-full h-auto select-none pointer-events-none drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
        />

        <div className="absolute left-[17%] right-[17%] top-[22%] bottom-[21%] flex flex-col items-center justify-start">
          <pre className="scroll-text text-left text-[clamp(1.08rem,1.65vw,1.34rem)] leading-[1.45] text-amber-950 whitespace-pre-wrap">
{`The Royal Scribe asks:
"What name shall I record in the ledger?"
Your name, traveler:`}
          </pre>

          <div className="mt-4 w-full max-w-md scroll-input text-[clamp(1.15rem,2.1vw,1.5rem)] text-amber-900 min-h-10 border-b-2 border-amber-900/70 text-center px-2">
            {name}<span className="animate-pulse">_</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-gray-500 text-xs font-mono">
        Type your name, then press [Enter]
      </div>
    </div>
  );
}
