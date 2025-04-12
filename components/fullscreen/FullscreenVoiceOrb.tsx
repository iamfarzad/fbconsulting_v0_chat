"use client";

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { generateWaveformBars } from '@/lib/ui-utils';

// Define props
interface FullscreenVoiceOrbProps {
  aiState: string;
  isRecording: boolean;
  transcript: string;
  handleVoiceToggle: () => void; // Renamed from handleVoiceStart for consistency
  handleClose: () => void;
}

export default function FullscreenVoiceOrb({
  aiState,
  isRecording,
  transcript,
  handleVoiceToggle,
  handleClose
}: FullscreenVoiceOrbProps) {
  // States mapped to visual feedback (using props now)
  const isActive = aiState !== 'idle';
  const isPulsing = isRecording || aiState === 'speaking';
  const isProcessing = aiState === 'processing';

  return (
    // NOTE: This component renders a full fixed overlay. 
    // Might need adjustment if it's meant to be *part* of FullscreenChatView
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[60] flex flex-col items-center justify-center">
      {/* Close button - uses prop */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose} // Use prop
        className="absolute top-4 right-4 text-white/60 hover:text-white"
      >
        <X size={24} />
      </Button>

      {/* Central orb */}
      <div className="relative">
        {/* Outer rings - uses isPulsing derived from props */}
        <AnimatePresence>
          {isPulsing && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-0 rounded-full border-2 border-orange-500"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 0.05 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute inset-0 rounded-full border-2 border-orange-500"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main orb button - uses prop */}
        <motion.button
          onClick={handleVoiceToggle} // Use prop
          className={cn(
            "relative w-32 h-32 rounded-full",
            "bg-black border-2",
            "flex items-center justify-center",
            "transition-colors duration-300",
            isPulsing 
              ? "border-orange-500 shadow-lg shadow-orange-500/20" 
              : "border-white/20",
            isActive && "border-orange-500/50"
          )}
        >
          {/* Waveform visualization - uses derived state */}
          <div className="flex items-center gap-1">
            {generateWaveformBars(6, isActive || isRecording)}
          </div>
        </motion.button>

        {/* Status text - uses props */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <span className="font-mono text-sm text-white/60">
            {isProcessing 
              ? "Processing..." 
              : isRecording 
                ? "Listening..." 
                : aiState === 'speaking' 
                  ? "Speaking..." 
                  : "Press to speak"}
          </span>
        </div>
      </div>

      {/* Transcript or processing display - uses props */}
      <AnimatePresence mode="wait">
        {(transcript || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6"
          >
            <div className="bg-neutral-900/90 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
              <p className="text-center text-white/90">
                {isProcessing ? (
                  <span className="text-orange-500">Processing your request...</span>
                ) : (
                  transcript
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
