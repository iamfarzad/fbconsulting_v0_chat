// Corrected import from ./message
import { ChatMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import type { Vote } from '@/lib/db/schema'; // Use type import
import type { UIMessage } from 'ai'; // Use type import
import { memo } from 'react';
import equal from 'fast-deep-equal';
import type { UIArtifact } from './artifact'; // Use type import
import type { UseChatHelpers } from '@ai-sdk/react'; // Use type import

interface ArtifactMessagesProps {
  chatId: string;
  status: UseChatHelpers['status'];
  votes: Array<Vote> | undefined;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
  artifactStatus: UIArtifact['status'];
}

function PureArtifactMessages({
  // Props not used by ChatMessage are removed from destructuring here
  // chatId,
  // status,
  // votes,
  messages,
}: // setMessages,
// reload,
// isReadonly,
ArtifactMessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col gap-6 h-full items-center overflow-y-scroll px-6 pt-20"
    >
      {messages.map((message, index) => (
        <div
          key={message.id}
          className="w-full animate-subtle-bounce"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ChatMessage message={message} />
        </div>
      ))}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px] bg-gradient-to-t from-white/5 to-transparent w-full"
      />
    </div>
  );
}

// Keep areEqual function as is, it compares props for memoization
function areEqual(
  prevProps: ArtifactMessagesProps,
  nextProps: ArtifactMessagesProps,
) {
  if (
    prevProps.artifactStatus === 'streaming' &&
    nextProps.artifactStatus === 'streaming'
  )
    return true;

  if (prevProps.status !== nextProps.status) return false;
  // This line seems incorrect, comparing status twice? Keeping as is for now.
  // if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
}

export const ArtifactMessages = memo(PureArtifactMessages, areEqual);
