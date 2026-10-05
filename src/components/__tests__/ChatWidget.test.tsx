import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import ChatWidget, { isArabic } from '../ChatWidget';

const mockHandleInputChange = vi.fn();
const mockHandleSubmit = vi.fn((e) => e?.preventDefault?.());
const mockStop = vi.fn();

let mockMessages: Array<{ id: string; role: 'user' | 'assistant'; content: string }> = [];
let mockInput = '';
let mockIsLoading = false;

vi.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: mockMessages,
    input: mockInput,
    handleInputChange: mockHandleInputChange,
    handleSubmit: mockHandleSubmit,
    isLoading: mockIsLoading,
    stop: mockStop,
  }),
}));

describe('ChatWidget Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMessages = [];
    mockInput = '';
    mockIsLoading = false;

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders floating bubble button closed by default and does not show dialog', () => {
    render(<ChatWidget />);

    const bubbleBtn = screen.getByRole('button', { name: /open ai service advisor chat/i });
    expect(bubbleBtn).toBeInTheDocument();
    expect(bubbleBtn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens chat dialog when clicking floating bubble button', () => {
    render(<ChatWidget />);

    const bubbleBtn = screen.getByRole('button', { name: /open ai service advisor chat/i });
    fireEvent.click(bubbleBtn);

    const dialog = screen.getByRole('dialog', { name: /ai service advisor/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('AI Service Advisor')).toBeInTheDocument();
    expect(screen.getByText('Online • Troubleshooting Guide')).toBeInTheDocument();
    expect(bubbleBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes chat dialog when clicking header close button', () => {
    render(<ChatWidget defaultOpen={true} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close chat/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes chat dialog when pressing Escape key', () => {
    render(<ChatWidget defaultOpen={true} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders starter suggestions in empty state and populates input on click', () => {
    render(<ChatWidget defaultOpen={true} />);

    const suggestionBtn = screen.getByRole('button', {
      name: /water is leaking under my kitchen sink/i,
    });
    expect(suggestionBtn).toBeInTheDocument();

    fireEvent.click(suggestionBtn);
    expect(mockHandleInputChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: { value: 'Water is leaking under my kitchen sink' },
      })
    );
  });

  it('renders message history for user and assistant messages', () => {
    mockMessages = [
      { id: '1', role: 'user', content: 'No hot water in bathroom' },
      { id: '2', role: 'assistant', content: 'Check if the pilot light is on or breaker is tripped.' },
    ];

    render(<ChatWidget defaultOpen={true} />);

    expect(screen.getByText('No hot water in bathroom')).toBeInTheDocument();
    expect(
      screen.getByText('Check if the pilot light is on or breaker is tripped.')
    ).toBeInTheDocument();
  });

  it('renders markdown elements (headings, bold, lists, code) properly without raw syntax', () => {
    mockMessages = [
      {
        id: '1',
        role: 'assistant',
        content:
          '### Electrical Triage\n\n**Urgent Warning:** Turn off power.\n\n- Step 1: Locate panel\n- Step 2: Switch off breaker\n\n`code block`',
      },
    ];

    render(<ChatWidget defaultOpen={true} />);

    // Verify heading rendered as an HTML heading element, not raw ###
    const heading = screen.getByRole('heading', { level: 3, name: /electrical triage/i });
    expect(heading).toBeInTheDocument();

    // Verify bold formatting
    expect(screen.getByText('Urgent Warning:')).toBeInTheDocument();
    expect(screen.getByText('Urgent Warning:').tagName).toBe('STRONG');

    // Verify list items
    expect(screen.getByText(/step 1: locate panel/i)).toBeInTheDocument();
    expect(screen.getByText(/step 2: switch off breaker/i)).toBeInTheDocument();

    // Raw markdown tokens like ### or ** should NOT appear in text
    expect(screen.queryByText(/###/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\*\*/)).not.toBeInTheDocument();
  });

  it('detects Arabic text and applies dir="rtl" layout to messages and inputs', () => {
    mockMessages = [
      {
        id: 'ar-1',
        role: 'assistant',
        content: 'يجب فصل التيار الكهربائي فوراً لسلامتك والتأكد من عدم وجود أسلاك مكشوفة.',
      },
    ];
    mockInput = 'عندي تسريب مياه تحت حوض المطبخ';

    render(<ChatWidget defaultOpen={true} />);

    // Verify helper function
    expect(isArabic('مرحبا')).toBe(true);
    expect(isArabic('Hello world')).toBe(false);

    // Verify message container applies dir="rtl"
    const arabicText = screen.getByText(/يجب فصل التيار الكهربائي فوراً/);
    const messageRow = arabicText.closest('[dir="rtl"]');
    expect(messageRow).not.toBeNull();
    expect(messageRow).toHaveAttribute('dir', 'rtl');

    // Verify input element applies dir="rtl"
    const input = screen.getByLabelText(/describe your home issue/i);
    expect(input).toHaveAttribute('dir', 'rtl');
  });

  it('submits user input correctly', () => {
    mockInput = 'Breaker trips repeatedly';
    render(<ChatWidget defaultOpen={true} />);

    const input = screen.getByLabelText(/describe your home issue/i);
    expect(input).toHaveValue('Breaker trips repeatedly');

    const submitBtn = screen.getByRole('button', { name: /send message/i });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('displays stop button during streaming and invokes stop on click', () => {
    mockIsLoading = true;
    mockInput = 'Checking...';
    render(<ChatWidget defaultOpen={true} />);

    const stopBtn = screen.getByRole('button', { name: /stop generating response/i });
    expect(stopBtn).toBeInTheDocument();

    fireEvent.click(stopBtn);
    expect(mockStop).toHaveBeenCalled();
  });

  it('anchors to bottom during streaming and message updates', async () => {
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    const { rerender } = render(<ChatWidget defaultOpen={true} />);

    mockMessages = [
      { id: '1', role: 'user', content: 'Testing auto-scroll' },
      { id: '2', role: 'assistant', content: 'Streaming chunk 1' },
    ];
    mockIsLoading = true;

    rerender(<ChatWidget defaultOpen={true} />);

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });
});
