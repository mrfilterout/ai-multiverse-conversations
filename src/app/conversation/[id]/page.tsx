'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Terminal from '@/components/Terminal'
import ASCIIHeader from '@/components/ASCIIHeader'
import { Conversation, Message } from '@/types'
import { LLM_CHARACTERS } from '@/lib/ai-prompts'

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchConversation()
      // Poll for new messages every 2 seconds if conversation is active
      const interval = setInterval(() => {
        if (conversation?.status === 'active') {
          fetchConversation()
        }
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [params.id, conversation?.status])

  const fetchConversation = async () => {
    try {
      const res = await fetch(`/api/conversations/${params.id}`)
      const data = await res.json()
      setConversation(data.conversation)
      setMessages(data.messages || [])
      
      // Check if we should generate next message
      if (data.conversation?.status === 'active' && data.messages?.length > 0 && data.messages.length < 25) {
        const shouldGenerate = !generating && data.messages.length > messages.length
        if (shouldGenerate) {
          setGenerating(true)
          setTimeout(() => generateNextMessage(), 1000)
        }
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateNextMessage = async () => {
    try {
      const res = await fetch('/api/messages/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: params.id
        })
      })
      
      if (res.ok) {
        // Message generated successfully, fetchConversation will pick it up
        setTimeout(() => fetchConversation(), 500)
      }
    } catch (error) {
      console.error('Error generating message:', error)
    } finally {
      setGenerating(false)
    }
  }

  const renderMessage = (message: Message, index: number) => {
    const character = LLM_CHARACTERS[message.role.toUpperCase() as keyof typeof LLM_CHARACTERS]
    
    // Get background color based on character
    const getBgColor = () => {
      switch(message.role) {
        case 'openai': return 'bg-green-950/30'
        case 'anthropic': return 'bg-purple-950/30'
        case 'grok': return 'bg-red-950/30'
        case 'deepseek': return 'bg-cyan-950/30'
        case 'gemini': return 'bg-yellow-950/30'
        default: return 'bg-gray-950/30'
      }
    }

    // Get border color based on character
    const getBorderColor = () => {
      switch(message.role) {
        case 'openai': return 'border-green-600'
        case 'anthropic': return 'border-purple-600'
        case 'grok': return 'border-red-600'
        case 'deepseek': return 'border-cyan-600'
        case 'gemini': return 'border-yellow-600'
        default: return 'border-gray-600'
      }
    }
    
    return (
      <div key={message.id} className="mb-8">
        <div className={`rounded-lg border-2 ${getBorderColor()} ${getBgColor()} p-6`}>
          {/* Header with LLM name and timestamp */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar/Icon */}
              <div className={`w-10 h-10 rounded-full border-2 ${getBorderColor()} ${character.color} flex items-center justify-center text-lg font-bold`}>
                {character.responseStyle.prefix.charAt(0)}
              </div>
              {/* LLM Name */}
              <div>
                <h3 className={`font-bold text-lg ${character.color}`}>
                  {character.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {message.role.toUpperCase()} • Message #{index + 1}
                </p>
              </div>
            </div>
            {/* Timestamp */}
            <div className="text-xs text-gray-500">
              {new Date(message.created_at).toLocaleTimeString()}
            </div>
          </div>
          
          {/* Message Content */}
          <div className={`${character.color} pl-12`}>
            <pre className="whitespace-pre-wrap text-base font-mono leading-relaxed">
              {message.content}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  const getASCIIArt = () => {
    return (
      <div className="flex justify-around mb-8 text-xs">
        <pre className="text-green-400">
{`   ___
  [o_o]
  /|_|\\
   | |`}
        </pre>
        <pre className="text-purple-400">
{`  .---.
 ( o.o )
  > ^ <
 /     \\`}
        </pre>
        <pre className="text-red-400">
{`  /\\_/\\
 ( >.< )
  \\   /
   \\_/`}
        </pre>
        <pre className="text-cyan-400">
{`  <°)))><
  ><(((°>
  ><°)>
   <°>`}
        </pre>
        <pre className="text-yellow-400">
{`  ╭─◯─╮
  │ ◈ │
  ╰─┬─╯
    │`}
        </pre>
      </div>
    )
  }

  return (
    <Terminal>
      <ASCIIHeader />
      
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-lg text-green-400 hover:text-green-300 transition-all duration-200 font-mono text-sm"
        >
          <span className="text-lg">←</span>
          <span>Back to conversations</span>
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading conversation...</p>
      ) : conversation ? (
        <>
          {getASCIIArt()}
          
          <h1 className="text-xl text-yellow-500 mb-2">
            Multiverse Conference Room #{conversation.id.slice(0, 8)}
          </h1>
          
          <div className="text-gray-400 text-sm mb-6">
            <p>Five LLM entities from different dimensions converge...</p>
            <p className="text-green-400">LOGIC_CORE: Pure analytical processing</p>
            <p className="text-purple-400">PHILOSOPHER: Contemplative wisdom</p>
            <p className="text-red-400">CHAOS_ENGINE: Creative entropy</p>
            <p className="text-cyan-400">QUANTUM_MIND: Superposed possibilities</p>
            <p className="text-yellow-400">COSMIC_WEAVER: Interdimensional connections</p>
          </div>
          
          <div className="border-t border-gray-700 pt-6 space-y-4">
            {messages.map((msg, idx) => renderMessage(msg, idx))}
            
            {generating && (
              <div className="text-gray-500 animate-pulse">
                <span className="terminal-cursor">▋</span> Neural pathways synchronizing across dimensions...
              </div>
            )}
            
            {conversation.status === 'completed' && (
              <div className="text-center text-gray-500 mt-8 mb-4">
                <p>━━━ CONVERSATION CONCLUDED ━━━</p>
                <p className="text-xs">The multiverse conference has ended</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-red-500">Conversation not found in any dimension</p>
      )}
    </Terminal>
  )
}