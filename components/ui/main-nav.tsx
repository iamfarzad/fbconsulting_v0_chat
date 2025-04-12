'use client';

import Link from 'next/link';
import { Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { Logo3D } from '@/components/ui/logo-3d';

export function MainNav() {
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo - Left */}
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <Logo3D className="h-10 w-10" />
            <span className="font-bold">FB Consulting</span>
          </Link>
        </div>

        {/* Navigation - Center */}
        <div className="flex flex-1 items-center justify-center">
          <nav className="flex items-center">
            <NavBar items={navItems} />
          </nav>
        </div>

        {/* Actions - Right */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => {}}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
