'use client'; // Ensure this is the correct directive

import type { Attachment, UIMessage } from 'ai';
import cx from 'classnames';
import type React from 'react';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from 'react';
import { toast } from 'sonner';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';

import { ArrowUpIcon, PaperclipIcon, StopIcon } from './icons';
import { PreviewAttachment } from './preview-attachment';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { SuggestedActions } from './suggested-actions';
import equal from 'fast-deep-equal';
import type { UseChatHelpers } from '@ai-sdk/react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import VoiceOrb from './ui/VoiceOrb'; // Import the new VoiceOrb component

// Define the expected structure from uploadFile based on usage
interface UploadedFileData {
  url: string;
  name: string;
  contentType: string;
}

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string;
  input: UseChatHelpers['input'];
  setInput: UseChatHelpers['setInput'];
  status: UseChatHelpers['status'];
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  append: UseChatHelpers['append'];
  handleSubmit: UseChatHelpers['handleSubmit'];
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  const {
    isRecording,
    isTranscribing,
    transcribedText,
    startRecording,
    stopRecording,
  } = useVoiceRecording();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '98px'; // Consider making this dynamic or smaller default
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    'input',
    '',
  );

  useEffect(() => {
    if (transcribedText && !isTranscribing) {
      setInput(transcribedText);
      adjustHeight();
    }
  }, [transcribedText, isTranscribing, setInput]);

  useEffect(() => {
    if (input) {
      setLocalStorageInput(input);
    } else {
      setLocalStorageInput('');
    }
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    window.history.replaceState({}, '', `/chat/${chatId}`);
    handleSubmit(undefined, { experimental_attachments: attachments });
    setAttachments([]);
    setLocalStorageInput('');
    resetHeight();
    if (width && width > 768) textareaRef.current?.focus();
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId,
  ]);

  // Adjusted uploadFile to return a more specific type or undefined
  const uploadFile = async (
    file: File,
  ): Promise<UploadedFileData | undefined> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        // Ensure returned data conforms to UploadedFileData
        return {
          url: data.url as string,
          name: data.pathname as string, // Assuming pathname is the intended name
          contentType: data.contentType as string,
        };
      }
      const { error } = await response.json();
      toast.error(error || 'File upload failed');
    } catch (error) {
      toast.error('Failed to upload file, please try again!');
    }
    return undefined; // Return undefined on failure
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedResults = await Promise.all(uploadPromises);

        // Filter out undefined results and map to Attachment type
        const successfullyUploadedAttachments: Attachment[] = uploadedResults
          .filter((result): result is UploadedFileData => result !== undefined) // Filter out failures
          .map((result) => ({
            // Explicitly map to Attachment structure
            url: result.url,
            name: result.name, // Ensure name is included
            contentType: result.contentType,
          }));

        // Set attachments with the correctly typed array
        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error('Error processing uploaded files!', error);
        toast.error('Error processing uploaded files.');
      } finally {
        setUploadQueue([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [setAttachments],
  );

  const toggleListening = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setInput('');
      startRecording();
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <SuggestedActions append={append} chatId={chatId} />
        )}

      <input
        type="file"
        aria-label="Upload file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div
          data-testid="attachments-preview"
          className="flex flex-row gap-2 overflow-x-scroll items-end"
        >
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}
          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{ url: '', name: filename, contentType: '' }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      <Textarea
        data-testid="multimodal-input"
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cx(
          'min-h-[50px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl !text-sm',
          'bg-zinc-900 text-zinc-100 placeholder:text-zinc-500',
          'py-3 pl-16 pr-12', // Padding adjusted
          'border border-zinc-700 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-zinc-600 focus-visible:ring-offset-zinc-900',
          className,
        )}
        rows={1}
        autoFocus
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            if (status !== 'ready') {
              toast.error('Please wait for the model to finish its response!');
            } else {
              submitForm();
            }
          }
        }}
        disabled={isRecording || isTranscribing || status === 'submitted'}
      />

      <div className="absolute bottom-3 left-3 flex flex-row items-center gap-2">
        <AttachmentsButton
          fileInputRef={fileInputRef}
          status={status}
          disabled={isRecording || isTranscribing || status === 'submitted'}
        />
        <VoiceOrb
          isRecording={isRecording}
          onClick={toggleListening}
          size={28}
          className={cx('disabled:opacity-50 disabled:cursor-not-allowed')}
          // disabled={status === 'submitted' || isTranscribing} // Pass disabled if needed
        />
      </div>

      <div className="absolute bottom-3 right-3 flex flex-row justify-end">
        {status === 'submitted' ? (
          <StopButton stop={stop} setMessages={setMessages} />
        ) : (
          <SendButton
            input={input}
            submitForm={submitForm}
            uploadQueue={uploadQueue}
            disabled={isRecording || isTranscribing}
          />
        )}
      </div>

      {(isRecording || isTranscribing) && (
        <div className="text-xs text-center text-zinc-500 absolute bottom-[-20px] left-0 right-0">
          {isRecording ? 'Listening...' : 'Transcribing...'}
        </div>
      )}
    </div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.status !== nextProps.status) return false;
    if (!equal(prevProps.attachments, nextProps.attachments)) return false;
    return true;
  },
);

function PureAttachmentsButton({
  fileInputRef,
  status,
  disabled,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  status: UseChatHelpers['status'];
  disabled: boolean;
}) {
  return (
    <Button
      data-testid="attachments-button"
      className="rounded-lg p-2 h-fit text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={(event) => {
        event.preventDefault();
        fileInputRef.current?.click();
      }}
      disabled={disabled}
      variant="ghost"
      size="icon"
    >
      <PaperclipIcon size={14} />
    </Button>
  );
}
const AttachmentsButton = memo(PureAttachmentsButton);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: UseChatHelpers['setMessages'];
}) {
  return (
    <Button
      data-testid="stop-button"
      className="rounded-lg p-2 h-fit bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={(event) => {
        event.preventDefault();
        stop();
        // setMessages((messages) => messages); // Removed redundant call
      }}
      size="icon"
    >
      <StopIcon size={14} />
    </Button>
  );
}
const StopButton = memo(PureStopButton);

// VoiceButton component removed

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
  disabled,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
  disabled: boolean;
}) {
  return (
    <Button
      data-testid="send-button"
      className="rounded-lg p-2 h-fit bg-zinc-700 text-zinc-100 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={disabled || input.trim().length === 0 || uploadQueue.length > 0}
      size="icon"
    >
      <ArrowUpIcon size={14} />
    </Button>
  );
}
const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false;
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.disabled !== nextProps.disabled) return false;
  return true;
});
