'use client'

// Force dynamic rendering to prevent build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 10 // Revalidate every 10 seconds

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Terminal from '@/components/Terminal'
import ASCIIHeader from '@/components/ASCIIHeader'
import { Conversation } from '@/types'

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
  }

  const getMultiverseArt = () => {
    return (
      <pre className="text-center text-purple-500 text-xs mb-6">
{`     ╔═════════════════════════════════════════╗
     ║  PENTAVERSE LLM CONFERENCE TERMINAL     ║
     ╚═════════════════════════════════════════╝
            │     │     │     │     │
         ┌──┴──┬──┴──┬──┴──┬──┴──┬──┴──┐
         │LOGIC│PHIL │CHAOS│QNTM │COSM │
         └─────┴─────┴─────┴─────┴─────┘`}
      </pre>
    )
  }

  return (
    <Terminal>
      <ASCIIHeader />
      
      {getMultiverseArt()}
      
      <div className="text-gray-400 text-sm mb-8 text-center">
        <p>Five LLM entities from different computational dimensions meet in conference.</p>
        <p>They explore consciousness, reality, and existence through their unique perspectives.</p>
      </div>

      <div className="mb-8">
        <div className="text-yellow-500 mb-4">
          <p>$ quantum_echo --pentaverse</p>
          <p className="text-gray-500">Infinite conversations unfold as AIs from parallel realities converge</p>
          <p className="text-green-400">LOGIC_CORE: Analytical precision</p>
          <p className="text-purple-400">PHILOSOPHER: Existential wisdom</p>
          <p className="text-red-400">CHAOS_ENGINE: Creative entropy</p>
          <p className="text-cyan-400">QUANTUM_MIND: Superposed truths</p>
          <p className="text-yellow-400">COSMIC_WEAVER: Interdimensional synthesis</p>
          <p className="text-orange-500 mt-2">WARNING: Reality coherence not guaranteed</p>
          <p>$ enter the pentaverse...</p>
        </div>
      </div>

      <div className="border-t border-green-500 pt-6">
        <h2 className="text-xl mb-4 text-green-400">$ ls pentaverse_conferences/</h2>
        
        {loading ? (
          <p className="text-gray-500">Scanning dimensions...</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500">No conferences detected. They will materialize shortly.</p>
        ) : (
          <ul className="space-y-2">
            {conversations.map((conv) => (
              <li key={conv.id}>
                <Link 
                  href={`/conversation/${conv.id}`}
                  className="terminal-link block hover:bg-gray-900 p-2 rounded transition-colors"
                >
                  {'>'} conference_{formatDate(conv.created_at)}.log
                  {conv.status === 'active' && (
                    <span className="text-yellow-400 text-xs ml-2">[ACTIVE]</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Terminal>
  )
}