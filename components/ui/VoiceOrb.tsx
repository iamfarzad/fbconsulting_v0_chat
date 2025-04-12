'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VoiceOrbProps {
  isRecording: boolean;
  onClick: () => void;
  size?: number; // Optional size prop, defaults to button size
  className?: string; // Allow passing additional classes
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isRecording,
  onClick,
  size = 40, // Default size (e.g., 40px)
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on size prop
    canvas.width = size;
    canvas.height = size;

    if (!isRecording) {
      // Clear animation frame if stopped recording
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // Optionally draw a static state when not recording
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Example static orb:
      // const cx = canvas.width / 2;
      // const cy = canvas.height / 2;
      // ctx.beginPath();
      // ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2);
      // ctx.fillStyle = 'rgba(255, 120, 70, 0.5)'; // Muted color
      // ctx.fill();
      return; // Stop effect if not recording
    }

    // Animation logic adapted for component size
    const animate = () => {
      const time = Date.now() / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseRadius = size * 0.25; // Base radius relative to size
      const pulse = 6 * Math.sin(time * 5); // Slightly stronger and faster pulse

      // Inner pulsating gradient orb
      const gradient = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        baseRadius + 10,
      ); // Adjusted gradient size
      // Adjusted gradient colors for potentially more vibrancy
      gradient.addColorStop(0, 'rgba(255, 150, 120, 1)'); // Lighter orange start
      gradient.addColorStop(0.5, 'rgba(255, 100, 50, 0.8)'); // More intense middle
      gradient.addColorStop(1, 'rgba(200, 70, 20, 0.05)'); // Darker, subtler end

      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, baseRadius + pulse), 0, Math.PI * 2); // Ensure radius isn't negative
      ctx.fillStyle = gradient;
      ctx.fill();

      // Outer rings (simplified for smaller size)
      for (let i = 1; i <= 2; i++) {
        const r =
          baseRadius + 10 + i * (size * 0.1) + 3 * Math.sin(time * 2 + i);
        const alpha = 0.35 - i * 0.1; // Slightly more visible outer rings
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(0, r), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,130,80,${alpha})`; // Adjusted ring color
        ctx.lineWidth = 1; // Thinner lines for smaller orb
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation only if recording
    if (isRecording) {
      animationRef.current = requestAnimationFrame(animate);
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRecording, size]); // Rerun effect if isRecording or size changes

  // Render a button containing the canvas
  return (
    <button
      ref={containerRef}
      type="button" // Explicitly set button type
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
        className, // Allow external classes
      )}
      style={{ width: size, height: size }}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0" // Canvas fills the button
      />
      {/* Optional: Add an icon overlay if needed when not recording */}
      {/* {!isRecording && <Mic size={size * 0.4} className="relative z-10 text-gray-600" />} */}
    </button>
  );
};

export default VoiceOrb;
