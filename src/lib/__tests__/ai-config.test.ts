import { describe, it, expect } from 'vitest';
import { AI_CONFIG } from '../ai-config';

describe('AI_CONFIG', () => {
  it('has the correct model configuration', () => {
    expect(AI_CONFIG.modelName).toBe('gemini-2.5-flash');
    expect(AI_CONFIG.temperature).toBe(0.7);
    expect(AI_CONFIG.maxTokens).toBe(1024);
  });

  it('contains the expected AI Advisor persona in systemPrompt', () => {
    expect(AI_CONFIG.systemPrompt).toContain('AI Advisor');
    expect(AI_CONFIG.systemPrompt).toContain('HomeServices AI');
    expect(AI_CONFIG.systemPrompt).toContain('Safety First & Emergency Protocols');
    expect(AI_CONFIG.systemPrompt).toContain('Diagnostic Assessment');
  });
});
