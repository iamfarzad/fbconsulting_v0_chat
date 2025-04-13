import React from 'react'; // Ensure React is imported for JSX

/**
 * Generates JSX elements for a simple waveform visualization.
 * @param count - The number of bars to generate.
 * @param isAnimated - Whether the bars should be animated (pulsing).
 * @returns An array of JSX div elements representing the waveform bars.
 */
export const generateWaveformBars = (
  count: number,
  isAnimated: boolean,
): React.ReactElement[] => {
  return Array.from({ length: count }, (_, i) => {
    const uniqueId = `waveform-bar-${Math.random().toString(36).substr(2, 9)}`;
    const height = isAnimated ? 4 + Math.random() * 16 : 4;
    const opacity = isAnimated ? 0.3 + Math.random() * 0.7 : 0.4;

    return (
      <div
        key={uniqueId}
        className={`w-0.5 rounded-full transition-all duration-75 ${
          isAnimated
            ? 'animate-pulse bg-primary'
            : 'bg-neutral-600 dark:bg-neutral-400'
        }`}
        style={{
          height: `${height}px`,
          animationDelay: `${i * 0.08}s`,
          opacity,
        }}
      />
    );
  });
};

// Add other UI utility functions here if needed in the future

export function generateDynamicPattern(isActive: boolean) {
  const basePattern = `
    radial-gradient(circle at center, 
      rgba(254, 90, 29, 0.03) 0%, 
      transparent 70%
    ),
    linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
  `;

  return {
    backgroundImage: basePattern,
    backgroundSize: isActive
      ? '100% 100%, 40px 40px, 40px 40px'
      : '0% 0%, 40px 40px, 40px 40px',
    transition: 'background-size 1s ease-in-out',
  };
}
