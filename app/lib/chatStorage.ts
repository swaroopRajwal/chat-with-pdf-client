import type { IChat, IChatWithMessage, IMessage } from "@lib/types/chat.type";

// Bump the version when the stored shape changes, so old data is ignored
export const CHATS_STORAGE_KEY = "cwp:v1";

const TITLE_MAX_LENGTH = 60;

interface IStoredData {
  chats: IChatWithMessage[];
}

export const makeChatTitle = (text: string) => {
  const title = text.split(/\s+/).filter(Boolean).join(" ");

  if (!title) return "Untitled chat";

  return title.length > TITLE_MAX_LENGTH
    ? title.slice(0, TITLE_MAX_LENGTH).trimEnd() + "…"
    : title;
};

// Storage can be missing, blocked or full (SSR, private mode), so every access is guarded
const read = (): IStoredData => {
  try {
    const raw = localStorage.getItem(CHATS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (parsed && Array.isArray(parsed.chats)) return parsed;
  } catch (err) {
    console.error(err);
  }

  return { chats: [] };
};

const write = (data: IStoredData) => {
  try {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getAllChats = (): IChat[] =>
  read()
    .chats.map(({ messages: _messages, ...chat }) => chat)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

export const getChat = (chat_id: string) =>
  read().chats.find((chat) => chat.id === chat_id) ?? null;

interface ISaveChatParams {
  chat_id: string;
  file_id: string;
  file_name: string;
  messages: IMessage[];
}

// Creates the chat, or replaces the messages of an existing one. Returns null when
// the browser refuses to store it.
export const saveChat = ({
  chat_id,
  file_id,
  file_name,
  messages,
}: ISaveChatParams): IChatWithMessage | null => {
  const data = read();
  const now = new Date().toISOString();
  const existing = data.chats.find((chat) => chat.id === chat_id);

  const chat: IChatWithMessage = {
    id: chat_id,
    file_id,
    file_name,
    title: existing?.title ?? makeChatTitle(messages[0]?.content ?? ""),
    created_at: existing?.created_at ?? now,
    updated_at: now,
    messages,
  };

  data.chats = [chat, ...data.chats.filter((c) => c.id !== chat_id)];

  return write(data) ? chat : null;
};
