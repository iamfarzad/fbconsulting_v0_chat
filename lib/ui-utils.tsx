import React from 'react'; // Ensure React is imported for JSX

/**
 * Generates JSX elements for a simple waveform visualization.
 * @param count - The number of bars to generate.
 * @param isAnimated - Whether the bars should be animated (pulsing).
 * @returns An array of JSX div elements representing the waveform bars.
 */
export const generateWaveformBars = (count: number, isAnimated: boolean): React.ReactElement[] => { // Return ReactElement[]
  return [...Array(count)].map((_, i) => {
    // Define style object inside the map function
    const style: React.CSSProperties = {
      height: isAnimated ? `${4 + Math.random() * 16}px` : '4px', // Adjusted height range
      animationDelay: `${i * 0.08}s`, // Slightly faster delay
      opacity: isAnimated ? 0.3 + Math.random() * 0.7 : 0.4, // Adjusted opacity
    };

    // Return a valid JSX element
    return (
      <div
        key={i}
        className={`w-0.5 rounded-full transition-all duration-75 ${
          isAnimated ? 'animate-pulse bg-primary' : 'bg-neutral-600 dark:bg-neutral-400' // Use theme colors
        }`}
        style={style} // Apply the style object
      />
    );
  });
};

// Add other UI utility functions here if needed in the future