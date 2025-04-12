'use client';

import Link from 'next/link';
import { Chat } from '@/components/chat';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react'; // Import icons for CTA

export default function HomePage() {
  return (
    // Main container for the hero section
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 lg:py-32">
      {/* Max width container for content */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-6 md:gap-8">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
          How can AI automation help your business?
        </h1>
        {/* Subheadline */}
        <p className="text-lg text-muted-foreground max-w-lg">
          Ask me anything about AI automation, workflow optimization, or how to
          reduce costs with intelligent systems
        </p>
        {/* Chat Component Wrapper with Glassmorphism */}
        <div className="w-full glassmorphism-base rounded-xl p-1 md:p-2 shadow-lg">
          {/* Existing Chat Component */}
          <Chat />
        </div>
        {/* CTA Button */}
        <Button
          asChild
          size="lg"
          className="mt-6 bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl"
        >
          <Link href="/contact" className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            <span>Book Free Consultation</span> {/* Wrapped text in span */}
            {/* <ArrowRight className="ml-2 h-4 w-4" /> Optional icon */}
          </Link>
        </Button>
      </div>
    </div>
  );
}
