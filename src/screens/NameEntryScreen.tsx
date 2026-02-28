import { useState } from 'react';
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
    <div className="flex-1 flex flex-col items-center justify-center">
      <pre className="terminal-text text-green-400 text-center mb-6">
{`
  The Royal Scribe asks:
  "What name shall I record
   in the ledger?"
`}
      </pre>
      <div className="font-mono text-lg mb-2 text-gray-400">
        Your name, traveler:
      </div>
      <div className="font-mono text-xl text-amber-400 min-h-8 border-b border-amber-700 min-w-48 text-center px-2">
        {name}<span className="animate-pulse">_</span>
      </div>
      <div className="mt-8 text-gray-600 text-xs font-mono">
        Type your name, then press [Enter]
      </div>
    </div>
  );
}
