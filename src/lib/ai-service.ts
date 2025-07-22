import { openai, anthropic, xai, deepseek, gemini } from './ai-clients'
import { LLM_CHARACTERS } from './ai-prompts'
import { AIProvider } from '@/types'

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
        const anthropicResponse = await anthropic.messages.create({
          model: character.model,
          system: character.systemPrompt,
          messages: conversationHistory.map(msg => ({
            role: 'assistant' as const,
            content: msg.content
          })),
          max_tokens: 500,
          temperature: 0.9
        })
        return anthropicResponse.content[0].type === 'text' 
          ? anthropicResponse.content[0].text 
          : ''
      
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