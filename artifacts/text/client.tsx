import { Artifact } from '@/components/create-artifact';
import { DiffView } from '@/components/diffview';
import { DocumentSkeleton } from '@/components/document-skeleton';
import { Editor } from '@/components/text-editor';
import {
  ClockRewind,
  CopyIcon,
  MessageIcon,
  PenIcon,
  RedoIcon,
  UndoIcon,
} from '@/components/icons';
import type { Suggestion as DBSuggestion } from '@/lib/db/schema'; // Rename imported type
import { toast } from 'sonner';
import { getSuggestions } from '../actions';

// Reverted: Using full Suggestion type from schema
interface TextArtifactMetadata {
  suggestions: Array<DBSuggestion>; // Use renamed type
}

export const textArtifact = new Artifact<'text', TextArtifactMetadata>({
  kind: 'text',
  description: 'Useful for text content, like drafting essays and emails.',
  initialize: async ({ documentId, setMetadata }) => {
    // Explicitly type the result from getSuggestions
    const suggestions: DBSuggestion[] = await getSuggestions({ documentId }); // Use renamed type

    // This should now work if 'suggestions' is correctly typed as DBSuggestion[]
    setMetadata({
      suggestions,
    });
  },
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    // Removed documentId from parameters
    if (streamPart.type === 'suggestion') {
      // Assume streamPart.content contains partial suggestion data
      const partialSuggestion = streamPart.content as Partial<DBSuggestion> & {
        // Use renamed type
        id: string; // Assume id is always present
        suggestedText: string; // Assume suggestedText is always present
        originalText?: string; // Optional
        description?: string; // Optional
      };

      // Validate essential fields from the stream
      if (
        typeof partialSuggestion?.id !== 'string' ||
        typeof partialSuggestion?.suggestedText !== 'string'
      ) {
        console.error(
          'Streamed suggestion is missing essential fields (id, suggestedText):',
          partialSuggestion,
        );
        return; // Skip adding malformed suggestion
      }

      // Construct a full Suggestion object for the metadata array
      // Provide defaults for fields likely missing from the stream.
      // WARNING: These defaults might be incorrect for application logic.
      const fullSuggestion: DBSuggestion = {
        // Use renamed type
        id: partialSuggestion.id,
        suggestedText: partialSuggestion.suggestedText,
        originalText: partialSuggestion.originalText ?? '', // Default if missing
        description: partialSuggestion.description ?? null, // Default if missing
        documentId: 'unknown-doc-id', // Placeholder - documentId is not available here
        documentCreatedAt: new Date(), // Placeholder - Ideally get from context or stream
        isResolved: false, // Default
        userId: 'unknown-user-id', // Placeholder - Ideally get from context or stream
        createdAt: new Date(), // Placeholder
      };

      setMetadata((metadata: TextArtifactMetadata | undefined) => {
        // Explicitly type metadata
        const currentSuggestions = metadata?.suggestions ?? [];
        return {
          suggestions: [
            ...currentSuggestions,
            fullSuggestion, // Add the constructed full Suggestion
          ],
        };
      });
    }

    if (streamPart.type === 'text-delta') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          content: draftArtifact.content + (streamPart.content as string),
          isVisible:
            draftArtifact.status === 'streaming' &&
            draftArtifact.content.length > 400 &&
            draftArtifact.content.length < 450
              ? true
              : draftArtifact.isVisible,
          status: 'streaming',
        };
      });
    }
  },
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    // --- Temporary Mock Data for Rendering Verification ---
    const mockContent = `## Mock Document Title\n\nThis is some **mock text** content for the text artifact renderer.\n\n*   List item 1
*   List item 2\n\n\`\`\`javascript\nconsole.log('Mock code block');\n\`\`\`\n\nEnd of mock content.`;
    // --- End Temporary Mock Data ---

    /* Original Logic - Commented out for testing
    if (isLoading) {
      return <DocumentSkeleton artifactKind="text" />;
    }

    if (mode === 'diff') {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);

      return <DiffView oldContent={oldContent} newContent={newContent} />;
    }
    */

    // Always render Editor with mock content for verification
    return (
      <>
        <div className="flex flex-row py-8 md:p-20 px-4">
          <Editor
            content={mockContent} // Use mock content
            suggestions={metadata ? metadata.suggestions : []}
            isCurrentVersion={isCurrentVersion}
            currentVersionIndex={currentVersionIndex}
            status={status}
            onSaveContent={onSaveContent}
          />

          {metadata?.suggestions && metadata.suggestions.length > 0 ? (
            <div className="md:hidden h-dvh w-12 shrink-0" />
          ) : null}
        </div>
      </>
    );
  },
  actions: [
    {
      icon: <ClockRewind size={18} />,
      description: 'View changes',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('toggle');
      },
      isDisabled: ({ currentVersionIndex, setMetadata }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <UndoIcon size={18} />,
      description: 'View Previous version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('prev');
      },
      isDisabled: ({ currentVersionIndex }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: 'View Next version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('next');
      },
      isDisabled: ({ isCurrentVersion }) => {
        if (isCurrentVersion) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy to clipboard',
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard!');
      },
    },
  ],
  toolbar: [
    {
      icon: <PenIcon />,
      description: 'Add final polish',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content:
            'Please add final polish and check for grammar, add section titles for better structure, and ensure everything reads smoothly.',
        });
      },
    },
    {
      icon: <MessageIcon />,
      description: 'Request suggestions',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content:
            'Please add suggestions you have that could improve the writing.',
        });
      },
    },
  ],
});
