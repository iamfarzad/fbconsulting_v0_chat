'use client'

import { useEffect } from 'react'

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)'; // Match layout.tsx
const DARK_THEME_COLOR = 'hsl(240 10% 3.9%)'; // Match layout.tsx

export function ThemeScript() {
  useEffect(() => {
    const html = document.documentElement;
    let meta = document.querySelector('meta[name="theme-color"]');
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }

    function updateThemeColor() {
      if (!meta) return; // Guard clause
      const isDark = html.classList.contains('dark');
      meta.setAttribute('content', isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
    }

    const observer = new MutationObserver(updateThemeColor);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    
    updateThemeColor(); // Initial call

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return null; // This component doesn't render anything itself
} 