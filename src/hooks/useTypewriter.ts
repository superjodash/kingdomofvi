import { useState, useEffect, useRef } from 'react';

/**
 * Typewriter effect hook. Reveals text character by character
 * with accelerating speed.
 */

export function useTypewriter(
  fullText: string,
  startDelay = 500,
  minInterval = 5,
  maxInterval = 50,
): { text: string; done: boolean } {
  const [charIndex, setCharIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (charIndex >= fullText.length) return;

    // Accelerating: start slow, get faster
    const progress = charIndex / fullText.length;
    const interval = maxInterval - (maxInterval - minInterval) * progress;

    const delay = charIndex === 0 ? startDelay : interval;

    timerRef.current = setTimeout(() => {
      setCharIndex((i) => i + 1);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [charIndex, fullText, startDelay, minInterval, maxInterval]);

  return {
    text: fullText.slice(0, charIndex),
    done: charIndex >= fullText.length,
  };
}
