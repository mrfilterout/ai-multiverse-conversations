// This file will be used for Vercel Cron Jobs
// Configure in vercel.json

export async function startNewConversation() {
  try {
    // Use the actual deployment URL, not VERCEL_URL which might be incorrect
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://www.echochain.tech'
      : 'http://localhost:3000'
    
    console.log('Creating conversation at:', `${baseUrl}/api/conversations/create`)
    
    const response = await fetch(`${baseUrl}/api/conversations/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Create conversation response:', errorData)
      throw new Error(`Failed to create conversation: ${errorData.details || errorData.error}`)
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
  // Each LLM speaks 3 times, so 15 messages total (3 rounds * 5 LLMs)
  if (messageCount >= 15) {
    console.log('Conversation completed:', conversationId)
    // Update conversation status to completed
    await updateConversationStatus(conversationId, 'completed')
    return
  }
  
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.echochain.tech'
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
    // Increased delay to avoid rate limits
    const delay = 10000 + Math.random() * 10000 // 10-20 seconds
    setTimeout(() => {
      generateConversationMessages(conversationId, messageCount + 1)
    }, delay)
    
  } catch (error) {
    console.error('Error generating message:', error)
  }
}

async function updateConversationStatus(conversationId: string, status: 'active' | 'completed') {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.echochain.tech'
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