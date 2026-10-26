import ChatHeader from "@components/app/chatHeader";
import { getChat } from "@lib/chatStorage";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";
import ChatArea from "./chatArea";

interface IChatPageLayoutProps {
  chat_id: string;
}

// Chats are stored per browser, so an id from another browser lands here
const ChatNotFound = () => {
  useEffect(() => {
    toast.error("Chat not found");
  }, []);

  return <Navigate to="/" replace />;
};

const ChatPageLayout: React.FC<IChatPageLayoutProps> = ({ chat_id }) => {
  const { data: chat, isLoading } = useQuery({
    queryKey: ["chats", chat_id],
    queryFn: () => getChat(chat_id),
  });

  if (isLoading || chat === undefined)
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircleIcon size={40} className="animate-spin" />
      </div>
    );

  if (!chat) return <ChatNotFound />;

  return (
    <>
      <ChatHeader fileName={chat.file_name} />
      <ChatArea
        key={chat.id}
        chat_id={chat.id}
        file_id={chat.file_id}
        file_name={chat.file_name}
        messages={chat.messages}
      />
    </>
  );
};

export default ChatPageLayout;
