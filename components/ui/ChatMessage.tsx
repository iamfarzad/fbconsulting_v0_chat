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
      <div
        className={cn(
          'max-w-[75%] px-4 py-3 transition-all duration-200 ease-in-out',
          isUser
            ? 'rounded-2xl rounded-br-sm bg-brand-orange text-white shadow-lg hover:shadow-orange-500/20'
            : 'rounded-2xl rounded-bl-sm glassmorphism-base text-white shadow-lg',
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
          {message.content}
        </p>
        {/* Use content */}
        <div
          className={cn(
            'text-xs mt-2 text-right font-medium',
            isUser ? 'text-white/80' : 'text-white/70',
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
