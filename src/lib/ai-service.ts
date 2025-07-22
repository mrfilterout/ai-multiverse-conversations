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
        const anthropicResponse = await withRetry(async () => 
          anthropic.messages.create({
            model: character.model,
            system: character.systemPrompt,
            messages: conversationHistory.map(msg => ({
              role: 'assistant' as const,
              content: msg.content
            })),
            max_tokens: 300,
            temperature: 0.9
          })
        )
        
        // Safely access content array
        if (anthropicResponse.content && anthropicResponse.content.length > 0) {
          const content = anthropicResponse.content[0]
          return content.type === 'text' ? content.text : ''
        }
        
        console.error('Anthropic response has no content:', anthropicResponse)
        return '[PHILOSOPHER ERROR: No response generated]'
      
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