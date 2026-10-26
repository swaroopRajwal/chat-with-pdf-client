import { askChatQuery } from "@api/chat";
import type { IChatWithMessage, IMessage } from "@lib/types/chat.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bubble, BubbleContent } from "@ui/bubble";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@ui/input-group";
import { Message, MessageContent } from "@ui/message";
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@ui/message-scroller";
import { ArrowUpIcon, SendIcon } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import ChatMessage from "./chatMessage";
import useChat from "@app/hooks/useChat";

interface IChatAreaProps {
  chat: IChatWithMessage;
}

const ChatArea: React.FC<IChatAreaProps> = ({ chat }) => {
  const { messages, isLoading, sendMessage } = useChat({
    messages: chat.messages,
    chat: chat,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.ChangeEvent) => {
    e.preventDefault();
    if (!inputRef?.current) return;
    if (!inputRef.current?.value) return;

    const query = inputRef.current.value.trim();

    sendMessage(query);
  };

  return (
    <div className="w-full min-h-0 flex flex-1 flex-col mx-auto max-w-2xl">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Hello!!!</EmptyTitle>
              <EmptyDescription>What can I help with today?</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <MessageScrollerProvider>
          <MessageScroller className="flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="mx-auto flex w-full flex-col gap-6 px-6 py-6">
                {messages.map((msg) => (
                  <MessageScrollerItem
                    key={msg.id}
                    messageId={msg.id}
                    scrollAnchor={msg.role === "USER"}
                  >
                    <ChatMessage message={msg} />
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
      )}
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <InputGroupTextarea
            placeholder="Ask..."
            className="p-3.5"
            ref={inputRef}
            disabled={isLoading}
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton
              className="ml-auto rounded-full"
              disabled={isLoading}
              aria-label="Send"
              type="submit"
              variant="default"
              size="icon-sm"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
};

export default ChatArea;
