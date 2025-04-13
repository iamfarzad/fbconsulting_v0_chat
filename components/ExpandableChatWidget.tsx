'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceOrb } from './ui/VoiceOrb';
import { cn } from '@/lib/utils';
import { SearchDialog } from './ui/search/SearchDialog';

interface ExpandableChatWidgetProps {
  className?: string;
}

export function ExpandableChatWidget({ className }: ExpandableChatWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<
    'idle' | 'listening' | 'thinking' | 'responding'
  >('idle');

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      <AnimatePresence>
        <motion.div
          className={cn(
            'fixed bottom-4 right-4 flex items-center justify-center',
            'rounded-full bg-background/80 backdrop-blur-md',
            'border border-border/50 shadow-lg',
            className,
          )}
          initial={false}
          animate={{
            width: isExpanded ? '600px' : '64px',
            height: isExpanded ? '80vh' : '64px',
            borderRadius: isExpanded ? '24px' : '32px',
          }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
        >
          {!isExpanded ? (
            <VoiceOrb
              voiceState={voiceState}
              onClick={toggleExpand}
              className="cursor-pointer hover:bg-accent/10"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="size-full p-4"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Chat</h2>
                  <button
                    type="button"
                    onClick={toggleExpand}
                    className="rounded-full p-2 hover:bg-accent/10"
                  >
                    <span className="sr-only">Close chat</span>×
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  {/* Chat messages will go here */}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 rounded-full bg-accent/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <VoiceOrb
                    voiceState={voiceState}
                    onClick={() => setVoiceState('listening')}
                    size={40}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
