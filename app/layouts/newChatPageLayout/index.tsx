import { getSingleFile } from "@api/files";
import ChatHeader from "@components/app/chatHeader";
import ChatArea from "@layouts/chatPageLayout/chatArea";
import type { IChatWithMessage } from "@lib/types/chat.type";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { Navigate, useNavigate } from "react-router";

interface INewChatPageLayoutProps {
  file_id: string;
}

const NewChatPageLayout: React.FC<INewChatPageLayoutProps> = ({ file_id }) => {
  const navigate = useNavigate();

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

  // The first reply is done and stored: hand the chat over to its own page
  const handleChatCreated = (chat: IChatWithMessage) => {
    navigate(`/chat/${chat.id}`, { replace: true });
  };

  return (
    <>
      <ChatHeader fileName={file.file_name} />
      <ChatArea
        key={file.id}
        file_id={file.id}
        file_name={file.file_name}
        messages={[]}
        onChatCreated={handleChatCreated}
      />
    </>
  );
};

export default NewChatPageLayout;
