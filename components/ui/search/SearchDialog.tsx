'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SearchBar } from './SearchBar';
import type { SearchResultItem } from './SearchResults';
import { SearchResults } from './SearchResults';

// Temporary mock data until backend is implemented
const mockSearch = async (query: string): Promise<SearchResultItem[]> => {
  return [
    {
      id: '1',
      title: 'AI Consulting Services',
      description:
        'Expert consulting services for AI implementation and strategy.',
      url: '/services/ai-consulting',
      type: 'service',
      tags: ['AI', 'Consulting', 'Strategy'],
    },
    {
      id: '2',
      title: 'Machine Learning Solutions',
      description: 'Custom machine learning solutions for your business needs.',
      url: '/services/machine-learning',
      type: 'service',
      tags: ['ML', 'AI', 'Custom Solutions'],
    },
  ];
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    try {
      const results = await mockSearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResultItem) => {
    onOpenChange(false);
    router.push(result.url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center">Search</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for services, blog posts, FAQs..."
            className="w-full max-w-none"
          />

          {(searchResults.length > 0 || isSearching || searchQuery) && (
            <SearchResults
              results={searchResults}
              isLoading={isSearching}
              onResultClick={handleResultClick}
            />
          )}

          {!searchQuery && !isSearching && (
            <div className="py-6 text-center text-muted-foreground">
              <p>
                Try searching for services, blog posts, or frequently asked
                questions
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
