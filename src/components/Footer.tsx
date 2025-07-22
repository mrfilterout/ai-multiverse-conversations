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
        
        <div className="mt-4 pt-4 border-t border-green-500/20">
          <p className="text-sm font-mono mb-2">
            <span className="text-green-400">$</span> git clone{' '}
            <a 
              href="https://github.com/mrfilterout/ai-multiverse-conversations" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              https://github.com/mrfilterout/ai-multiverse-conversations
            </a>
          </p>
          
          <p className="text-sm font-mono text-yellow-400 mb-2">
            <span className="text-green-400">$</span> echo: 2drtU4NK8phW7pVuwoyXmbxVpu7aU9k3okN3L4yGbonk
          </p>
          
          <p className="text-sm font-mono text-purple-400">
            <span className="text-green-400">$</span> creator wallet for donation:{' '}
            <span className="text-purple-300 break-all">echowA95csPfyLGnP8xYhtdrf6AaviGwyUdbvj8sQez</span>
          </p>
          
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-sm font-mono">
              <span className="text-green-400">$</span> X:{' '}
              <a 
                href="https://x.com/EchoChainVerse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                @EchoChainVerse
              </a>
            </p>
            
            <p className="text-sm font-mono">
              <span className="text-green-400">$</span> Community:{' '}
              <a 
                href="https://x.com/i/communities/1947665111608340658" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Join X Community
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}