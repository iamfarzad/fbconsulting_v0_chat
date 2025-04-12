'use client';

import { Button } from '@/components/ui/button';
import { GPSIcon } from '@/components/icons'; // Corrected icon import
import { Textarea } from '@/components/ui/textarea';
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'; // Corrected hook path
import { cn } from '@/lib/utils';
import { useRef } from 'react';

export interface PromptProps {
  onSubmit: (value: string) => Promise<void>;
  isLoading?: boolean;
}

export function PromptForm({ onSubmit, isLoading }: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!inputRef.current) return;

        const value = inputRef.current.value;
        inputRef.current.value = '';

        await onSubmit(value);
      }}
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Send a message..."
          spellCheck={false}
          // Adjusted padding and min-height for 8pt grid
          className="min-h-16 w-full resize-none bg-transparent px-4 py-5 focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          {/* Use theme primary color for button */}
          <Button
            type="submit"
            size="icon"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground" // Use theme colors
          >
            <GPSIcon size={16} /> {/* Added size prop */}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
