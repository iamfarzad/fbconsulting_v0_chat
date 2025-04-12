'use client'

import { useState, useRef } from 'react'
import { Button } from './button'
import { Textarea } from './textarea'
import { Mic, Send, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useVoiceRecording } from '@/hooks/useVoiceRecording'

interface ChatInputProps {
  onSend: (message: string) => void
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isLoading?: boolean
}

export default function ChatInput({
  onSend,
  value,
  onChange,
  placeholder = "Message Lovable...",
  isLoading = false
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { isRecording, startRecording, stopRecording } = useVoiceRecording()

  const handleSubmit = () => {
    if (!value.trim() || isLoading || isRecording) return
    onSend(value.trim())
    onChange('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }
  
  const handleAttachClick = () => {
    console.log("Attach file clicked");
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      console.log("Stopped recording (placeholder)");
    } else {
      startRecording();
      console.log("Started recording (placeholder)");
    }
  }

  return (
    <div className="flex items-end gap-2 rounded-lg border bg-gray-100 dark:bg-gray-800 p-2.5 shadow-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 flex-shrink-0 text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent"
        onClick={handleAttachClick}
        disabled={isLoading || isRecording}
      >
        <Paperclip className="h-4 w-4" />
        <span className="sr-only">Attach file</span>
      </Button>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-y-auto text-sm",
          "dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
          "min-h-[24px] max-h-[120px] leading-snug py-0.5"
        )}
        rows={1}
        disabled={isLoading || isRecording}
      />

      <Button 
        variant="ghost"
        size="icon" 
        className={cn(
          "h-8 w-8 flex-shrink-0 text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent",
          isRecording && "text-red-500 dark:text-red-500 animate-pulse"
        )}
        onClick={toggleRecording}
        disabled={isLoading}
      >
        <Mic className="h-4 w-4" />
        <span className="sr-only">Toggle recording</span>
      </Button>

      <Button 
        size="icon" 
        className="h-8 w-8 flex-shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground rounded-md flex items-center justify-center"
        onClick={handleSubmit}
        disabled={!value.trim() || isLoading || isRecording}
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  )
} 