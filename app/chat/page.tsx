'use client';

import React from 'react';
import { Chat } from '@/components/chat';

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Your AI Assistant
        </h1>
        <Chat />
      </div>
    </div>
  );
}
