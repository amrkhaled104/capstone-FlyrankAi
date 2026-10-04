import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { AI_CONFIG } from '@/lib/ai-config';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google(AI_CONFIG.modelName),
      system: AI_CONFIG.systemPrompt,
      messages,
      temperature: AI_CONFIG.temperature,
      maxTokens: AI_CONFIG.maxTokens,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat API route:', error);
    return Response.json(
      { error: 'Failed to process chat stream request.' },
      { status: 500 }
    );
  }
}
