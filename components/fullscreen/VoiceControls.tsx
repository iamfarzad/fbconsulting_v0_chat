"use client";

import React from 'react';
import { Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { generateWaveformBars } from '@/lib/ui-utils';

interface VoiceControlsProps {
  isRecording: boolean;
  handleVoiceToggle: () => void;
  aiState: string;
  transcript: string;
  isProcessing: boolean;
  variant?: 'hero' | 'floating';
}

export default function VoiceControls({
  isRecording,
  handleVoiceToggle,
  aiState,
  transcript,
  isProcessing,
  variant = 'floating'
}: VoiceControlsProps) {
  const isHero = variant === 'hero';

  return (
    <div className={cn(
      "flex items-center gap-4",
      "p-3 bg-black"
    )}>
      {/* Main control button */}
      <Button
        onClick={handleVoiceToggle}
        disabled={isProcessing}
        size="lg"
        variant={"ghost"}
        className={cn(
          "h-12 w-12 rounded-full",
          "transition-all duration-300 ease-in-out",
          "border-2",
          isRecording ? (
            "border-orange-500 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
          ) : (
            "border-white/20 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-500"
          ),
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        {isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
      </Button>

      {/* Status indicators */}
      <div className="flex items-center gap-3">
        {/* Waveform visualization */}
        {isRecording && (
          <div className={cn(
            "flex items-center gap-[2px] h-6 px-3 py-1 rounded-full",
            "bg-neutral-800"
          )}>
            {generateWaveformBars(5, true)}
          </div>
        )}

        {/* Status text */}
        <span className={cn(
          "text-sm font-mono",
          "text-white/60"
        )}>
          {isProcessing ? "Processing..." : isRecording ? "Listening..." : "Press to speak"}
        </span>
      </div>

      {/* Transcript preview */}
      {transcript && (
        <div className={cn(
          "flex-1 px-3 py-1.5 rounded-lg text-sm truncate",
          "bg-neutral-800 text-white/80"
        )}>
          {transcript}
        </div>
      )}
    </div>
  );
}
