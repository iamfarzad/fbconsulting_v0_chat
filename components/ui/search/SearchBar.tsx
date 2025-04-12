'use client';

import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'transparent';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  className,
  variant = 'default',
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const variantClasses = {
    default: 'border border-border bg-background rounded-lg w-full max-w-xs',
    minimal: 'border-none bg-transparent',
    transparent: 'border-none bg-transparent',
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-center relative',
        variantClasses[variant],
        className,
      )}
    >
      <Search className="absolute left-3 size-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          'pl-9 pr-9 py-2 bg-transparent',
          variant === 'minimal' && 'border-none focus-visible:ring-0',
          variant === 'transparent' && 'border-none focus-visible:ring-0',
        )}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 size-7 hover:bg-transparent"
          onClick={handleClear}
        >
          <X className="size-3" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </form>
  );
};
