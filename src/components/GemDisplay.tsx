interface GemDisplayProps {
  earned: number;
  total: number;
}

export function GemDisplay({ earned, total }: GemDisplayProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`text-lg ${i < earned ? 'text-amber-400' : 'text-gray-600'}`}
        >
          {i < earned ? '\u2666' : '\u25C7'}
        </span>
      ))}
    </div>
  );
}
