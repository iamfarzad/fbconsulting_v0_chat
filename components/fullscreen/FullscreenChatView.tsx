'use client';

import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import FullscreenVoiceOrb from './FullscreenVoiceOrb';
import ChatInputControls from './ChatInputControls';
import VoiceControls from './VoiceControls';
import { generateWaveformBars } from '@/lib/ui-utils';
import { cn } from '@/lib/utils';
import VirtualizedMessageList from './VirtualizedMessageList';
// Corrected import for Message type
import { type Message } from '@ai-sdk/react';

interface FullscreenChatViewProps {
  uiMode: string;
  messages: Message[]; // Use Message type
  transcript: string;
  aiState: string;
  isProcessing: boolean;
  isRecording: boolean;
  handleClose: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  setMode: (mode: string) => void;
  handleClearChat: () => void;
  handleSendMessage: (message: string) => void;
  handleVoiceToggle: () => void;
}

export default function FullscreenChatView({
  uiMode,
  messages,
  transcript,
  aiState,
  isProcessing,
  isRecording,
  handleClose,
  messagesEndRef,
  chatContainerRef,
  setMode,
  handleClearChat,
  handleSendMessage,
  handleVoiceToggle,
}: FullscreenChatViewProps) {
  if (uiMode !== 'fullscreenText' && uiMode !== 'fullscreenVoice') {
    return null;
  }

  const isVoiceMode = uiMode === 'fullscreenVoice';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-neutral-700 bg-black/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="font-mono text-sm text-white/80">
            {isVoiceMode ? 'Voice Interface' : 'AI Assistant'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="text-neutral-400 hover:text-white"
          >
            <Trash2 size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-neutral-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col bg-black/80">
        {isVoiceMode ? (
          // Voice Mode
          <div className="relative flex-1 flex items-center justify-center p-4">
            <FullscreenVoiceOrb
              aiState={aiState}
              isRecording={isRecording}
              transcript={transcript}
              handleVoiceToggle={handleVoiceToggle}
              handleClose={handleClose}
            />
          </div>
        ) : (
          // Text Chat Mode
          <ScrollArea
            ref={chatContainerRef as React.RefObject<HTMLDivElement>}
            className="flex-1 p-4"
          >
            <div className="space-y-4 max-w-4xl mx-auto">
              <VirtualizedMessageList
                messages={messages}
                parentRef={chatContainerRef as React.RefObject<HTMLElement>}
              />
              {isProcessing && aiState !== 'listening' && (
                <div className="flex justify-start">
                  <div className="bg-neutral-700 rounded-lg px-3 py-2 flex items-center space-x-1.5">
                    {generateWaveformBars(3, true)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Controls Area */}
      <div className="p-4 border-t border-neutral-700 bg-black/80">
        {isVoiceMode ? (
          <VoiceControls
            isRecording={isRecording}
            handleVoiceToggle={handleVoiceToggle}
            aiState={aiState}
            transcript={transcript}
            isProcessing={isProcessing}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            <ChatInputControls
              onSubmit={handleSendMessage}
              onVoiceToggle={handleVoiceToggle}
              isRecording={isRecording}
              isLoading={isProcessing}
            />
          </div>
        )}
      </div>
    </div>
  );
}
