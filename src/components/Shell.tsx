import type { ReactNode } from 'react';

/**
 * Terminal shell container. Everything renders inside this.
 * Provides the CRT/terminal aesthetic.
 */

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="terminal min-h-screen flex flex-col bg-black text-green-400 font-mono">
      {children}
    </div>
  );
}
