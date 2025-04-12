import React from 'react';

interface HeroVoiceInputProps {
  isListening: boolean;
  toggleListening: () => void;
  isVoiceSupported: boolean;
  isTranscribing?: boolean;
  chatInputValue?: string;
  onInputChange?: (value: string) => void;
  useGeminiApi?: boolean;
  transcript?: string;
}

export const HeroVoiceInput: React.FC<HeroVoiceInputProps> = ({
  isListening,
  toggleListening,
  isVoiceSupported,
  isTranscribing = false,
  chatInputValue = "",
  onInputChange,
  useGeminiApi: _useGeminiApi = false, // Prefix unused prop
  transcript = ""
}) => {
  if (!isVoiceSupported) return null;
  
  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full transition-colors ${
          isListening ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </button>
      
      {isTranscribing && (
        <div className="absolute top-full mt-2 right-0 bg-white p-2 rounded shadow-lg text-sm">
          Transcribing...
        </div>
      )}
      
      {transcript && (
        <div className="absolute top-full mt-2 right-0 bg-white p-2 rounded shadow-lg text-sm max-w-xs truncate">
          {transcript}
        </div>
      )}
      
      {chatInputValue && onInputChange && (
        <div className="absolute top-full mt-2 right-0 bg-white p-2 rounded shadow-lg text-sm max-w-xs truncate">
          {chatInputValue}
        </div>
      )}
    </div>
  );
};
