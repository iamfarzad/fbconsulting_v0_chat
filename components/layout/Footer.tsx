'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Linkedin, Github, Mail, Send } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'About Me', url: '/about' },
    { name: 'Blog', url: '/blog' },
    { name: 'Contact', url: '/contact' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', url: '#', icon: <Linkedin className="size-4" /> },
    {
      name: 'Email',
      url: 'mailto:hello@farzadbayat.com',
      icon: <Mail className="size-4" />,
    },
    { name: 'GitHub', url: '#', icon: <Github className="size-4" /> },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Terms of Service', url: '/terms' },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter submission logic here
  };

  return (
    <footer className="border-t bg-background relative">
      <div className="container px-4 py-12 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: About */}
          <div className="relative max-w-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl font-semibold text-gradient">
                F.B Consulting
              </span>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Helping businesses automate operations and scale efficiently with
              AI solutions.
            </p>

            <form className="relative" onSubmit={handleNewsletterSubmit}>
              <Label htmlFor="newsletter-email" className="sr-only">
                Email for newsletter
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="pr-12 glassmorphism-base text-sm"
                required
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 size-8 rounded-full bg-brand-orange text-white transition-transform hover:scale-105"
              >
                <Send className="size-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  className="block transition-colors hover:text-brand-orange"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="mb-4 text-base font-semibold">Contact Me</h3>
            <address className="space-y-2 text-sm not-italic text-muted-foreground">
              <p>
                <a
                  href="mailto:hello@farzadbayat.com"
                  className="transition-colors hover:text-brand-orange"
                >
                  hello@farzadbayat.com
                </a>
              </p>
              <p>Vancouver, BC, Canada</p>
            </address>
          </div>

          {/* Column 4: Social Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold">Follow Me</h3>
            <div className="flex gap-2">
              <TooltipProvider>
                {socialLinks.map((link) => (
                  <Tooltip key={link.name}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-9 rounded-full border-border/40 bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
                      >
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
            © {new Date().getFullYear()} F.B Consulting. All rights reserved.
          </p>
          <nav className="flex gap-4 text-xs">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
