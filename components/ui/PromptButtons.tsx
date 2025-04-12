'use client'

import { Button } from './button'
import { cn } from '@/lib/utils'

const prompts = [
  'Tell me about AI automation',
  'How can AI reduce costs?',
  'Workflow optimization tips',
  'AI integration examples'
]

interface PromptButtonsProps {
  onSelect: (prompt: string) => void
}

export default function PromptButtons({ onSelect }: PromptButtonsProps) {
  return (
    <div className="w-full max-w-3xl flex flex-wrap gap-2 justify-center">
      {prompts.map((prompt) => (
        <Button
          key={prompt}
          variant="outline"
          onClick={() => onSelect(prompt)}
          className={cn(
            "text-xs h-7 px-3",
            "bg-background/50 hover:bg-accent/10"
          )}
        >
          {prompt}
        </Button>
      ))}
    </div>
  )
} 