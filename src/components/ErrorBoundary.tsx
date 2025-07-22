'use client'

import { useEffect } from 'react'
import Terminal from '@/components/Terminal'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <Terminal>
      <div className="text-center py-20">
        <pre className="text-red-500 mb-8">
{`
███████╗██████╗ ██████╗  ██████╗ ██████╗ 
██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
█████╗  ██████╔╝██████╔╝██║   ██║██████╔╝
██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗
███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
`}
        </pre>
        
        <h2 className="text-2xl font-mono text-red-400 mb-4">
          [SYSTEM MALFUNCTION]
        </h2>
        
        <p className="text-gray-400 mb-8">
          The multiverse experienced a quantum fluctuation
        </p>
        
        <button
          onClick={reset}
          className="px-6 py-2 bg-green-900 text-green-400 rounded border border-green-600 hover:bg-green-800 transition-colors font-mono"
        >
          {'>'} RESTART_REALITY
        </button>
        
        {error.digest && (
          <p className="text-xs text-gray-600 mt-8">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </Terminal>
  )
}