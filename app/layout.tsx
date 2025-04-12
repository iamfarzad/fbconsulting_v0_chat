import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeScript } from '@/components/theme-script';
import { NavBar } from '@/components/layout/Navbar'; // Updated import path
import { Footer } from '@/components/layout/Footer'; // Import Footer
import { SharedChatProvider } from '@/lib/context/chat-context';
import { ExpandableChatWidget } from '@/components/ui/ExpandableChatWidget'; // Import the widget

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.vercel.ai'),
  title: 'FB Consulting - AI Solutions',
  description: 'Expert AI consulting and development services.',
};

export const viewport = {
  maximumScale: 1,
};

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      {/* Removed hardcoded bg-white */}
      <body className="antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ThemeScript />
          <SharedChatProvider>
            <Toaster position="top-center" />
            <div className="relative flex min-h-screen flex-col">
              <NavBar />
              <main className="flex-1 container mx-auto px-4 py-8">
                {children}
              </main>
              {/* Render the chat widget globally */}
              <ExpandableChatWidget />
              <Footer /> {/* Add Footer component */}
            </div>
          </SharedChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
