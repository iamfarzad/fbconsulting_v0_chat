'use client';

import { Button } from '@/components/ui/button';
import { GPSIcon } from '@/components/icons';
import { Textarea } from '@/components/ui/textarea';
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

export interface PromptProps {
  onSubmit: (value: string) => Promise<void>;
  value?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
}

export function PromptForm({
  onSubmit,
  value = '',
  onChange,
  isLoading,
  disabled,
  minRows = 1,
  maxRows = 6,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textareaRef.current) return;

    const text = textareaRef.current.value.trim();
    if (!text || isLoading || disabled) return;

    await onSubmit(text);
    if (onChange) {
      onChange('');
    } else {
      textareaRef.current.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }

    // Adjust height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        Math.max(textareaRef.current.scrollHeight, minRows * 24),
        maxRows * 24,
      )}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background sm:rounded-md sm:border px-4 sm:px-8">
        <Textarea
          ref={textareaRef}
          tabIndex={0}
          rows={minRows}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder="Send a message..."
          spellCheck={false}
          className={cn(
            'min-h-[48px] w-full resize-none bg-transparent py-4 pr-12 focus-within:outline-none',
            'text-base sm:text-sm',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          disabled={disabled || isLoading}
        />
        <div className="absolute right-4 top-4 sm:right-8">
          <Button
            type="submit"
            size="icon"
            disabled={!value.trim() || isLoading || disabled}
            className={cn(
              'bg-primary hover:bg-primary/90 text-primary-foreground transition-opacity',
              (!value.trim() || isLoading || disabled) && 'opacity-50',
            )}
          >
            <GPSIcon size={16} />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
