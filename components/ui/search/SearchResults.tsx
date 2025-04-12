'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'blog' | 'service' | 'page' | 'faq';
  date?: string;
  image?: string;
  tags?: string[];
}

interface SearchResultsProps {
  results: SearchResultItem[];
  isLoading: boolean;
  className?: string;
  onResultClick?: (result: SearchResultItem) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  className,
  onResultClick,
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          'w-full p-4 bg-background dark:bg-black border rounded-lg shadow-lg',
          className,
        )}
      >
        <div className="space-y-3">
          {['skeleton-1', 'skeleton-2', 'skeleton-3'].map((id) => (
            <div key={id} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className={cn('w-full', className)}>
      <div className="space-y-4 p-4">
        {results.map((result) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group"
          >
            <Link
              href={result.url}
              className="block p-4 rounded-lg hover:bg-muted transition-colors"
              onClick={() => onResultClick?.(result)}
            >
              <div className="flex items-start gap-4">
                {result.image && (
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={result.image}
                      alt={result.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {result.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {result.description}
                  </p>
                  {result.tags && result.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};
