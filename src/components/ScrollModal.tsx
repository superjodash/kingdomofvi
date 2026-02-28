import type { ReactNode } from 'react';

/**
 * Parchment scroll modal overlay.
 * Used for location scrolls and award screens.
 */

interface ScrollModalProps {
  children: ReactNode;
  onContinue: () => void;
  onBack?: () => void;
}

export function ScrollModal({ children, onContinue, onBack }: ScrollModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50" onClick={onContinue}>
      <div className="parchment max-w-xl w-full mx-4 p-8 rounded border-2 border-amber-700 bg-amber-50 text-amber-900 font-mono text-sm" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-4">
          {children}
        </div>
        <div className="mt-6 flex justify-between text-xs">
          {onBack && (
            <button onClick={onBack} className="text-amber-600 hover:text-amber-800">[Esc] Back</button>
          )}
          <button onClick={onContinue} className="text-amber-600 hover:text-amber-800 ml-auto">[Enter] Continue</button>
        </div>
      </div>
    </div>
  );
}
