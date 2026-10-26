import { getAllChats, getSingleChat } from "@api/chat";
import FullScreenLoader from "@components/app/fullScreenLoader";
import { useQuery } from "@tanstack/react-query";
import Chats from "./chats";

interface IChatPageLayoutProps {
  chat_id: string;
}

const ChatPageLayout: React.FC<IChatPageLayoutProps> = ({ chat_id }) => {
  const { data: activeChat, isLoading: isActiveChatLoading } = useQuery({
    queryKey: ["chats", chat_id],
    queryFn: () => getSingleChat({ chat_id }),
  });

  const { data: allChats, isLoading: isAllChatsLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getAllChats,
  });

  if (isAllChatsLoading || isActiveChatLoading) return <FullScreenLoader />;

  if (!activeChat?.data) return <>Chat not found</>;

  return <Chats activeChat={activeChat.data} allChats={allChats?.data || []} />;
};

export default ChatPageLayout;
