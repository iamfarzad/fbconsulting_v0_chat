'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect, // Import useEffect
} from 'react';
import { useChat, type UseChatHelpers } from '@ai-sdk/react';
import { nanoid } from 'nanoid'; // Use nanoid for consistent ID generation if needed
import { useVoiceRecording } from '@/hooks/useVoiceRecording'; // Import voice hook
import type { VoiceState } from '@/components/ui/VoiceOrb'; // Use 'import type'

// Define the shape of the context data, extending UseChatHelpers
export interface SharedChatContextType extends UseChatHelpers {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isArtifactVisible: boolean;
  toggleArtifactVisibility: () => void;
  // Widget state
  isWidgetOpen: boolean;
  toggleWidget: (forceState?: boolean) => void; // Allow forcing state
  // Voice state and actions
  voiceState: VoiceState;
  transcribedVoiceText: string | null; // Store the final transcribed text
  startVoiceInput: () => void;
  stopVoiceInput: () => void;
  clearTranscribedText: () => void; // Add function to clear text after use
}

// Create the context with a default value (or null)
const SharedChatContext = createContext<SharedChatContextType | null>(null);

// Define the props for the provider
interface SharedChatProviderProps {
  children: ReactNode;
}

export function SharedChatProvider({ children }: SharedChatProviderProps) {
  // --- Correct placement for all state hooks ---
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isArtifactVisible, setIsArtifactVisible] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  // --- Voice Recording State ---
  const {
    isRecording,
    isTranscribing,
    transcribedText: rawTranscribedText, // Rename to avoid conflict
    startRecording,
    stopRecording,
    // error: voiceError, // Removed - Hook doesn't seem to provide it
  } = useVoiceRecording();

  // State to hold the final transcribed text until consumed
  const [transcribedVoiceText, setTranscribedVoiceText] = useState<
    string | null
  >(null);

  // Effect to update transcribedVoiceText when transcription finishes
  useEffect(() => {
    // Only update if not recording and not transcribing, and there's new text
    if (!isRecording && !isTranscribing && rawTranscribedText) {
      setTranscribedVoiceText(rawTranscribedText);
    }
    // Don't clear rawTranscribedText here, let the hook manage its state
  }, [isRecording, isTranscribing, rawTranscribedText]);

  // Function to clear the transcribed text after it's been used (e.g., put into input)
  const clearTranscribedText = useCallback(() => {
    setTranscribedVoiceText(null);
    // Potentially clear the hook's internal text too if needed/possible
  }, []);

  // Determine VoiceOrb state based on hook state
  const determineVoiceState = (): VoiceState => {
    // if (voiceError) return 'error'; // Removed error check
    if (isRecording) return 'listening';
    if (isTranscribing) return 'thinking';
    return 'idle';
  };
  const currentVoiceState = determineVoiceState();
  // --- End Voice Recording State ---

  // Memoized toggle function for fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    // Optional: Add side effects like adding/removing body classes
    // document.body.classList.toggle('chat-fullscreen', !isFullscreen);
  }, []); // Dependency array is empty as it doesn't depend on external state changing

  // Memoized toggle function for artifact visibility
  const toggleArtifactVisibility = useCallback(() => {
    setIsArtifactVisible((prev) => !prev);
  }, []);

  // Toggle function for the widget, allowing optional force state
  const toggleWidget = useCallback((forceState?: boolean) => {
    setIsWidgetOpen((prev) => (forceState !== undefined ? forceState : !prev));
  }, []);

  // --- Voice Input Actions ---
  const startVoiceInput = useCallback(() => {
    // Ensure widget is open when starting voice input
    toggleWidget(true);
    startRecording();
  }, [startRecording, toggleWidget]);

  const stopVoiceInput = useCallback(() => {
    stopRecording();
  }, [stopRecording]);
  // --- End Voice Input Actions ---

  // Initialize useChat once here
  const chatHelpers = useChat({
    id: 'shared-main-chat', // Use a consistent ID for the shared chat
    generateId: nanoid, // Ensure consistent ID generation
    initialMessages: [
      // Optional: Define shared initial messages if desired
      // { id: nanoid(), role: 'assistant', content: 'Welcome! How can I help?' }
    ],
    // Add other useChat options as needed (e.g., api endpoint, body)
    // api: '/api/chat', // Example API endpoint
    onError: (error) => {
      console.error('Shared chat error:', error);
      // Handle errors globally if needed
    },
  });

  return (
    <SharedChatContext.Provider
      value={{
        ...chatHelpers,
        isFullscreen,
        toggleFullscreen,
        isArtifactVisible,
        toggleArtifactVisibility,
        isWidgetOpen,
        toggleWidget,
        // Voice properties
        voiceState: currentVoiceState,
        transcribedVoiceText,
        startVoiceInput,
        stopVoiceInput,
        clearTranscribedText,
      }}
    >
      {children}
    </SharedChatContext.Provider>
  );
}

// Custom hook to easily consume the context
export function useSharedChat(): SharedChatContextType {
  const context = useContext(SharedChatContext);
  if (!context) {
    throw new Error('useSharedChat must be used within a SharedChatProvider');
  }
  // Type assertion is safe here due to the check above
  return context as SharedChatContextType;
}
