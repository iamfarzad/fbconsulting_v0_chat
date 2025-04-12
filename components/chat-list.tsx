'use client';

import type { Message as SDKMessage } from 'ai'; // Make this type-only import
import { ChatMessage } from '@/components/ui/ChatMessage'; // Import the UI version
import type { Message } from '@/components/ui/ChatMessage'; // Import the type definition from UI version
import { cn } from '@/lib/utils'; // Import cn for conditional classes

export interface ChatListProps {
  messages: SDKMessage[]; // Use SDKMessage type
}

export function ChatList({ messages }: ChatListProps) {
  if (!messages.length) {
    // Optionally return a placeholder or empty fragment
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Start the conversation...
        </p>
      </div>
    );
  }

  return (
    // Use similar structure and styling as ChatMessageList for consistency
    <div className={cn('space-y-4', 'ai-custom-scrollbar')}>
      {messages.map((msg: SDKMessage) => (
        <ChatMessage
          key={msg.id} // Use message ID as key
          message={
            {
              ...msg,
              timestamp: msg.createdAt || new Date(), // Pass timestamp
            } as Message // Cast to the expected Message type
          }
        />
      ))}
    </div>
  );
}
