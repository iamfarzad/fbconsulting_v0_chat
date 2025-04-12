'use client';

import { useRef, useEffect } from 'react'; // Removed useState, useIsMobile
import { useSharedChat } from '@/lib/context/chat-context'; // Import shared context hook
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import { ChatMessage } from './ChatMessage'; // Import component value
import type { Message } from './ChatMessage'; // Import type only
import type { Message as SDKMessage } from '@ai-sdk/react'; // Import SDK Message type for casting

// Remove empty interface
// interface ChatMessageListProps {}

export function ChatMessageList() {
  // Remove empty props destructuring
  // Removed isMobile hook call
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Get messages and loading state from the shared context
  const { messages, isLoading } = useSharedChat();

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto p-4 md:p-6 space-y-4',
        'ai-custom-scrollbar', // Apply custom scrollbar style from globals.css
      )}
    >
      {messages.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
          <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">Start the conversation</p>
          {/* Remove prompt button reference for now */}
          {/* <p className="text-sm">Ask anything or use the suggestions below.</p> */}
        </div>
      ) : (
        // Map over messages and adapt to ChatMessage's expected props
        messages.map((msg: SDKMessage) => (
          <ChatMessage
            key={msg.id}
            message={
              {
                ...msg,
                timestamp: msg.createdAt || new Date(), // Use createdAt or fallback
              } as Message // Cast to the expected Message type
            }
          />
        ))
      )}

      {/* Typing Indicator - Use isLoading from shared context */}
      {isLoading &&
        messages[messages.length - 1]?.role === 'user' && ( // Show only if last message was user
          <ChatMessage
            message={{
              id: 'loading',
              role: 'assistant', // Correct role
              content: '...', // Correct content field
              timestamp: new Date(),
            }}
          />
          // Consider a more specific typing indicator component later
        )}

      <div ref={messagesEndRef} />
    </div>
  );
}
