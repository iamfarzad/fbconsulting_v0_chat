'use client';

import React from 'react';
import Link from 'next/link';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/chat';
import { VoiceOrb } from '@/components/ui/VoiceOrb';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

export function Hero() {
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat();
  const {
    isRecording,
    startRecording,
    stopRecording,
    transcribedText,
    isTranscribing,
  } = useVoiceRecording();

  const voiceState = isRecording
    ? 'listening'
    : isTranscribing
      ? 'thinking'
      : isLoading
        ? 'responding'
        : 'idle';

  const handleVoiceClick = async () => {
    if (isRecording) {
      await stopRecording();
      if (transcribedText) {
        append({
          role: 'user',
          content: transcribedText,
        });
      }
    } else {
      startRecording();
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Decorative Background - Moved to back */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 subtle-grid opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute h-[50rem] w-[90rem] origin-top-left -rotate-12 bg-brand-orange/5 blur-3xl" />
          <div className="absolute h-[40rem] w-[80rem] origin-top-right rotate-12 bg-foreground/5 blur-3xl" />
        </div>
      </div>

      {/* Content Container - Elevated above background */}
      <div className="container relative z-10 px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Heading */}
          <h1 className="animate-in fade-in slide-in-from-bottom-3 mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gradient">
            AI Automation & Integration
            <br />
            for Your Business
          </h1>

          {/* Subheading */}
          <p className="animate-in fade-in slide-in-from-bottom-4 mb-8 text-lg text-muted-foreground sm:text-xl">
            Transform your operations with custom AI solutions. Chat with our AI
            assistant to learn more.
          </p>

          {/* Chat Interface with Glassmorphism */}
          <div className="animate-in fade-in slide-in-from-bottom-5 mx-auto max-w-2xl mt-10">
            <div className="glassmorphism-base rounded-2xl p-4">
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                append={append}
                reload={reload}
                stop={stop}
                input={input}
                setInput={setInput}
                renderVoiceButton={() => (
                  <VoiceOrb
                    voiceState={voiceState}
                    onClick={handleVoiceClick}
                    size={48}
                    className="mx-2"
                  />
                )}
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="animate-in fade-in slide-in-from-bottom-6 mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            >
              <Link href="/contact">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
