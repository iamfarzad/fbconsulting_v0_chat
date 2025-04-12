'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
// Corrected import to use Chat component
import { Chat } from '@/components/chat';
import { useSharedChat } from '@/lib/context/chat-context';
import { Button } from '@/components/ui/button';

// Common constants
const FULLSCREEN_BUTTON_CLASS = 'w-8 h-8 rounded-full hover:bg-accent';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
} as const satisfies Variants;

// Common styles
const chatContainerClass =
  'bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg overflow-hidden';

export function ExpandableChatWidget(): React.ReactElement | null {
  const pathname = usePathname();
  // Get widget state and toggle function from context
  const { isWidgetOpen, toggleWidget, ...chatHelpers } = useSharedChat();
  // Destructure fullscreen helpers separately
  const { isFullscreen, toggleFullscreen } = chatHelpers;

  const chatPanelRef = useRef<HTMLDivElement>(null);
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { trap, release } = useFocusTrap(chatPanelRef);

  // Handle focus trapping and management
  useEffect(() => {
    async function handleFocusState() {
      try {
        if (isWidgetOpen) {
          await trap();
          closeButtonRef.current?.focus(); // Focus close button on open
        } else {
          await release();
          // Logic to return focus to the trigger element would go here if needed
        }
      } catch (error) {
        console.error('Error managing focus:', error);
      }
    }
    void handleFocusState();
  }, [isWidgetOpen, trap, release]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape' && isWidgetOpen) {
        toggleWidget(); // Use context toggle function
      }
    },
    [isWidgetOpen, toggleWidget], // Add toggleWidget dependency
  );

  // Hide widget on chat page
  if (pathname?.startsWith('/chat')) {
    return null;
  }

  return (
    // AnimatePresence needs to be outside the conditional rendering
    <AnimatePresence>
      {isWidgetOpen && (
        <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label="Chat widget"
          variants={fadeInUp} // Use variants prop
          initial="initial"
          animate="animate"
          exit="exit"
          ref={chatPanelRef}
          className={`fixed bottom-8 right-8 z-50 w-[320px] md:w-[384px] h-[640px] ${chatContainerClass}`}
          aria-labelledby="chat-title"
          onKeyDown={handleKeyDown}
        >
          <div className="relative flex flex-col h-full">
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <h2 id="chat-title" className="text-sm font-medium">
                Chat
              </h2>
              <div className="flex items-center space-x-1">
                {/* Fullscreen Button */}
                <Button
                  ref={fullscreenButtonRef}
                  variant="ghost"
                  size="icon"
                  className={FULLSCREEN_BUTTON_CLASS}
                  onClick={toggleFullscreen}
                  aria-label="Open in fullscreen"
                >
                  <Maximize2 className="size-4" />
                </Button>
                {/* Close Button */}
                <Button
                  ref={closeButtonRef}
                  variant="ghost"
                  size="icon"
                  className={FULLSCREEN_BUTTON_CLASS}
                  onClick={toggleWidget} // Use context toggle function
                  aria-label="Close chat widget"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="relative flex flex-col size-full">
              {/* Use Chat component (it uses context internally) */}
              <Chat />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
