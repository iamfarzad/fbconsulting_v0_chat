'use client';

import type { Message } from 'ai/react';
import { Button } from '@/components/ui/button';
import { PromptForm } from '@/components/prompt-form';
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { RedoIcon, StopIcon } from '@/components/icons';
import { useSharedChat } from '@/lib/context/chat-context';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface ChatPanelProps {
  id?: string;
  isLoading: boolean;
  stop: () => void;
  append: (
    message: Message,
    options?: any,
  ) => Promise<string | null | undefined>;
  reload: (options?: any) => Promise<string | null | undefined>;
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  isReadonly?: boolean;
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  messages,
  input,
  setInput,
  isReadonly,
}: ChatPanelProps) {
  const { isFullscreen } = useSharedChat();

  const handleSubmit = async (value: string) => {
    if (!id) return;
    await append({
      id,
      content: value,
      role: 'user',
      createdAt: new Date(),
    });
  };

  return (
    <motion.div layout className="relative">
      <ButtonScrollToBottom />
      <div
        className={cn(
          'mx-auto sm:max-w-2xl transition-all duration-300',
          isFullscreen && 'sm:max-w-4xl',
        )}
      >
        <div className="flex items-center justify-center h-12">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background/95 backdrop-blur-sm"
            >
              <StopIcon size={16} />
              <span className="ml-2">Stop generating</span>
            </Button>
          ) : messages?.length > 0 ? (
            <Button
              variant="outline"
              onClick={() => reload()}
              className="bg-background/95 backdrop-blur-sm"
            >
              <RedoIcon size={16} />
              <span className="ml-2">Regenerate response</span>
            </Button>
          ) : null}
        </div>

        <div
          className={cn(
            'space-y-4 transition-padding duration-300',
            isFullscreen ? 'py-4' : 'py-2 md:py-4',
          )}
        >
          <PromptForm
            onSubmit={handleSubmit}
            value={input}
            onChange={setInput}
            isLoading={isLoading}
            disabled={isReadonly}
            minRows={isFullscreen ? 2 : 1}
            maxRows={isFullscreen ? 12 : 6}
          />
        </div>
      </div>
    </motion.div>
  );
}
