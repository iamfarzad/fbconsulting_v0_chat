'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
// Corrected import for Message type
import { type Message } from '@ai-sdk/react';

interface ChatBubbleProps {
  message: Message; // Use Message type
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start')}
    >
      {/* User avatar for assistant messages */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2">
          <span className="text-xs font-medium text-primary">AI</span>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          'max-w-[85%] px-4 py-3',
          isUser
            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl rounded-tr-sm'
            : 'bg-gradient-to-br from-muted/80 to-muted/40 rounded-2xl rounded-tl-sm',
        )}
        style={{
          boxShadow: isUser
            ? '0 2px 10px rgba(254, 90, 29, 0.15)'
            : '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        {/* Removed timestamp display as it's not on standard Message type */}
      </div>

      {/* User avatar for user messages */}
      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center ml-2">
          <span className="text-xs font-medium text-primary">You</span>
        </div>
      )}
    </motion.div>
  );
}
