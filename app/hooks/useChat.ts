import { readSse } from "@lib/sse";
import type { IMessage } from "@lib/types/chat.type";
import { useRef, useState } from "react";

interface IUseChatParams {
  // Undefined on the new chat view, where the first send creates the chat
  chat_id?: string;
  file_id: string;
  messages: IMessage[];
  // Called once the first reply of a newly created chat has finished (or failed)
  onChatCreated?: (chat_id: string, messages: IMessage[]) => void;
}

export interface IUseChatMsg extends IMessage {
  isStreaming?: boolean;
}

const useChat = ({
  chat_id,
  file_id,
  messages: initMessages,
  onChatCreated,
}: IUseChatParams) => {
  const [messages, setMessages] = useState<IUseChatMsg[]>(initMessages);
  const [isLoading, setIsLoading] = useState(false);

  const messagesRef = useRef<IUseChatMsg[]>(initMessages);
  const chatIdRef = useRef(chat_id);

  const update = (fn: (prev: IUseChatMsg[]) => IUseChatMsg[]) => {
    messagesRef.current = fn(messagesRef.current);
    setMessages(messagesRef.current);
  };

  // Streams the reply to the last (user) message. `content` is only sent when
  // the user message isn't saved yet: the chat doesn't exist, or it's a new one.
  const streamReply = async (content?: string) => {
    const assistantId = crypto.randomUUID();
    const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
    const isNewChat = !chatIdRef.current;

    setIsLoading(true);
    update((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "AI",
        chat_id: chatIdRef.current ?? "",
        content: "",
        order: prev.length + 1,
        isStreaming: true,
      },
    ]);

    let failed = false;

    try {
      const response = await fetch(
        isNewChat
          ? `${baseUrl}/chats/init`
          : `${baseUrl}/chats/${chatIdRef.current}/ask`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isNewChat ? { query: content, file_id } : { content },
          ),
        },
      );

      if (!response.ok || !response.body)
        throw new Error(`Server error: ${response.status}`);

      await readSse(response.body, (event, data) => {
        if (event === "chat") {
          chatIdRef.current = data;
        } else if (event === "error") {
          failed = true;
        } else if (data !== "[DONE]") {
          update((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + data } : m,
            ),
          );
        }
      });
    } catch (err) {
      console.error(err);
      failed = true;
    }

    // A failed reply is dropped: the server saves nothing, and Retry asks again
    update((prev) =>
      failed
        ? prev.filter((m) => m.id !== assistantId)
        : prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m,
          ),
    );
    setIsLoading(false);

    if (isNewChat && chatIdRef.current) {
      const createdId = chatIdRef.current;
      onChatCreated?.(
        createdId,
        messagesRef.current.map((m) => ({
          id: m.id,
          chat_id: createdId,
          role: m.role,
          content: m.content,
          order: m.order,
        })),
      );
    }
  };

  const sendMessage = async (msg: string) => {
    const content = msg.trim();
    if (!content || isLoading) return;

    update((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "USER",
        chat_id: chatIdRef.current ?? "",
        content,
        order: prev.length + 1,
      },
    ]);

    await streamReply(content);
  };

  const retry = async () => {
    if (isLoading) return;

    const last = messagesRef.current.at(-1);
    if (last?.role !== "USER") return;

    // The user message is already saved unless the chat was never created
    await streamReply(chatIdRef.current ? undefined : last.content);
  };

  // The last user message has no reply: the stream failed here or earlier
  const needsRetry = !isLoading && messages.at(-1)?.role === "USER";

  return {
    messages,
    isLoading,
    needsRetry,
    sendMessage,
    retry,
  };
};

export default useChat;
