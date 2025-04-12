"use client";

import React, { useState, useRef } from 'react';
import { Send, Mic, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatInputControlsProps {
  onSubmit: (message: string) => void;
  onVoiceToggle: () => void;
  isRecording: boolean;
  isLoading: boolean;
  variant?: 'hero' | 'floating';
}

const SUGGESTIONS = [
  "How can AI automation help my business?",
  "What are the benefits of AI integration?",
  "Tell me about industry-specific AI solutions"
];

export default function ChatInputControls({
  onSubmit: handleParentSubmit,
  onVoiceToggle,
  isRecording,
  isLoading,
  variant = 'floating'
}: ChatInputControlsProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isHero = variant === 'hero';
  const isFullscreen = true;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    handleParentSubmit(input);
    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <Textarea
        ref={textareaRef}
        placeholder="Type your message..."
        value={input}
        onChange={handleInputChange}
        className={cn(
          "min-h-[48px] w-full resize-none pr-20 focus:ring-1",
          "rounded-xl bg-neutral-900 border-neutral-700 text-white/90 placeholder:text-neutral-500 focus:border-orange-500/50 focus:ring-orange-500/30",
          isFullscreen ? "text-base" : "text-sm"
        )}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
          }
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          }
        }}
        disabled={isLoading || isRecording}
      />
      
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className={cn(
            "h-8 w-8 rounded-lg",
            "text-neutral-400 hover:text-orange-500 hover:bg-orange-500/10",
            "transition-colors duration-200"
          )}
          disabled={isLoading || isRecording}
        >
          <Plus size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={cn(
            "h-8 w-8 rounded-lg transition-colors duration-200",
            "text-neutral-400 hover:text-orange-500 hover:bg-orange-500/10",
            isRecording && "text-orange-500 bg-orange-500/10"
          )}
          onClick={onVoiceToggle}
          disabled={isLoading}
        >
          <Mic size={16} />
        </Button>
        
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className={cn(
            "h-8 w-8 rounded-lg",
            "text-neutral-400 hover:text-orange-500 hover:bg-orange-500/10",
            "transition-colors duration-200",
            (!input.trim() || isLoading || isRecording) && "opacity-50 cursor-not-allowed"
          )}
          disabled={!input.trim() || isLoading || isRecording}
        >
          <Send size={16} />
        </Button>
      </div>

      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={cn(
            "absolute bottom-full mb-2 left-0 right-0 p-2 rounded-lg shadow-lg",
            "space-y-1",
            "bg-neutral-800 border border-neutral-700"
          )}
        >
          {SUGGESTIONS.map((suggestion, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm",
                "hover:bg-neutral-700 text-neutral-300"
              )}
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}
    </form>
  );
}
