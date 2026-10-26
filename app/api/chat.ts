import type { IMessage } from "@lib/types/chat.type";

// Chats live in the browser (see lib/chatStorage.ts), the server only streams the reply
export const streamReply = async ({
  file_id,
  messages,
  signal,
}: {
  file_id: string;
  messages: Pick<IMessage, "role" | "content">[];
  signal: AbortSignal;
}) =>
  await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id, messages }),
    signal,
  });
