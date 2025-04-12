'use client';

import { useState } from 'react'; // Keep useState for local input value
import { Button } from '@/components/ui/button';
import { X, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessageList } from './ChatMessageList';
import ChatInput from './ChatInput';
import { useSharedChat } from '@/lib/context/chat-context'; // Import shared context hook

export function ExpandableChatWidget() {
  // Get shared state and functions from context
  const {
    append, // Use append from Vercel AI SDK
    isLoading,
    isWidgetOpen, // Use shared state for open/close
    toggleWidget, // Use shared toggle function
  } = useSharedChat();

  const [inputValue, setInputValue] = useState(''); // Local state for input remains

  // Function to handle sending message using Vercel AI SDK's append
  const handleSend = (message: string) => {
    if (!message.trim()) return;
    append({ role: 'user', content: message });
    setInputValue(''); // Clear input after sending
  };

  return (
    <>
      {/* Launcher Button - Use toggleWidget from context */}
      <Button
        onClick={toggleWidget}
        variant="default"
        className={cn(
          'fixed bottom-4 right-4 z-50',
          'rounded-full w-14 h-14 shadow-lg', // Standard FAB size
          'flex items-center justify-center',
          'transition-transform hover:scale-110',
        )}
        aria-label={isWidgetOpen ? 'Close Chat' : 'Open Chat'}
      >
        {/* Toggle icon based on isWidgetOpen */}
        {isWidgetOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>

      {/* Expandable Panel - Controlled by isWidgetOpen */}
      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={cn(
              'fixed bottom-20 right-4 z-40', // Position above FAB
              'w-[90vw] max-w-md h-[70vh] max-h-[600px]', // Sizing
              'bg-white dark:bg-gray-900 rounded-lg shadow-xl',
              'border border-gray-200 dark:border-gray-700',
              'flex flex-col overflow-hidden', // Layout
            )}
          >
            {/* Optional Header */}
            <div className="p-3 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-sm">Chat with AI ✨</h3>
              {/* Close button uses toggleWidget */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleWidget}
                className="h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Message List - Will be refactored next to use shared messages */}
            <ChatMessageList />

            {/* Input Area - Use handleSend which calls append */}
            <div className="p-3 border-t dark:border-gray-700">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSend}
                placeholder="Type your message..."
                isLoading={isLoading} // Pass loading state
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
