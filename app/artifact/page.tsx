'use client'

import { Chat } from '@/components/chat'
import { VoiceButton } from '@/components/ui/VoiceButton'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function ArtifactPage() {
  const handleSpeechRecognized = (text: string) => {
    console.log('Speech Recognized:', text)
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex justify-end">
          <VoiceButton onSpeechRecognized={handleSpeechRecognized} />
        </div>
        
        <SidebarProvider>
          <div className="rounded-lg border bg-card p-4 shadow-sm h-[70vh] flex flex-col">
            <Chat
              id="artifact-chat"
              initialMessages={[]}
              selectedChatModel="gemini-pro"
              selectedVisibilityType="private"
              isReadonly={false}
            />
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
} 