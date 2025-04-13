import 'server-only';

import type { User, DBMessage, Chat, Vote } from './schema';
import type { ArtifactKind } from '@/components/artifact';

// Define AND EXPORT Document type based on saveDocument structure
export type Document = {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
};

// Define AND EXPORT Suggestion type (assuming basic structure)
export type Suggestion = {
  id: string; // Assuming an ID
  documentId: string;
  content: string; // Assuming content
  userId: string;
  // Add other fields as needed based on actual structure
};

// Initialize local storage for development without DB
const mockStorage = {
  users: [] as User[],
  chats: [] as Chat[],
  messages: [] as DBMessage[],
  votes: [] as Vote[],
};

// Add warning about missing database
console.warn(
  'Running without database - data will not persist between restarts',
);

export async function getUser(email: string): Promise<User[]> {
  return mockStorage.users.filter((user) => user.email === email);
}

export async function createUser(email: string, password: string) {
  const user = { id: Date.now().toString(), email, password };
  mockStorage.users.push(user);
  return user;
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  const chat = {
    id,
    userId,
    title,
    createdAt: new Date(),
    visibility: 'private' as const,
  };
  mockStorage.chats.push(chat);
  return chat;
}

export async function deleteChatById({ id }: { id: string }) {
  mockStorage.votes = mockStorage.votes.filter((v) => v.chatId !== id);
  mockStorage.messages = mockStorage.messages.filter((m) => m.chatId !== id);
  mockStorage.chats = mockStorage.chats.filter((c) => c.id !== id);
  return true;
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  let chats = mockStorage.chats.filter((chat) => chat.userId === id);

  // Sort by createdAt
  chats = chats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Handle pagination
  if (startingAfter) {
    const startChat = mockStorage.chats.find((c) => c.id === startingAfter);
    if (startChat) {
      chats = chats.filter(
        (c) => c.createdAt.getTime() > startChat.createdAt.getTime(),
      );
    }
  } else if (endingBefore) {
    const endChat = mockStorage.chats.find((c) => c.id === endingBefore);
    if (endChat) {
      chats = chats.filter(
        (c) => c.createdAt.getTime() < endChat.createdAt.getTime(),
      );
    }
  }

  const hasMore = chats.length > limit;
  return {
    chats: hasMore ? chats.slice(0, limit) : chats,
    hasMore,
  };
}

export async function getChatById({ id }: { id: string }) {
  return mockStorage.chats.find((chat) => chat.id === id) || null;
}

export async function saveMessages({
  messages,
}: {
  messages: DBMessage[];
}) {
  mockStorage.messages.push(...messages);
  return messages;
}

export async function getMessagesByChatId({ id }: { id: string }) {
  return mockStorage.messages
    .filter((msg) => msg.chatId === id)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  const existingVoteIndex = mockStorage.votes.findIndex(
    (v) => v.messageId === messageId && v.chatId === chatId,
  );

  if (existingVoteIndex !== -1) {
    mockStorage.votes[existingVoteIndex].isUpvoted = type === 'up';
    return mockStorage.votes[existingVoteIndex];
  }

  const vote = {
    chatId,
    messageId,
    isUpvoted: type === 'up',
  };
  mockStorage.votes.push(vote);
  return vote;
}

export async function getVotesByChatId({ id }: { id: string }) {
  return mockStorage.votes.filter((vote) => vote.chatId === id);
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  // Mock document save
  return { id, title, kind, content, userId };
}

// Ensure explicit return type Promise<Document[]> is present
export async function getDocumentsById({
  id,
}: { id: string }): Promise<Document[]> {
  // Return empty array for documents (mock implementation)
  return [];
}

export async function getDocumentById({ id }: { id: string }) {
  // Return null for document
  return null;
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  // Mock delete
  return true;
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<any>;
}) {
  // Mock save
  return suggestions;
}

// Add explicit return type Promise<Suggestion[]>
export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}): Promise<Suggestion[]> {
  // Return empty array for suggestions (mock implementation)
  return [];
}

export async function getMessageById({ id }: { id: string }) {
  return mockStorage.messages.filter((msg) => msg.id === id);
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  mockStorage.messages = mockStorage.messages.filter(
    (msg) =>
      msg.chatId !== chatId || msg.createdAt.getTime() < timestamp.getTime(),
  );
  return true;
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  const chatIndex = mockStorage.chats.findIndex((c) => c.id === chatId);
  if (chatIndex !== -1) {
    mockStorage.chats[chatIndex].visibility = visibility;
  }
  return true;
}
