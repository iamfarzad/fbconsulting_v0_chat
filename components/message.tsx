'use client';

import { Message } from 'ai';
import { cn } from '@/lib/utils';
import { Markdown } from '@/components/markdown';

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'group relative mb-4 flex items-start md:gap-6',
        message.role === 'user' ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'flex-1 space-y-2 overflow-hidden px-1',
          message.role === 'user' ? 'text-right' : 'text-left',
        )}
      >
        <div
          className={cn(
            'inline-block max-w-[85%] rounded-lg px-4 py-2.5 text-sm',
            message.role === 'user'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-900',
          )}
        >
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  );
}
