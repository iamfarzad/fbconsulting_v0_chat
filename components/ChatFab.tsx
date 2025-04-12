'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { useSharedChat } from '@/lib/context/chat-context';
import { Button } from '@/components/ui/button';

// Animation for FAB fade/scale
const fadeScale = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

// Animation for icon rotation
const iconRotate = {
  initial: { rotate: -45, opacity: 0 },
  animate: {
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    rotate: 45,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// FAB specific styling
const fabClass =
  'rounded-full w-16 h-16 shadow-lg flex items-center justify-center transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 bg-primary text-primary-foreground';

export function ChatFab() {
  const pathname = usePathname();
  const { isWidgetOpen, toggleWidget } = useSharedChat();

  // Hide FAB on the homepage ('/')
  if (pathname === '/') {
    return null;
  }

  return (
    // Use AnimatePresence to animate the FAB itself in/out if needed,
    // though here it's mainly for the icon swap.
    <motion.div
      key="chat-fab-container" // Unique key for the container
      variants={fadeScale} // Apply fade/scale to the container
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed bottom-8 right-8 z-50" // Position the container
    >
      <Button
        variant="default"
        size="icon"
        className={fabClass}
        onClick={toggleWidget}
        aria-label={isWidgetOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isWidgetOpen}
        aria-controls="chat-widget-panel" // Point to the panel ID if set
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isWidgetOpen ? 'close-icon' : 'open-icon'} // Key changes for icon swap
            variants={iconRotate}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {isWidgetOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageSquare className="h-6 w-6" />
            )}
          </motion.div>
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
