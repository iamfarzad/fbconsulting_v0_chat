'use client'; 

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Import cn for combining classes

interface AnimatedWordCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

export default function AnimatedWordCycle({
  words,
  interval = 3000, // Shortened interval for demo
  className = "",
}: AnimatedWordCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState<string | number>("auto"); // Allow number type initially
  const measureRef = useRef<HTMLDivElement>(null);

  // Get the width of the current word
  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      if (elements.length > currentIndex) {
        // Add a small buffer to prevent text wrapping/layout shift
        const newWidth = elements[currentIndex].getBoundingClientRect().width + 10; 
        setWidth(`${newWidth}px`);
      }
    }
  }, [currentIndex, words]); // Rerun if words change

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  // Container animation for the whole word
  const containerVariants = {
    hidden: { 
      y: -20,
      opacity: 0,
      filter: "blur(8px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      transition: { 
        duration: 0.3, 
        ease: "easeIn"
      }
    },
  };

  return (
    <>
      {/* Hidden measurement div with all words rendered */}
      <div 
        ref={measureRef} 
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }} // Ensure it's truly hidden
      >
        {words.map((word, i) => (
          // Use cn to apply base and specific classes
          <span key={i} className={cn("font-bold whitespace-nowrap", className)}>
            {word}
          </span>
        ))}
      </div>

      {/* Visible animated word */}
      <motion.span 
        className="relative inline-block text-left" // Ensure text alignment is correct
        animate={{ 
          width,
          transition: { 
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 1.2,
          }
        }}
        style={{ minWidth: width === 'auto' ? undefined : width }} // Set minWidth to prevent collapse
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
             // Use cn to apply base and specific classes
            className={cn("inline-block font-bold whitespace-nowrap", className)} 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // Removed style={{ whiteSpace: "nowrap" }} - applied via className
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
} 