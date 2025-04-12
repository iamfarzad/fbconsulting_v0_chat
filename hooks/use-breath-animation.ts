'use client'

import { useState, useEffect } from 'react'

interface UseBreathAnimationProps {
  isActive?: boolean
  minScale?: number
  maxScale?: number
  duration?: number
}

export function useBreathAnimation({
  isActive = false,
  minScale = 0.8,
  maxScale = 1.2,
  duration = 2000
}: UseBreathAnimationProps = {}) {
  const [breathScale, setBreathScale] = useState(1)

  useEffect(() => {
    if (!isActive) {
      setBreathScale(1)
      return
    }

    let startTime: number
    let animationFrameId: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime

      // Calculate progress through the breath cycle (0 to 1)
      const progress = (elapsed % duration) / duration
      
      // Use sine wave for smooth breathing effect
      const scale = minScale + (maxScale - minScale) * 
        (Math.sin(progress * Math.PI * 2) + 1) / 2

      setBreathScale(scale)
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isActive, minScale, maxScale, duration])

  return { breathScale }
} 