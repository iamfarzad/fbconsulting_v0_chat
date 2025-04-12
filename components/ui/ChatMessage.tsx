'use client';

import { cn } from '@/lib/utils';

// Define message structure - use role/content for potential Vercel AI SDK compatibility
export interface Message {
  id: string;
  role: 'user' | 'assistant'; // Changed sender to role
  content: string; // Changed text to content
  timestamp: Date;
  // Add other potential fields like display, tool_calls etc. later if needed
}

// Component to render a single message bubble matching Image 3
export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'; // Use role

  return (
    // Original flex wrapper (no items-center or gap)
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      {/* Removed assistant avatar div */}
      <div
        className={cn(
          'max-w-[75%] rounded-lg px-4 py-2.5', // Adjusted padding slightly
          // Removed shadow-sm
          isUser
            ? 'bg-brand-orange text-white rounded-br-none' // Use theme brand color
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50 rounded-bl-none', // Assistant style from Image 3
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>{' '}
        {/* Use content */}
        <div
          className={cn(
            'text-xs mt-1.5 text-right',
            isUser ? 'text-white/70' : 'text-gray-400 dark:text-gray-500',
          )}
        >
          {new Intl.DateTimeFormat('en-US', {
            hour: 'numeric', // Use numeric for potentially cleaner look like image
            minute: '2-digit',
            hour12: true, // Explicitly set 12-hour format like image
          }).format(new Date(message.timestamp))}
        </div>
      </div>
      {/* Removed user avatar div */}
    </div>
  );
}
