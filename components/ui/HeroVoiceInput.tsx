'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { Mic } from 'lucide-react';

interface HeroVoiceInputProps {
  isListening: boolean;
  toggleListening: () => void;
  isVoiceSupported: boolean;
  isTranscribing?: boolean;
  chatInputValue?: string;
  onInputChange?: (value: string) => void;
  useGeminiApi?: boolean;
  transcript?: string;
}

export const HeroVoiceInput: React.FC<HeroVoiceInputProps> = ({
  isListening,
  toggleListening,
  isVoiceSupported,
  isTranscribing = false,
  transcript = ""
}) => {
  if (!isVoiceSupported) {
      console.warn("HeroVoiceInput: Voice not supported, component will not render.");
      return null;
  }
  
  return (
    <div className="relative flex items-center">
      <button
        onClick={toggleListening}
        className={cn(
          "p-2 rounded-full transition-colors duration-200 ease-in-out h-8 w-8 flex items-center justify-center",
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
        )}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <Mic className="h-4 w-4" />
      </button>
      
      {(isTranscribing || transcript) && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded shadow-lg text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap z-10">
          {transcript ? (
             <span className='italic truncate max-w-[150px]'>{transcript}</span>
          ) : (
             <span>Transcribing<span className='ai-animate-pulse'>...</span></span> 
          )}
        </div>
      )}
    </div>
  );
}; 