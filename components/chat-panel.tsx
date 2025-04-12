'use client';

import type { UseChatHelpers } from 'ai/react'; // Make type-only import
import { Button } from '@/components/ui/button';
import { PromptForm } from '@/components/prompt-form';
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { RedoIcon, StopIcon } from '@/components/icons'; // Use RedoIcon and StopIcon
// Removed FooterText import
// import { FooterText } from '@/components/footer';

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    'append' | 'isLoading' | 'reload' | 'messages' | 'stop'
  > {
  id?: string;
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  messages,
}: ChatPanelProps) {
  return (
    // Removed fixed positioning. Let parent div in chat.tsx handle background.
    <div>
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex items-center justify-center h-16">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background" // Use theme background
            >
              <StopIcon /> {/* Removed className */}
              <span className="ml-2">Stop generating</span>{' '}
              {/* Added span for margin */}
            </Button>
          ) : messages?.length > 0 ? (
            <Button
              variant="outline"
              onClick={() => reload()}
              className="bg-background" // Use theme background
            >
              <RedoIcon /> {/* Removed className */}
              <span className="ml-2">Regenerate response</span>{' '}
              {/* Added span for margin */}
            </Button>
          ) : null}
        </div>
        {/* Removed shadow and rounded corners as parent handles border */}
        <div className="space-y-4 px-4 py-2 md:py-4">
          <PromptForm
            onSubmit={async (value) => {
              await append({
                id,
                content: value,
                role: 'user',
              });
            }}
            isLoading={isLoading} // Pass isLoading prop
          />
          {/* Removed FooterText usage */}
          {/* <FooterText className="hidden sm:block" /> */}
        </div>
      </div>
    </div>
  );
}
