import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, runtime } from '../route';
import { AI_CONFIG } from '@/lib/ai-config';

const mockToDataStreamResponse = vi.fn().mockReturnValue(new Response('stream-data'));
const mockStreamText = vi.fn().mockReturnValue({
  toDataStreamResponse: mockToDataStreamResponse,
});

vi.mock('ai', () => ({
  streamText: (args: unknown) => mockStreamText(args),
}));

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn((model: string) => `google-model-${model}`),
}));

describe('Chat API Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports edge runtime', () => {
    expect(runtime).toBe('edge');
  });

  it('extracts messages and calls streamText with AI_CONFIG parameters', async () => {
    const messages = [{ role: 'user', content: 'My sink is leaking water' }];
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    const response = await POST(req);

    expect(mockStreamText).toHaveBeenCalledWith({
      model: `google-model-${AI_CONFIG.modelName}`,
      system: AI_CONFIG.systemPrompt,
      messages,
      temperature: AI_CONFIG.temperature,
      maxTokens: AI_CONFIG.maxTokens,
    });

    expect(mockToDataStreamResponse).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it('returns a 500 JSON response on error', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: 'invalid-json',
    });

    const response = await POST(req);
    expect(response.status).toBe(500);

    const json = await response.json();
    expect(json).toEqual({
      error: 'Failed to process chat stream request.',
    });
  });
});
