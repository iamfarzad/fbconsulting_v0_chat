'use client';

// Removed direct useChat import
import { ChatList } from '@/components/chat-list';
import { ChatPanel } from '@/components/chat-panel';
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor';
import { useSharedChat } from '@/lib/context/chat-context'; // Import shared context hook
// Removed useToast import as error handling is likely in the context provider

export function Chat() {
  // Get chat state and functions from the shared context
  const { messages, append, reload, stop, isLoading } = useSharedChat();
  // Removed toast initialization

  return (
    // Use theme background color
    <div className="rounded-lg border bg-background">
      {/* Keep padding p-4 (16px) as it fits 8pt grid */}
      <div className="h-[60vh] overflow-y-auto p-4 ai-custom-scrollbar">
        {' '}
        {/* Added custom scrollbar */}
        <ChatList messages={messages} />
        <ChatScrollAnchor trackVisibility={isLoading} />
      </div>
      {/* Use theme background color */}
      <div className="border-t bg-background p-4">
        <ChatPanel
          isLoading={isLoading}
          append={append}
          reload={reload}
          stop={stop}
          messages={messages}
        />
      </div>
    </div>
  );
}
