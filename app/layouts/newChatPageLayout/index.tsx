import { getSingleFile } from "@api/files";
import ChatHeader from "@components/app/chatHeader";
import ChatArea from "@layouts/chatPageLayout/chatArea";
import type { IChatWithMessage, IMessage } from "@lib/types/chat.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { Navigate, useNavigate } from "react-router";

interface INewChatPageLayoutProps {
  file_id: string;
}

const NewChatPageLayout: React.FC<INewChatPageLayoutProps> = ({ file_id }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["files", file_id],
    queryFn: () => getSingleFile({ id: file_id }),
  });

  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircleIcon size={40} className="animate-spin" />
      </div>
    );

  if (isError || !data?.data) return <Navigate to="/" replace />;

  const file = data.data;

  // The first reply is done: hand the chat over to its own page without a loader
  const handleChatCreated = (chat_id: string, messages: IMessage[]) => {
    const chat: IChatWithMessage = {
      id: chat_id,
      file_id: file.id,
      client_id: "",
      title: messages[0]?.content ?? "",
      created_at: new Date(),
      file,
      messages,
    };

    queryClient.setQueryData(["chats", chat_id], { status: true, data: chat });
    queryClient.invalidateQueries({ queryKey: ["chats"], exact: true });
    navigate(`/chat/${chat_id}`, { replace: true });
  };

  return (
    <>
      <ChatHeader fileName={file.file_name} />
      <ChatArea
        key={file.id}
        file={file}
        messages={[]}
        onChatCreated={handleChatCreated}
      />
    </>
  );
};

export default NewChatPageLayout;
