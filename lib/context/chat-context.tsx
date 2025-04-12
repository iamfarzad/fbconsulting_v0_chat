'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useChat, type UseChatHelpers } from '@ai-sdk/react';
import { nanoid } from 'nanoid'; // Use nanoid for consistent ID generation if needed

// Define the shape of the context data, extending UseChatHelpers
export interface SharedChatContextType extends UseChatHelpers {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isArtifactVisible: boolean;
  toggleArtifactVisibility: () => void;
  // Manage widget state within the context
  isWidgetOpen: boolean;
  toggleWidget: () => void; // Use a toggle function
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
  const [isWidgetOpen, setIsWidgetOpen] = useState(false); // Correct placement

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

  // Toggle function for the widget - correctly uses setIsWidgetOpen from scope
  const toggleWidget = useCallback(() => {
    setIsWidgetOpen((prev) => !prev);
  }, []); // Dependency array is empty

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
        isWidgetOpen, // Correctly provided from state
        toggleWidget, // Correctly provided
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
