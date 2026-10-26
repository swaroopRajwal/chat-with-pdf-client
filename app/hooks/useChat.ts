import { streamReply } from "@api/chat";
import { saveChat } from "@lib/chatStorage";
import { readSse } from "@lib/sse";
import type { IChatWithMessage, IMessage } from "@lib/types/chat.type";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface IUseChatParams {
  // Undefined on the new chat view, where the chat is created once the first reply is done
  chat_id?: string;
  file_id: string;
  file_name: string;
  messages: IMessage[];
  // Called once the first reply of a newly created chat has been stored
  onChatCreated?: (chat: IChatWithMessage) => void;
}

export interface IUseChatMsg extends IMessage {
  isStreaming?: boolean;
}

const useChat = ({
  chat_id,
  file_id,
  file_name,
  messages: initMessages,
  onChatCreated,
}: IUseChatParams) => {
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<IUseChatMsg[]>(initMessages);
  const [isLoading, setIsLoading] = useState(false);

  const messagesRef = useRef<IUseChatMsg[]>(initMessages);
  const chatIdRef = useRef(chat_id ?? crypto.randomUUID());
  const isStoredRef = useRef(!!chat_id);
  const abortRef = useRef<AbortController | null>(null);

  // Leaving the page mid-reply stops the stream, and what arrived so far is kept
  useEffect(() => () => abortRef.current?.abort(), []);

  const update = (fn: (prev: IUseChatMsg[]) => IUseChatMsg[]) => {
    messagesRef.current = fn(messagesRef.current);
    setMessages(messagesRef.current);
  };

  // Writes the conversation (without the in-flight reply) to local storage
  const persist = (list: IUseChatMsg[]) => {
    const chat = saveChat({
      chat_id: chatIdRef.current,
      file_id,
      file_name,
      messages: list.map(({ id, role, content }) => ({ id, role, content })),
    });

    if (!chat) {
      toast.error("Couldn't save this chat, your browser storage is full.");
      return null;
    }

    const wasStored = isStoredRef.current;
    isStoredRef.current = true;

    queryClient.setQueryData(["chats", chat.id], chat);
    queryClient.invalidateQueries({ queryKey: ["chats"], exact: true });

    if (!wasStored) onChatCreated?.(chat);

    return chat;
  };

  // Streams the reply to the last (user) message
  const streamLastReply = async () => {
    const assistantId = crypto.randomUUID();
    const history = messagesRef.current;
    const controller = new AbortController();

    abortRef.current = controller;
    setIsLoading(true);
    update((prev) => [
      ...prev,
      { id: assistantId, role: "AI", content: "", isStreaming: true },
    ]);

    let failed = false;

    try {
      const response = await streamReply({
        file_id,
        messages: history,
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        if (typeof body?.message === "string") toast.error(body.message);
        throw new Error(`Server error: ${response.status}`);
      }

      await readSse(response.body, (event, data) => {
        if (event === "error") {
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
      // An abort is not a failure: the partial reply below is stored
      if (!controller.signal.aborted) {
        console.error(err);
        failed = true;
      }
    }

    const reply = messagesRef.current.find((m) => m.id === assistantId);
    // A failed reply is dropped, and Retry asks again
    const dropReply = failed || !reply?.content;

    update((prev) =>
      dropReply
        ? prev.filter((m) => m.id !== assistantId)
        : prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m,
          ),
    );
    setIsLoading(false);

    // Until its first reply is done a new chat isn't stored at all
    if (!dropReply) persist(messagesRef.current);
  };

  const sendMessage = async (msg: string) => {
    const content = msg.trim();
    if (!content || isLoading) return;

    update((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "USER", content },
    ]);

    if (isStoredRef.current) persist(messagesRef.current);

    await streamLastReply();
  };

  const retry = async () => {
    if (isLoading) return;

    if (messagesRef.current.at(-1)?.role !== "USER") return;

    await streamLastReply();
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
