'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAtBottom } from '@/lib/hooks/use-at-bottom';
import { Button } from '@/components/ui/button';
import { IconArrowDown } from '@/components/icons';
import { ChatMessage as Message } from '@/components/message';
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor';
import { cn } from '@/lib/utils';

export interface ChatProps {
  messages: any[];
  isLoading?: boolean;
  append: (message: any) => void;
  reload: () => void;
  stop: () => void;
  input: string;
  setInput: (value: string) => void;
  renderVoiceButton?: () => React.ReactNode;
  className?: string;
}

export function ChatInterface({
  messages,
  isLoading,
  append,
  reload,
  stop,
  input,
  setInput,
  renderVoiceButton,
  className,
}: ChatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();
  const isAtBottom = useAtBottom();

  useEffect(() => {
    if (isAtBottom && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isAtBottom]);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Messages Container */}
      <div
        ref={containerRef}
        className={cn(
          'relative min-h-[300px] max-h-[600px] overflow-y-auto rounded-xl',
          'scroll-smooth ai-custom-scrollbar',
          'bg-background/50 backdrop-blur-sm border shadow-sm',
          'transition-all duration-300 ease-in-out',
        )}
      >
        {messages.length > 0 ? (
          <>
            <div className="flex flex-col gap-4 p-4">
              {messages.map((message: any) => (
                <Message key={message.id} message={message} />
              ))}
            </div>
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-8">
            <p className="text-sm text-muted-foreground">
              Start a conversation...
            </p>
          </div>
        )}

        {/* Scroll to bottom button */}
        {!isAtBottom && messages.length > 0 && (
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute right-4 bottom-4 size-8 rounded-full',
              'bg-background/50 backdrop-blur-sm',
              'opacity-90 hover:opacity-100 transition-opacity',
              'border border-white/10 shadow-lg',
            )}
            onClick={() => {
              containerRef.current?.scrollTo({
                top: containerRef.current?.scrollHeight,
                behavior: 'smooth',
              });
            }}
          >
            <IconArrowDown />
            <span className="sr-only">Scroll to bottom</span>
          </Button>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (input.trim()) {
            append({
              role: 'user',
              content: input,
            });
            setInput('');
          }
        }}
        className="relative flex items-center gap-2"
      >
        <div
          className={cn(
            'flex-1 overflow-hidden rounded-xl',
            'glassmorphism-base shadow-sm',
            'transition duration-200 ease-in-out',
            'focus-within:ring-2 focus-within:ring-brand-orange/20',
            'border border-white/10',
          )}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            rows={1}
            className={cn(
              'min-h-[48px] w-full resize-none bg-transparent px-4 py-[14px]',
              'text-base placeholder:text-muted-foreground',
              'focus:outline-none disabled:opacity-50',
              'max-h-[400px] overflow-y-hidden',
            )}
            onInput={(e) => {
              const target = e.currentTarget;
              if (target) {
                target.style.height = 'auto';
                target.style.height = `${Math.min(target?.scrollHeight ?? 0, 400)}px`;
              }
            }}
          />
        </div>

        {/* Voice Button */}
        {renderVoiceButton && (
          <div className="shrink-0">{renderVoiceButton()}</div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          size="icon"
          className={cn(
            'size-12 rounded-xl bg-brand-orange text-white',
            'shadow-lg shadow-brand-orange/20',
            'hover:bg-brand-orange/90 hover:shadow-brand-orange/30',
            'transition-all duration-200 ease-in-out',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'border border-white/10',
            'backdrop-blur-sm',
          )}
          disabled={!input.trim() || isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
