'use client'

import { useState } from 'react'

export function useDynamicIsland() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [response, setResponse] = useState<any>(null)

  const expand = () => setIsExpanded(true)
  const collapse = () => setIsExpanded(false)
  const updateTranscription = (text: string) => setTranscription(text)
  const updateResponse = (res: any) => setResponse(res)

  return {
    isExpanded,
    transcription,
    response,
    expand,
    collapse,
    updateTranscription,
    updateResponse
  }
} 