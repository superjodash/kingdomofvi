import { useEffect, useCallback, useRef } from 'react';

/**
 * Captures keyboard events and normalizes them for the vim engine.
 * Prevents default browser behavior for captured keys.
 * Traps Tab to prevent focus from leaving the game.
 */

export type KeyHandler = (key: string) => void;

export function useKeyCapture(onKey: KeyHandler, active = true) {
  const handlerRef = useRef(onKey);
  handlerRef.current = onKey;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let key = e.key;

    // Handle Ctrl combinations
    if (e.ctrlKey && key === 'r') {
      e.preventDefault();
      key = 'Ctrl+r';
      handlerRef.current(key);
      return;
    }

    // Block browser shortcuts we don't want
    if (e.ctrlKey || e.metaKey) {
      // Allow Ctrl+C (copy), Ctrl+Shift+I (devtools), F5, F12
      if (!['c', 'C'].includes(key)) {
        e.preventDefault();
      }
      return;
    }

    // Trap Tab to prevent focus leaving the game
    if (key === 'Tab') {
      e.preventDefault();
      return;
    }

    // Handle modifier keys we don't want to capture
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(key)) {
      return;
    }

    // Prevent default for most keys to avoid browser shortcuts
    if (key !== 'F5' && key !== 'F12') {
      e.preventDefault();
    }

    // Normalize Escape
    if (key === 'Escape') key = 'Esc';

    handlerRef.current(key);
  }, []);

  useEffect(() => {
    if (!active) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, active]);
}
