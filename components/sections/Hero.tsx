'use client';

import { type ReactElement, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Upload, ArrowUp, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import type { Message } from '@/components/ui/ChatMessage';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { SuggestionButton } from '@/components/ui/SuggestionButton';
import { HeroVoiceInput } from '@/components/ui/HeroVoiceInput';
import { ChatMessage } from '@/components/ui/ChatMessage';
import PromptButtons from '@/components/ui/PromptButtons';
import AnimatedWordCycle from '@/components/ui/AnimatedWordCycle';

// --- Renamed to HeroChatDisplay ---
function HeroChatDisplay() {
  // Add state for messages - Placeholder
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Welcome! Ask me anything.',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null); // Ref for the container

  // Input state remains
  const [messageInput, setMessageInput] = useState('');
  // const [response, setResponse] = useState('') // Can remove this if using messages array
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    transcribedText,
  } = useVoiceRecording();

  // Effect to scroll message list - run on messages change *and* initial load
  useEffect(() => {
    // Use setTimeout to allow the DOM to update after initial render or message add
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 100); // Small delay
  }, [messages]); // Keep dependency array as is, setTimeout handles timing

  // Effect to update main input when transcription completes
  useEffect(() => {
    if (transcribedText && !isTranscribing) {
      setMessageInput(transcribedText);
    }
  }, [transcribedText, isTranscribing]);

  const handleSend = async () => {
    const userMessageText = messageInput.trim();
    if (!userMessageText || isLoading || isRecording) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setMessageInput('');
    setIsLoading(true);
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // --- TODO: Replace with actual API call logic ---
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Received: "${userMessageText}" (API logic pending)`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    // --- End TODO ---

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleAttachClick = () => {
    console.log('Attach file clicked');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessageInput(suggestion);
    // Optionally auto-send suggestion?
    // handleSend();
  };

  const toggleListening = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setMessageInput('');
      startRecording();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-4">
      {/* Message display area - Adjust styling */}
      <div
        ref={messagesContainerRef} // Add ref to container
        // Use relative positioning, maybe flex-grow if parent allows?
        // Use max-h carefully, ensure parent container provides space
        className="overflow-y-auto max-h-60 p-3 ai-custom-scrollbar space-y-3 border dark:border-gray-700/50 rounded-lg relative min-h-[100px]" // Ensure min-height
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <ChatMessage
            message={{
              id: 'loading',
              role: 'assistant',
              content: '...',
              timestamp: new Date(),
            }}
          />
        )}
        {/* Ensure the scroll target is at the very end */}
        <div ref={messagesEndRef} className="h-0" />
      </div>

      {/* Input container - remove fixed height relation */}
      <div className="bg-white dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 flex flex-col gap-3">
        <Textarea
          ref={textareaRef}
          value={messageInput} // Use messageInput state
          onChange={(e) => setMessageInput(e.target.value)} // Use messageInput state
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about AI automation..."
          className={cn(
            'w-full border-none focus:outline-none focus:ring-0 bg-transparent text-sm dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none overflow-y-auto',
            'min-h-[60px] max-h-[200px]',
          )}
          rows={2}
          disabled={isLoading || isRecording}
        />

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-700/50">
          {/* Left side: Upload */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 dark:text-gray-400 hover:text-foreground dark:hover:text-white text-xs px-2"
              onClick={handleAttachClick}
              disabled={isLoading || isRecording}
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload File
            </Button>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              No files attached
            </span>
          </div>
          {/* Right side: Suggestion, Mic, Send */}
          <div className="flex items-center gap-2">
            <SuggestionButton
              suggestion="Suggest an idea"
              onClick={() => handleSuggestionClick('Suggest an idea')} // Pass suggestion text
              disabled={isLoading || isRecording}
            />
            <HeroVoiceInput
              isListening={isRecording}
              isTranscribing={isTranscribing}
              transcript={transcribedText}
              toggleListening={toggleListening}
              isVoiceSupported={navigator?.mediaDevices !== undefined}
            />
            <Button
              size="icon"
              className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={handleSend}
              disabled={!messageInput.trim() || isLoading || isRecording} // Check messageInput
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Prompt Buttons Below Input */}
      <div className="mt-2">
        <PromptButtons onSelect={handleSuggestionClick} />
      </div>
    </div>
  );
}

// --- HeroBackground (from old project) ---
function HeroBackground() {
  return (
    <>
      <AnimatedGridPattern
        numSquares={50}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          '[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
        )}
      />

      {/* Optional: Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        <div className="w-6 h-9 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-foreground/40" />
        </div>
      </motion.div>
    </>
  );
}

// --- HeroActions (from old project, adapted) ---
function HeroActions() {
  const router = useRouter();

  const handleConsultationClick = () => {
    // Add analytics tracking if needed
    router.push('/contact'); // Navigate using Next.js router
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex justify-center pt-8"
    >
      <ShimmerButton
        onClick={handleConsultationClick}
        className="px-8 py-3 text-lg shadow-lg hover:shadow-xl text-white dark:text-white"
        background="#fe5a1d"
        shimmerColor="rgba(255, 255, 255, 0.4)"
        shimmerSize="0.1em"
        shimmerDuration="2.5s"
        borderRadius="9999px"
      >
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          <span>Book Free Consultation</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </ShimmerButton>
    </motion.div>
  );
}

// --- HeroContent (Use the renamed HeroChatDisplay and AnimatedWordCycle) ---
function HeroContent() {
  const heroWords = ['automation', 'efficiency', 'insights', 'growth'];

  return (
    // Increase top padding, especially on smaller screens, to make space for absolute elements
    <div className="container mx-auto max-w-4xl relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 md:pt-16">
      {/* Placeholder for Top Right Elements */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-4 z-20">
        {/* Ensure higher z-index */}
        <span className="text-sm text-muted-foreground">☀️ Hi Early Riser</span>
        <Button variant="outline" size="sm" className="text-xs h-7">
          {/* Placeholder */}
          <Globe className="w-3 h-3 mr-1" />
          English
        </Button>
      </div>

      <motion.h1
        // Remove specific top margin, rely on container padding
        className="text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground dark:text-white mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        How can AI
        <AnimatedWordCycle words={heroWords} className="text-accent" /> help
        your business?
      </motion.h1>

      <motion.p
        className="mt-4 text-lg text-muted-foreground dark:text-gray-300 max-w-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Ask me anything about AI automation, workflow optimization, or how to
        reduce costs with intelligent systems
      </motion.p>

      <HeroChatDisplay />

      <HeroActions />
    </div>
  );
}

// --- Main Hero Component ---
export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4">
      <HeroBackground />
      <HeroContent />
    </section>
  );
}
