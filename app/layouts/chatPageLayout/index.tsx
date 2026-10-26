import { getSingleChat } from "@api/chat";
import ChatHeader from "@components/app/chatHeader";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import ChatArea from "./chatArea";

interface IChatPageLayoutProps {
  chat_id: string;
}

const ChatPageLayout: React.FC<IChatPageLayoutProps> = ({ chat_id }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chats", chat_id],
    queryFn: () => getSingleChat({ chat_id }),
  });

  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircleIcon size={40} className="animate-spin" />
      </div>
    );

  if (!data?.data)
    return (
      <div className="flex flex-1 items-center justify-center">
        Chat not found
      </div>
    );

  const chat = data.data;

  return (
    <>
      <ChatHeader fileName={chat.file.file_name} />
      <ChatArea
        key={chat.id}
        chat_id={chat.id}
        file={chat.file}
        messages={chat.messages}
      />
    </>
  );
};

export default ChatPageLayout;
