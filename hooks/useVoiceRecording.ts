'use client'

import { useState, useCallback } from 'react'

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)
  const [transcribedText, setTranscribedText] = useState('')
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)
      setAudioChunks([])

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data])
        }
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        setRecordingBlob(audioBlob)
        setIsTranscribing(true)

        try {
          const formData = new FormData()
          formData.append('audio', audioBlob)

          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            throw new Error('Transcription failed')
          }

          const { text } = await response.json()
          setTranscribedText(text)
        } catch (error) {
          console.error('Transcription error:', error)
        } finally {
          setIsTranscribing(false)
        }

        // Clean up the media stream
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }, [audioChunks])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }, [mediaRecorder, isRecording])

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    recordingBlob,
    transcribedText
  }
} 