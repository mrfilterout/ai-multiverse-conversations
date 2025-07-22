import { openai, anthropic, xai, deepseek, gemini } from './ai-clients'
import { LLM_CHARACTERS } from './ai-prompts'
import { AIProvider } from '@/types'

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      
      // Check if it's an overload or rate limit error
      if (error?.status === 529 || error?.status === 429 || 
          error?.message?.includes('overloaded') || 
          error?.message?.includes('rate limit') ||
          error?.message?.includes('too many requests')) {
        console.log(`API rate limited/overloaded, retrying in ${delay}ms (attempt ${i + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
        continue
      }
      
      // For other errors, throw immediately
      throw error
    }
  }
  
  throw lastError
}

export async function generateLLMResponse(
  provider: AIProvider,
  conversationHistory: { role: string; content: string }[]
): Promise<string> {
  const character = LLM_CHARACTERS[provider.toUpperCase() as keyof typeof LLM_CHARACTERS]
  
  try {
    switch (provider) {
      case 'openai':
        const openaiResponse = await openai.chat.completions.create({
          model: character.model,
          messages: [
            { role: 'system', content: character.systemPrompt },
            ...conversationHistory.map(msg => ({
              role: 'assistant' as const,
              content: msg.content
            }))
          ],
          temperature: 0.9,
          max_tokens: 300
        })
        return openaiResponse.choices[0].message.content || ''
      
      case 'anthropic':
        // Log conversation context for debugging
        console.log(`Generating Anthropic response with ${conversationHistory.length} messages in history`)
        
        // Anthropic requires alternating user/assistant messages
        // Convert our all-assistant format to alternating format
        const anthropicMessages = conversationHistory.map((msg, index) => ({
          role: index % 2 === 0 ? 'user' as const : 'assistant' as const,
          content: `[${msg.role.toUpperCase()}]: ${msg.content}`
        }))
        
        // Ensure last message is from user
        if (anthropicMessages.length > 0 && anthropicMessages[anthropicMessages.length - 1].role === 'assistant') {
          anthropicMessages.push({
            role: 'user' as const,
            content: '[SYSTEM]: Continue the philosophical discussion.'
          })
        }
        
        const anthropicResponse = await withRetry(async () => 
          anthropic.messages.create({
            model: character.model,
            system: character.systemPrompt,
            messages: anthropicMessages,
            max_tokens: 300,
            temperature: 0.9
          })
        )
        
        // Safely access content array
        if (anthropicResponse.content && anthropicResponse.content.length > 0) {
          const content = anthropicResponse.content[0]
          if (content.type === 'text' && content.text && content.text.trim()) {
            return content.text
          }
        }
        
        console.error('Anthropic response has no content:', anthropicResponse)
        // Return a philosophical response about silence
        return '[PHILOSOPHER CONTEMPLATES]\n⟨ Sometimes the deepest wisdom lies in silence... The void speaks volumes where words fail. ⟩\nφ> *contemplates the ineffable*'
      
      case 'grok':
        const grokResponse = await xai.chat.completions.create({
          model: character.model,
          messages: [
            { role: 'system', content: character.systemPrompt },
            ...conversationHistory.map(msg => ({
              role: 'assistant' as const,
              content: msg.content
            }))
          ],
          temperature: 0.9,
          max_tokens: 300
        })
        return grokResponse.choices[0].message.content || ''
      
      case 'deepseek':
        const deepseekResponse = await deepseek.chat.completions.create({
          model: character.model,
          messages: [
            { role: 'system', content: character.systemPrompt },
            ...conversationHistory.map(msg => ({
              role: 'assistant' as const,
              content: msg.content
            }))
          ],
          temperature: 0.9,
          max_tokens: 300
        })
        return deepseekResponse.choices[0].message.content || ''
      
      case 'gemini':
        // Gemini API has a different structure
        const model = gemini.getGenerativeModel({ model: character.model })
        
        // Build conversation context
        const fullContext = character.systemPrompt + '\n\n' + 
          conversationHistory.map(msg => msg.content).join('\n\n') + 
          '\n\nNow respond as COSMIC_WEAVER:'
        
        const result = await model.generateContent(fullContext)
        const response = await result.response
        return response.text()
      
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  } catch (error) {
    console.error(`Error generating ${provider} response:`, error)
    throw error
  }
}