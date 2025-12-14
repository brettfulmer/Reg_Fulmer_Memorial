// OpenAI Integration for Memorial Site AI Features
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface ModerationResult {
  flagged: boolean
  categories: {
    harassment: boolean
    hate: boolean
    self_harm: boolean
    sexual: boolean
    violence: boolean
  }
  sentiment: 'positive' | 'neutral' | 'negative'
  suggestedApproval: boolean
}

/**
 * Moderate user-submitted memory content using OpenAI
 */
export async function moderateMemory(
  message: string,
  name: string
): Promise<ModerationResult> {
  try {
    // Use OpenAI moderation API
    const moderation = await openai.moderations.create({
      input: message,
    })

    const result = moderation.results[0]

    // Analyze sentiment using GPT
    const sentimentResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are analyzing messages posted on a memorial website. Determine if the sentiment is positive, neutral, or negative. Respond with only one word: positive, neutral, or negative.',
        },
        {
          role: 'user',
          content: `Message from ${name}: "${message}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 10,
    })

    const sentiment = (sentimentResponse.choices[0].message.content
      ?.toLowerCase()
      .trim() || 'neutral') as 'positive' | 'neutral' | 'negative'

    return {
      flagged: result.flagged,
      categories: {
        harassment: result.categories.harassment,
        hate: result.categories.hate,
        self_harm: result.categories['self-harm'],
        sexual: result.categories.sexual,
        violence: result.categories.violence,
      },
      sentiment,
      suggestedApproval: !result.flagged && sentiment !== 'negative',
    }
  } catch (error) {
    // Fail safe - require manual approval on error
    return {
      flagged: false,
      categories: {
        harassment: false,
        hate: false,
        self_harm: false,
        sexual: false,
        violence: false,
      },
      sentiment: 'neutral',
      suggestedApproval: false,
    }
  }
}

export interface TributeSummary {
  summary: string
  keyThemes: string[]
  emotionalTone: string
}

/**
 * Generate AI summary of all memories for family
 */
export async function generateTributeSummary(
  memories: Array<{ name: string; message: string }>,
  deceasedName: string
): Promise<TributeSummary> {
  if (memories.length === 0) {
    return {
      summary: 'No memories have been shared yet.',
      keyThemes: [],
      emotionalTone: 'neutral',
    }
  }

  try {
    const memoriesText = memories
      .map((m, i) => `${i + 1}. From ${m.name}: "${m.message}"`)
      .join('\n\n')

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a compassionate writer creating a summary of tribute messages for a memorial service for ${deceasedName}. 
          
Your task:
1. Write a 2-3 paragraph heartfelt summary that captures the essence of what people are sharing
2. Identify 3-5 key themes that emerge from the messages
3. Describe the overall emotional tone

Be respectful, warm, and honor the memory of the deceased. Focus on what made them special.

Respond in JSON format:
{
  "summary": "The summary text...",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "emotionalTone": "description of the tone"
}`,
        },
        {
          role: 'user',
          content: `Here are the tribute messages:\n\n${memoriesText}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(
      response.choices[0].message.content || '{}'
    ) as TributeSummary

    return result
  } catch (error) {
    return {
      summary: 'Unable to generate summary at this time.',
      keyThemes: [],
      emotionalTone: 'Unable to analyze',
    }
  }
}

export interface EulogyDraft {
  opening: string
  mainBody: string
  closing: string
  fullText: string
  tips: string[]
}

/**
 * Generate AI-assisted eulogy draft
 */
export async function generateEulogyDraft(
  deceasedName: string,
  bio: string,
  memories: Array<{ name: string; message: string }>,
  personalNotes?: string
): Promise<EulogyDraft> {
  try {
    const memoriesContext = memories
      .slice(0, 20) // Use top 20 memories
      .map((m) => `- ${m.name} shared: "${m.message}"`)
      .join('\n')

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a skilled eulogy writer helping someone create a heartfelt tribute. 
          
Create a 3-5 minute eulogy (approximately 400-600 words) that:
- Opens with a warm, personal introduction
- Weaves together the biographical information and shared memories
- Highlights what made ${deceasedName} special
- Includes specific anecdotes and details from the memories
- Closes with a meaningful reflection
- Uses a warm, conversational tone
- Is respectful and genuine

Also provide 3-5 tips for delivering the eulogy.

Respond in JSON format:
{
  "opening": "The opening paragraph...",
  "mainBody": "The main body paragraphs...",
  "closing": "The closing paragraph...",
  "fullText": "The complete eulogy...",
  "tips": ["tip1", "tip2", "tip3"]
}`,
        },
        {
          role: 'user',
          content: `Help me write a eulogy for ${deceasedName}.

Bio: ${bio}

Memories shared by friends and family:
${memoriesContext}

${personalNotes ? `Additional notes: ${personalNotes}` : ''}`,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(
      response.choices[0].message.content || '{}'
    ) as EulogyDraft

    return result
  } catch (error) {
    return {
      opening: '',
      mainBody: '',
      closing: '',
      fullText: 'Unable to generate eulogy at this time.',
      tips: [],
    }
  }
}

export interface ChatbotResponse {
  answer: string
  suggestedFollowUps: string[]
}

/**
 * AI Chatbot for answering service FAQ
 */
export async function answerServiceQuestion(
  question: string,
  serviceContext: {
    deceasedName: string
    serviceDate: string
    venue: string
    address: string
    livestreamEnabled: boolean
    travelTips: string[]
  }
): Promise<ChatbotResponse> {
  try {
    const context = `
Memorial Service Information:
- In memory of: ${serviceContext.deceasedName}
- Date: ${serviceContext.serviceDate}
- Venue: ${serviceContext.venue}
- Address: ${serviceContext.address}
- Livestream: ${serviceContext.livestreamEnabled ? 'Yes, available online' : 'No livestream'}
- Travel tips available: ${serviceContext.travelTips.slice(0, 5).join('; ')}
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant for a memorial service website. Answer questions warmly and clearly.
          
Provide:
1. A direct, helpful answer
2. 2-3 suggested follow-up questions the user might have

Keep answers concise but complete. Be compassionate and respectful.

Respond in JSON format:
{
  "answer": "Your answer here...",
  "suggestedFollowUps": ["question1?", "question2?", "question3?"]
}`,
        },
        {
          role: 'user',
          content: `${context}\n\nUser question: ${question}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(
      response.choices[0].message.content || '{}'
    ) as ChatbotResponse

    return result
  } catch (error) {
    return {
      answer:
        "I'm sorry, I'm having trouble answering that right now. Please check the service details section or contact the family directly.",
      suggestedFollowUps: [],
    }
  }
}

/**
 * Enhance and describe photos using GPT-4 Vision
 */
export async function describeMemoryPhoto(
  imageUrl: string
): Promise<string | null> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Describe this photo shared in memory of someone. Write a brief, warm 1-2 sentence description focusing on the moment captured. Be respectful and genuine.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    })

    return response.choices[0].message.content
  } catch (error) {
    return null
  }
}
