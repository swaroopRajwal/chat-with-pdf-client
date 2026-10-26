import type { IUseChatMsg } from "@app/hooks/useChat";
import { Bubble, BubbleContent } from "@ui/bubble";
import { Message, MessageContent } from "@ui/message";
import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IChatMessageProps {
  message: IUseChatMsg;
}

const ChatMessage: React.FC<IChatMessageProps> = ({ message }) => {
  if (message.role === "USER")
    return (
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>{message.content}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    );

  // if (message?.isStreaming)
  //   return (
  //     <div>
  //       <p>Thinking ... </p>
  //     </div>
  //   );
  //
  return (
    <div className="typeset typeset-docs px-1.5">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {message.content}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMessage;
