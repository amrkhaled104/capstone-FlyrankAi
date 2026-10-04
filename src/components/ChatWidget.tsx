"use client";

import { useChat } from "@ai-sdk/react";
import React, { memo, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface ChatWidgetProps {
  /**
   * Whether the chat modal should be open initially.
   * Useful for testing or deep-linking directly into chat.
   * @default false
   */
  defaultOpen?: boolean;
}

export const SUGGESTED_PROMPTS = [
  "Water is leaking under my kitchen sink",
  "Circuit breaker trips when running the microwave",
  "AC is blowing warm air instead of cooling",
  "Water heater is making a rumbling noise",
];

const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Detects whether a string contains Arabic characters for bidirectional text rendering.
 */
export const isArabic = (text: string): boolean => ARABIC_REGEX.test(text);

interface ChatMessageItemProps {
  message: {
    id: string;
    role: string;
    content: string;
  };
}

/**
 * Memoized message item to prevent re-rendering previously streamed messages
 * during high-frequency token chunks.
 */
const ChatMessageItem = memo(function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const rtl = isArabic(message.content);

  return (
    <div
      className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
      dir={rtl ? "rtl" : "ltr"}
    >
      {!isUser && (
        <div
          className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-lg bg-blue-600 text-[10px] font-bold text-white shadow-sm dark:bg-blue-500"
          aria-hidden="true"
        >
          AI
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white shadow-sm rounded-tr-sm text-left rtl:text-right"
            : "border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 rounded-tl-sm text-left rtl:text-right"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="space-y-1.5 text-xs sm:text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-1 mb-1 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1 mb-0.5 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-1 mb-0.5 first:mt-0">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-0.5 my-1 ps-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-0.5 my-1 ps-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {children}
                  </strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 rtl:border-r-2 rtl:border-l-0 border-blue-500 pl-2 rtl:pr-2 rtl:pl-0 italic text-zinc-600 dark:text-zinc-400 my-1">
                    {children}
                  </blockquote>
                ),
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match && !String(children).includes("\n");
                  return isInline ? (
                    <code
                      className="rounded bg-zinc-200/80 px-1 py-0.5 font-mono text-[11px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <pre
                      dir="ltr"
                      className="overflow-x-auto rounded-lg bg-zinc-900 p-2 text-zinc-100 my-1.5 text-[11px] font-mono dark:bg-black/60 text-left"
                    >
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-1.5">
                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-[11px]">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-2 py-1 text-left rtl:text-right font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/60">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-2 py-1 border-t border-zinc-200 dark:border-zinc-800">
                    {children}
                  </td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
});

export default function ChatWidget({ defaultOpen = false }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "/api/chat",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message when messages change or while streaming
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Close widget on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handlePromptSelect = (prompt: string) => {
    const syntheticEvent = {
      target: { value: prompt },
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(syntheticEvent);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Action Button (Chat Bubble) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="chat-widget-dialog"
        aria-label={isOpen ? "Close AI Advisor chat" : "Open AI Service Advisor chat"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/30 transition-all duration-200 hover:scale-105 hover:bg-blue-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-blue-500 dark:shadow-blue-500/25 dark:hover:bg-blue-600 dark:focus-visible:ring-offset-zinc-950"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h.01" />
              <path d="M12 10h.01" />
              <path d="M16 10h.01" />
            </svg>
            {/* Live Status Indicator Pill */}
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" />
            </span>
          </>
        )}
      </button>

      {/* Floating Chat Modal / Popup Window */}
      {isOpen && (
        <div
          id="chat-widget-dialog"
          role="dialog"
          aria-modal="false"
          aria-label="AI Service Advisor"
          className="fixed bottom-20 right-5 z-50 flex h-[500px] w-[calc(100vw-2.5rem)] max-h-[calc(100vh-6.5rem)] sm:w-96 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-950"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm dark:bg-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M12 2a8 8 0 0 0-8 8c0 3.3 2 6 5 7.4V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.6c3-1.4 5-4.1 5-7.4a8 8 0 0 0-8-8z" />
                  <path d="M10 9a2 2 0 0 1 4 0" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                  AI Service Advisor
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Online • Troubleshooting Guide
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Message History Container */}
          <div
            role="log"
            aria-live="polite"
            aria-label="Chat message history"
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center px-2 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  How can we help with your home today?
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-[260px]">
                  Describe any leak, electrical issue, or heating/cooling problem.
                </p>

                {/* Suggested Starter Chips */}
                <div className="mt-4 flex flex-col gap-1.5 w-full">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handlePromptSelect(prompt)}
                      className="w-full text-left rtl:text-right rounded-lg border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs text-zinc-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <ChatMessageItem key={m.id} message={m} />
              ))
            )}

            {/* Streaming/Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-bold text-white shadow-sm dark:bg-blue-500"
                  aria-hidden="true"
                >
                  AI
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-zinc-200 bg-zinc-50 px-3.5 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s] dark:bg-blue-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s] dark:bg-blue-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce dark:bg-blue-400" />
                  <span className="sr-only">AI is generating response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-zinc-200 p-3 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2"
              aria-label="Send message to AI Advisor"
            >
              <label htmlFor="chat-user-input" className="sr-only">
                Describe your home issue
              </label>
              <input
                id="chat-user-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your issue (e.g. leaky sink)..."
                disabled={isLoading}
                aria-disabled={isLoading}
                dir={isArabic(input) ? "rtl" : "ltr"}
                className="flex-1 h-9 rounded-xl border border-zinc-300 bg-zinc-50 px-3 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:bg-zinc-950 rtl:text-right"
              />

              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Stop generating response"
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <rect width="12" height="12" x="6" y="6" rx="2" />
                  </svg>
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
