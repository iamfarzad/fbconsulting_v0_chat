'use client';

import React, { useEffect, useState, forwardRef } from 'react'; // Import forwardRef directly
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Menu,
  Moon,
  Sun,
  Book,
  Trees,
  Sunset,
  Zap,
  Search as SearchIcon,
} from 'lucide-react'; // Added SearchIcon
import { SearchDialog } from '@/components/ui/search/SearchDialog';

// --- Data from ShadcnblocksNavbarDemo ---
const logoData = {
  url: '/',
  alt: 'F.B Consulting',
  title: 'F.B Consulting',
};

const menuData = [
  {
    title: 'Services',
    url: '/services',
    items: [
      {
        title: 'AI Strategy',
        description: 'Custom roadmaps for your business',
        icon: <Book className="size-4" />,
        url: '/services#ai-strategy',
      },
      {
        title: 'Chatbots & Virtual Assistants',
        description: '24/7 customer support automation',
        icon: <Trees className="size-4" />,
        url: '/services#chatbots',
      },
      {
        title: 'Workflow Automation',
        description: 'Streamline your business processes',
        icon: <Sunset className="size-4" />,
        url: '/services#workflow',
      },
      {
        title: 'AI Data Insights',
        description: 'Transform your raw business data into intelligence',
        icon: <Zap className="size-4" />,
        url: '/services#data-insights',
      },
    ],
  },
  {
    title: 'About',
    url: '/about',
    items: [
      {
        title: 'My Story',
        description: 'Learn about my mission and expertise',
        icon: <Trees className="size-4" />,
        url: '/about',
      },
      {
        title: 'Testimonials',
        description: 'What our clients say about our services',
        icon: <Sunset className="size-4" />,
        url: '/about#testimonials',
      },
      {
        title: 'FAQ',
        description: 'Answers to common questions',
        icon: <Zap className="size-4" />,
        url: '/about#faq',
      },
    ],
  },
  {
    title: 'Resources',
    url: '/resources',
    items: [
      {
        title: 'Blog',
        description: 'Expert insights and case studies',
        icon: <Book className="size-4" />,
        url: '/blog',
      },
      {
        title: 'Pricing',
        description: 'Transparent pricing plans for every need',
        icon: <Zap className="size-4" />,
        url: '/services#pricing',
      },
    ],
  },
];

const mobileExtraLinksData = [
  { name: 'Privacy', url: '/privacy' },
  { name: 'Terms', url: '/terms' },
];

const ctaButtonData = {
  text: 'Contact Us',
  url: '/contact',
};
// --- End Data ---

// ListItem component for NavigationMenu
const ListItem = forwardRef<
  // Use forwardRef directly
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

// Main NavBar Component
export function NavBar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        'sticky top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b',
        scrolled
          ? 'glassmorphism-base shadow-sm'
          : 'bg-transparent border-transparent',
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* --- Desktop Navbar --- */}
        <nav className="hidden lg:flex flex-1 items-center justify-between">
          {/* Left Section: Logo + Menu */}
          <div className="flex items-center gap-6">
            <Link href={logoData.url} className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gradient">
                {logoData.title}
              </span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                {menuData.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.items ? (
                      <>
                        <NavigationMenuTrigger>
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.items.map((component) => (
                              <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.url}
                                icon={component.icon}
                              >
                                {component.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={item.url} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {/* Right Section: Search, Dark Mode, CTA */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">Search</span>
              <SearchIcon className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Sun className="size-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white ml-2"
            >
              <Link href={ctaButtonData.url}>{ctaButtonData.text}</Link>
            </Button>
          </div>
        </nav>

        {/* --- Mobile Navbar --- */}
        <div className="flex lg:hidden flex-1 items-center justify-between">
          {/* Left: Logo */}
          <Link href={logoData.url} className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gradient">
              {logoData.title}
            </span>
          </Link>
          {/* Right: Theme Toggle, Hamburger */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Sun className="size-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <SheetHeader className="mb-4">
                  <SheetTitle>
                    <Link
                      href={logoData.url}
                      className="flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg font-semibold text-gradient">
                        {logoData.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6">
                  <Accordion type="multiple" className="w-full">
                    {menuData.map((item) => (
                      <AccordionItem
                        value={item.title}
                        key={item.title}
                        className="border-b-0"
                      >
                        {item.items ? (
                          <>
                            <AccordionTrigger className="py-2 text-sm capitalize hover:no-underline">
                              {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="mt-1 pl-4">
                              <ul className="flex flex-col gap-1">
                                {item.items.map((subItem) => (
                                  <li key={subItem.title}>
                                    <Link
                                      href={subItem.url}
                                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      <div className="flex items-center gap-2">
                                        {subItem.icon && (
                                          <span className="text-muted-foreground">
                                            {subItem.icon}
                                          </span>
                                        )}
                                        <div className="text-sm font-medium leading-none">
                                          {subItem.title}
                                        </div>
                                      </div>
                                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                        {subItem.description}
                                      </p>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </>
                        ) : (
                          <Link
                            href={item.url}
                            className="flex w-full items-center py-2 text-sm font-medium hover:underline"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        )}
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <div className="border-t pt-4">
                    <div className="flex flex-col gap-2">
                      {mobileExtraLinksData.map((link) => (
                        <Link
                          key={link.name}
                          href={link.url}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      asChild
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                    >
                      <Link
                        href={ctaButtonData.url}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {ctaButtonData.text}
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
