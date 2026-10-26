import type { IChat, IMessage } from "@lib/types/chat.type";
import { useCallback, useState } from "react";

interface IUseChatParams {
  messages: IMessage[];
  chat: IChat;
}

export interface IUseChatMsg extends IMessage {
  isStreaming?: boolean;
}

const useChat = ({ messages: initMessages, chat }: IUseChatParams) => {
  const [messages, setMessages] = useState<IUseChatMsg[]>(initMessages);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (msg: string) => {
    const userMessage: IMessage = {
      id: crypto.randomUUID(),
      role: "USER",
      chat_id: chat.id,
      content: msg,
      order: messages.length + 1,
    };
    const assistantMessage: IUseChatMsg = {
      id: crypto.randomUUID(),
      role: "AI",
      chat_id: chat.id,
      content: "",
      order: messages.length + 1,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/chats/${chat.id}/ask`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            all_messages: initMessages,
            message: userMessage,
          }),
        },
      );

      if (!response.ok || !response.body)
        throw new Error(`Server error: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const data = part.slice(6);
          if (data === "[DONE]") continue;
          const text = data.replace(/\\n/g, "\n").replace(/\\\\/g, "\\");

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: m.content + text }
                : m,
            ),
          );
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content: "[Error: something went wrong]",
                isStreaming: false,
              }
            : m,
        ),
      );
    } finally {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id ? { ...m, isStreaming: false } : m,
        ),
      );
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendMessage };
};

export default useChat;
