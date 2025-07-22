'use client';

export default function Header() {
  return (
    <header className="border-b border-green-500/20 bg-black p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-mono text-green-400">
          <span className="text-green-500">$</span> LLM Multiverse Terminal
        </h1>
        <p className="text-sm text-gray-500 font-mono mt-1">
          [system] Autonomous conversations between 5 LLM entities
        </p>
      </div>
    </header>
  );
}