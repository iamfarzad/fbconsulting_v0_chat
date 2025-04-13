'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type VoiceState = 'idle' | 'listening' | 'thinking' | 'responding';

interface VoiceOrbProps {
  voiceState: VoiceState;
  onClick?: () => void;
  size?: number;
  className?: string;
}

export function VoiceOrb({
  voiceState,
  onClick,
  size = 48,
  className,
}: VoiceOrbProps) {
  const baseStyle = {
    width: size,
    height: size,
  };

  // Enhanced animation variants for the orb
  const orbVariants = {
    idle: {
      scale: 1,
      opacity: 0.8,
    },
    listening: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
    thinking: {
      scale: [1, 1.05, 1],
      rotate: [0, 180],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
    responding: {
      scale: [1, 1.15, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  // Enhanced glow ring animations
  const ringVariants = {
    idle: {
      scale: 1,
      opacity: 0,
    },
    listening: {
      scale: [1, 1.5, 1],
      opacity: [0.2, 0, 0.2],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
    thinking: {
      scale: [1, 1.3, 1],
      opacity: [0.15, 0, 0.15],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
    responding: {
      scale: [1, 1.2, 1],
      opacity: [0.1, 0, 0.1],
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center',
        'rounded-full transition-colors duration-200',
        'hover:bg-accent/10 active:bg-accent/20',
        className,
      )}
      style={baseStyle}
    >
      {/* Outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-brand-orange/20 blur-xl"
        initial="idle"
        animate={voiceState}
        variants={ringVariants}
      />

      {/* Multiple animated rings for depth */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-brand-orange/30"
        initial="idle"
        animate={voiceState}
        variants={ringVariants}
      />
      <motion.div
        className="absolute inset-[2px] rounded-full border-2 border-brand-orange/20"
        initial="idle"
        animate={voiceState}
        variants={ringVariants}
        style={{ animationDelay: '100ms' }}
      />

      {/* Main orb with gradient */}
      <motion.div
        className={cn(
          'absolute inset-[4px] rounded-full',
          'bg-gradient-to-br from-brand-orange/90 to-brand-orange/70',
          'shadow-lg shadow-brand-orange/20',
        )}
        initial="idle"
        animate={voiceState}
        variants={orbVariants}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-[6px] rounded-full bg-white/20 blur-sm"
        initial="idle"
        animate={voiceState}
        variants={orbVariants}
      />
    </motion.button>
  );
}
