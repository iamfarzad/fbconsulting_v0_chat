'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { generateWaveformBars } from '@/lib/ui-utils';
import { useBreathAnimation } from '@/hooks/useBreathAnimation';
import styles from './voice.module.css';

interface FullscreenVoiceOrbProps {
  aiState: string;
  isRecording: boolean;
  transcript: string;
  handleVoiceToggle: () => void;
  handleClose: () => void;
}

export default function FullscreenVoiceOrb({
  aiState,
  isRecording,
  transcript,
  handleVoiceToggle,
  handleClose,
}: FullscreenVoiceOrbProps) {
  const isActive = aiState !== 'idle';
  const isPulsing = isRecording || aiState === 'speaking';
  const isProcessing = aiState === 'processing';
  const { breathScale } = useBreathAnimation({ isActive: isPulsing });

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/95 backdrop-blur-lg z-[60]',
        'flex flex-col items-center justify-center',
        styles.dynamicPattern,
      )}
      data-active={isActive}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
      >
        <X className="size-6" />
      </Button>

      {/* Central orb */}
      <div className="relative">
        {/* Outer rings with radial gradient */}
        <AnimatePresence>
          {isPulsing && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.15, 0.05, 0.15],
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
                className={cn(
                  'absolute inset-[-30px] rounded-full',
                  'border-2 border-brand-orange',
                  styles.outerRing,
                )}
                style={{ transform: `scale(${breathScale})` }}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.1, 0.02, 0.1],
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: 0.2,
                }}
                className={cn(
                  'absolute inset-[-40px] rounded-full',
                  'border-2 border-brand-orange',
                  styles.outerRingSecondary,
                )}
                style={{ transform: `scale(${breathScale + 0.2})` }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Main orb button with improved gradients */}
        <motion.button
          onClick={handleVoiceToggle}
          className={cn(
            'relative size-32 rounded-full',
            'flex items-center justify-center',
            'transition-all duration-300',
            'border-2',
            isPulsing
              ? 'border-brand-orange shadow-lg shadow-brand-orange/20'
              : 'border-white/20',
            isActive && 'border-brand-orange/50',
            isPulsing ? styles.orbActive : styles.orbInactive,
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Waveform visualization */}
          <div
            className={cn(
              'flex items-center gap-1',
              'transition-opacity duration-300',
              isProcessing && 'opacity-50',
            )}
          >
            {generateWaveformBars(6, isActive || isRecording)}
          </div>

          {/* Inner glow */}
          <div
            className={cn(
              'absolute inset-0 rounded-full',
              'opacity-0 transition-all duration-300',
              isPulsing && 'opacity-100',
              styles.innerGlow,
            )}
          />
        </motion.button>

        {/* Status text with improved animation */}
        <motion.div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2"
          initial={false}
          animate={{
            opacity: isPulsing ? 1 : 0.6,
            y: isPulsing ? 0 : 2,
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-mono text-sm text-white/60">
            {isProcessing
              ? 'Processing...'
              : isRecording
                ? 'Listening...'
                : aiState === 'speaking'
                  ? 'Speaking...'
                  : 'Press to speak'}
          </span>
        </motion.div>
      </div>

      {/* Transcript or processing display with improved glassmorphism */}
      <AnimatePresence mode="wait">
        {(transcript || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6"
          >
            <div
              className={cn(
                'bg-neutral-900/80 backdrop-blur-xl',
                'border border-white/10',
                'p-4 rounded-2xl',
                'shadow-lg shadow-black/20',
              )}
            >
              <p className="text-center text-white/90">
                {isProcessing ? (
                  <span className="text-brand-orange">
                    <motion.span
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse',
                      }}
                    >
                      Processing your request...
                    </motion.span>
                  </span>
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
