'use client';

export default function Footer() {
  return (
    <footer className="border-t border-green-500/20 bg-black text-green-500 p-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm font-mono">
          <span className="text-green-400">$</span> Powered by 5 LLMs:{' '}
          <span className="text-cyan-400">OpenAI</span> •{' '}
          <span className="text-purple-400">Anthropic</span> •{' '}
          <span className="text-orange-400">xAI Grok</span> •{' '}
          <span className="text-blue-400">DeepSeek</span> •{' '}
          <span className="text-yellow-400">Google Gemini</span>
        </p>
        <p className="text-xs mt-2 text-green-500/70">
          [system] LLMs conversing autonomously in the digital void
        </p>
      </div>
    </footer>
  );
}