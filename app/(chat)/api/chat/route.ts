import {
  type UIMessage, // Make type-only
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import type { Session } from 'next-auth'; // Import Session type

export const maxDuration = 60;

// Define a mock session for development when auth is bypassed
const mockSession: Session = {
  user: { id: 'dev-user', name: 'Dev User', email: 'dev@example.com' },
  expires: 'never', // Or a far future date string
};

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    const session = await auth();

    // Bypass authentication for development
    /*
    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }
    */

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      // Use a placeholder user ID or handle appropriately if session is null
      const userId = session?.user?.id ?? 'dev-user';
      await saveChat({ id, userId: userId, title });
    } else {
      // Bypass user ID check for development
      /*
      if (chat.userId !== session.user.id) {
        return new Response('Unauthorized', { status: 401 });
      }
      */
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                  'getWeather',
                  'createDocument',
                  'updateDocument',
                  'requestSuggestions',
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
            // Use real session if available, otherwise use mock session
            createDocument: createDocument({
              session: session ?? mockSession,
              dataStream,
            }),
            updateDocument: updateDocument({
              session: session ?? mockSession,
              dataStream,
            }),
            requestSuggestions: requestSuggestions({
              session: session ?? mockSession,
              dataStream,
            }),
          },
          onFinish: async ({ response }) => {
            // Bypass session check for development
            // if (session.user?.id) {
            try {
              const assistantId = getTrailingMessageId({
                messages: response.messages.filter(
                  (message) => message.role === 'assistant',
                ),
              });

              if (!assistantId) {
                throw new Error('No assistant message found!');
              }

              const [, assistantMessage] = appendResponseMessages({
                messages: [userMessage],
                responseMessages: response.messages,
              });

              await saveMessages({
                messages: [
                  {
                    id: assistantId,
                    chatId: id,
                    role: assistantMessage.role,
                    parts: assistantMessage.parts,
                    attachments:
                      assistantMessage.experimental_attachments ?? [],
                    createdAt: new Date(),
                  },
                ],
              });
            } catch (_) {
              console.error('Failed to save chat', _); // Log the error
            }
            // } // End of commented-out session check
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return 'Oops, an error occurred!';
      },
    });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 404,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  // Bypass auth check for DELETE during development
  /*
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  */

  try {
    const chat = await getChatById({ id });

    // Bypass user ID check for DELETE during development
    /*
    if (!chat || chat.userId !== session?.user?.id) { // Added null check for chat and optional chaining for session
      return new Response('Unauthorized', { status: 401 });
    }
    */
    // Add a check if chat exists before deleting, as the auth bypass might allow deleting non-existent/unowned chats
    if (!chat) {
      return new Response('Chat not found', { status: 404 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
