'use client';

import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
// Corrected import for Message type
import { type Message } from '@ai-sdk/react';
import ChatBubble from './ChatBubble';

interface VirtualizedMessageListProps {
  messages: Message[]; // Use Message type
  parentRef: React.RefObject<HTMLElement>;
}

export default function VirtualizedMessageList({
  messages,
  parentRef,
}: VirtualizedMessageListProps) {
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div
      className="relative w-full"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualItem) => (
        <div
          key={virtualItem.key}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: virtualItem.size,
            transform: `translateY(${virtualItem.start}px)`,
          }}
        >
          <ChatBubble message={messages[virtualItem.index]} />
        </div>
      ))}
    </div>
  );
}
