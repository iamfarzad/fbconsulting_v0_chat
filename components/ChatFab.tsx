'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { useSharedChat } from '@/lib/context/chat-context';
import { Button } from '@/components/ui/button';
import VoiceOrb from './ui/VoiceOrb'; // Import VoiceOrb

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
  const {
    isWidgetOpen,
    toggleWidget,
    voiceState, // Get voice state from context
    startVoiceInput, // Get actions from context
    stopVoiceInput, // Get actions from context
  } = useSharedChat(); // Use shared context

  // Placeholder state/actions - will be replaced by context in next step
  const currentVoiceState = voiceState; // Use context state
  // Define a wrapper function for onClick
  const handleFabClick = () => {
    if (isWidgetOpen) {
      toggleWidget(); // Close widget
    } else {
      // Toggle listening state using context actions
      if (currentVoiceState === 'listening') {
        stopVoiceInput();
      } else if (
        currentVoiceState === 'idle' ||
        currentVoiceState === 'error'
      ) {
        // Start recording only if idle or error
        startVoiceInput();
      }
      // Do nothing if 'thinking'
    }
  };
  const getAriaLabel = () => {
    if (isWidgetOpen) return 'Close chat';
    switch (currentVoiceState) {
      case 'listening':
        return 'Stop recording';
      case 'thinking':
        return 'Processing...';
      case 'error':
        return 'Voice error, try again'; // Added error label
      default: // idle
        return 'Start voice chat';
    }
  };

  // Hide FAB on the homepage ('/') or chat page (Added chat page check)
  if (pathname === '/' || pathname?.startsWith('/chat')) {
    return null;
  }

  return (
    <motion.div
      key="chat-fab-container"
      variants={fadeScale}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed bottom-8 right-8 z-50"
    >
      {/* Removed duplicate '>' */}
      {/* Wrap Button in motion.div if Button itself doesn't support layout prop */}
      <motion.div layout>
        <Button
          variant="default"
          size="icon"
          className={fabClass}
          onClick={handleFabClick} // Placeholder
          aria-label={getAriaLabel()} // Placeholder
          aria-expanded={isWidgetOpen}
          disabled={currentVoiceState === 'thinking'} // Placeholder
          // aria-controls="chat-widget-panel" // Keep if widget panel has this ID
        >
          <AnimatePresence initial={false} mode="wait">
            {isWidgetOpen ? (
              // Show X icon when widget is open
              <motion.div
                key="close-icon"
                variants={iconRotate}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              // Show VoiceOrb when widget is closed
              <motion.div
                key="voice-orb"
                variants={fadeScale} // Use fadeScale for orb appearance
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 flex items-center justify-center" // Center orb
              >
                <VoiceOrb
                  voiceState={currentVoiceState} // Placeholder
                  onClick={() => {}} // Handled by parent Button
                  size={56} // Slightly smaller than FAB
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
      {/* Removed duplicate closing tags */}
    </motion.div>
  );
}
