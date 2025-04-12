'use client';

import React from 'react';
import Link from 'next/link'; // Use Next.js Link
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Assuming Label is available
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Linkedin, Github, Mail, Send } from 'lucide-react';

export function Footer() {
  // TODO: Replace placeholder links and content later if needed
  const quickLinks = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'About Me', url: '/about' },
    { name: 'Blog', url: '/blog' },
    { name: 'Contact', url: '/contact' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', url: '#', icon: <Linkedin className="h-4 w-4" /> }, // Add actual URL
    {
      name: 'Email',
      url: 'mailto:hello@farzadbayat.com',
      icon: <Mail className="h-4 w-4" />,
    },
    { name: 'GitHub', url: '#', icon: <Github className="h-4 w-4" /> }, // Add actual URL
  ];

  const legalLinks = [
    { name: 'Privacy Policy', url: '/privacy' }, // Add actual URL
    { name: 'Terms of Service', url: '/terms' }, // Add actual URL
    // { name: 'Cookie Settings', url: '#' }, // Optional
  ];

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement newsletter signup logic
    console.log('Newsletter signup submitted');
    // Add toast notification on success/error
  };

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Newsletter */}
          <div className="relative">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              {' '}
              {/* Adjusted size */}
              F.B Consulting
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {' '}
              {/* Adjusted size */}
              Helping businesses automate operations and scale efficiently with
              AI solutions.
            </p>
            {/* Newsletter Form - Optional */}
            {/*
            <form className="relative" onSubmit={handleNewsletterSubmit}>
              <Label htmlFor="newsletter-email" className="sr-only">Email for newsletter</Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm text-sm" // Adjusted size
                required
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-brand-orange text-white transition-transform hover:scale-105" // Use brand-orange
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            */}
            {/* Decorative blur element - Optional */}
            {/* <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-brand-orange/10 blur-2xl" /> */}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold">Quick Links</h3>{' '}
            {/* Adjusted size */}
            <nav className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  className="block transition-colors hover:text-brand-orange"
                >
                  {' '}
                  {/* Use brand-orange */}
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="mb-4 text-base font-semibold">Contact Me</h3>{' '}
            {/* Adjusted size */}
            <address className="space-y-2 text-sm not-italic text-muted-foreground">
              <p>
                <a
                  href="mailto:hello@farzadbayat.com"
                  className="hover:text-brand-orange transition-colors"
                >
                  {' '}
                  {/* Use brand-orange */}
                  hello@farzadbayat.com
                </a>
              </p>
              {/* <p>Schedule: <Link href="#" className="text-brand-orange hover:underline">Book a call</Link></p> */}{' '}
              {/* Add booking link later */}
            </address>
          </div>

          {/* Column 4: Social Links */}
          <div className="relative">
            <h3 className="mb-4 text-base font-semibold">Follow Me</h3>{' '}
            {/* Adjusted size */}
            <div className="mb-6 flex space-x-3">
              {' '}
              {/* Adjusted spacing */}
              <TooltipProvider>
                {socialLinks.map((link) => (
                  <Tooltip key={link.name}>
                    <TooltipTrigger asChild>
                      {/* Removed asChild from Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border"
                      >
                        {' '}
                        {/* Ensure border */}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.name}
                        >
                          {link.icon}
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-xs text-muted-foreground">
            {' '}
            {/* Adjusted size */}© {new Date().getFullYear()} F.B Consulting.
            All rights reserved.
          </p>
          <nav className="flex gap-4 text-xs">
            {' '}
            {/* Adjusted size */}
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                className="transition-colors hover:text-brand-orange"
              >
                {' '}
                {/* Use brand-orange */}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
