import type { IFile } from "@lib/types/files.type";
import type { IMessage } from "@lib/types/chat.type";
import ChatComposer from "@components/app/chatComposer";
import { Button } from "@ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@ui/empty";
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@ui/message-scroller";
import { RotateCcwIcon } from "lucide-react";
import ChatMessage from "./chatMessage";
import useChat from "@app/hooks/useChat";

interface IChatAreaProps {
  // Undefined on the new chat view
  chat_id?: string;
  file: IFile;
  messages: IMessage[];
  onChatCreated?: (chat_id: string, messages: IMessage[]) => void;
}

const ChatArea: React.FC<IChatAreaProps> = ({
  chat_id,
  file,
  messages: initMessages,
  onChatCreated,
}) => {
  const { messages, isLoading, needsRetry, sendMessage, retry } = useChat({
    chat_id,
    file_id: file.id,
    messages: initMessages,
    onChatCreated,
  });

  return (
    <div className="w-full min-h-0 flex flex-1 flex-col mx-auto max-w-2xl">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{file.file_name}</EmptyTitle>
              <EmptyDescription>
                Ask anything about this PDF. Answers come only from its content.
              </EmptyDescription>
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
                {needsRetry && (
                  <div className="flex items-center gap-3 px-1.5 text-sm text-muted-foreground">
                    <span>Couldn't get a reply.</span>
                    <Button variant="outline" size="sm" onClick={retry}>
                      <RotateCcwIcon data-icon="inline-start" />
                      Retry
                    </Button>
                  </div>
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
      )}
      <ChatComposer onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatArea;
