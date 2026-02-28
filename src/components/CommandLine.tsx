interface CommandLineProps {
  text: string;
  searchBuffer: string | null;
}

export function CommandLine({ text, searchBuffer }: CommandLineProps) {
  if (searchBuffer !== null) {
    return (
      <div className="h-6 px-2 bg-black text-green-400 font-mono text-sm flex items-center">
        <span className="text-yellow-400">/</span>
        <span>{searchBuffer}</span>
        <span className="cursor-line animate-pulse">|</span>
      </div>
    );
  }

  if (text !== undefined && text !== '') {
    return (
      <div className="h-6 px-2 bg-black text-green-400 font-mono text-sm flex items-center">
        <span className="text-yellow-400">:</span>
        <span>{text}</span>
        <span className="cursor-line animate-pulse">|</span>
      </div>
    );
  }

  return <div className="h-6 px-2 bg-black" />;
}
