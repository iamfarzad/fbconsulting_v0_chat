'use client';

import type { Message } from 'ai';
import { IconOpenAI, IconUser } from './icons';
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  message: Message;
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isAI = message.role === 'assistant';

  return (
    <div
      className={cn(
        'group relative flex items-start gap-4 px-4',
        'hover:bg-accent/5',
        className,
      )}
    >
      <div
        className={cn(
          'mt-1 flex size-8 shrink-0 select-none items-center justify-center',
          'rounded-md border bg-background/80 backdrop-blur-md',
          isAI ? 'border-brand-orange/50' : 'border-border/50',
        )}
      >
        {isAI ? (
          <IconOpenAI className="size-5 text-brand-orange" />
        ) : (
          <IconUser className="size-5" />
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
          <div
            className={cn(
              'rounded-lg p-4',
              'bg-background/80 backdrop-blur-md',
              'border shadow-sm',
              isAI ? 'border-brand-orange/20' : 'border-border/50',
            )}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
}
