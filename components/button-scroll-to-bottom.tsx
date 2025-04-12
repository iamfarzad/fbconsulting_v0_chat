'use client';

import * as React from 'react';
import { ArrowDownIcon } from '@/components/icons';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useAtBottom } from '../lib/hooks/use-at-bottom';

export function ButtonScrollToBottom({ className, ...props }: ButtonProps) {
  const isAtBottom = useAtBottom();

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }
      {...props}
    >
      <ArrowDownIcon className="size-4" />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}
