'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, Square } from 'lucide-react'

interface VoiceButtonProps {
  onSpeechRecognized: (text: string) => void
}

type VoiceState = 'idle' | 'requesting' | 'recording' | 'processing' | 'error'

export function VoiceButton({ onSpeechRecognized }: VoiceButtonProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const setupSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Try Chrome.')
      setVoiceState('error')
      return null
    }

    const instance = new SpeechRecognition()
    instance.continuous = false
    instance.interimResults = false
    instance.lang = 'en-US'

    instance.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
      onSpeechRecognized(transcript.trim())
      setVoiceState('idle')
    }

    instance.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setError(`Speech recognition error: ${event.error}`)
      setVoiceState('error')
    }

    instance.onend = () => {
      if (voiceState === 'recording') {
        setVoiceState('idle')
      }
    }

    return instance
  }, [onSpeechRecognized, voiceState])

  const startRecording = useCallback(async () => {
    setError(null)
    setVoiceState('requesting')

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const recognition = setupSpeechRecognition()
      if (!recognition) return

      recognitionRef.current = recognition
      recognition.start()
      setVoiceState('recording')
    } catch (err) {
      console.error('Error accessing microphone:', err)
      setError('Microphone access denied or unavailable.')
      setVoiceState('error')
    }
  }, [setupSpeechRecognition])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && voiceState === 'recording') {
      recognitionRef.current.stop()
    }
  }, [voiceState])

  const handleClick = () => {
    if (voiceState === 'recording') {
      stopRecording()
    } else if (voiceState === 'idle' || voiceState === 'error') {
      startRecording()
    }
  }

  let buttonContent = <Mic className="h-5 w-5" />
  let buttonVariant: 'default' | 'destructive' | 'outline' = 'default'
  
  if (voiceState === 'recording') {
    buttonContent = <Square className="h-5 w-5 text-red-500" />
  } else if (voiceState === 'requesting' || voiceState === 'processing') {
    buttonContent = <span>...</span>
  } else if (voiceState === 'error') {
    buttonVariant = 'destructive'
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleClick}
        variant={buttonVariant}
        size="icon"
        disabled={voiceState === 'requesting' || voiceState === 'processing'}
      >
        {buttonContent}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
} 