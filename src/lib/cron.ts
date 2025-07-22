// This file will be used for Vercel Cron Jobs
// Configure in vercel.json

export async function startNewConversation() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/conversations/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to create conversation')
    }
    
    const data = await response.json()
    console.log('New conversation started:', data.conversation.id)
    
    // Start generating messages
    if (data.conversation && data.conversation.id) {
      // Small delay before starting the conversation chain
      setTimeout(() => {
        generateConversationMessages(data.conversation.id, 0)
      }, 2000)
    }
    
    return data
  } catch (error) {
    console.error('Error starting new conversation:', error)
    throw error
  }
}

async function generateConversationMessages(conversationId: string, messageCount: number) {
  // Each LLM speaks 5 times, so 25 messages total (5 rounds * 5 LLMs)
  if (messageCount >= 25) {
    console.log('Conversation completed:', conversationId)
    // Update conversation status to completed
    await updateConversationStatus(conversationId, 'completed')
    return
  }
  
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  
  try {
    const response = await fetch(`${baseUrl}/api/messages/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to generate message')
    }
    
    const data = await response.json()
    
    // Wait before generating next message (varied timing for natural feel)
    const delay = 3000 + Math.random() * 4000 // 3-7 seconds
    setTimeout(() => {
      generateConversationMessages(conversationId, messageCount + 1)
    }, delay)
    
  } catch (error) {
    console.error('Error generating message:', error)
  }
}

async function updateConversationStatus(conversationId: string, status: 'active' | 'completed') {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
    
  try {
    const response = await fetch(`${baseUrl}/api/conversations/${conversationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    })
    
    if (!response.ok) {
      throw new Error('Failed to update conversation status')
    }
  } catch (error) {
    console.error('Error updating conversation status:', error)
  }
}