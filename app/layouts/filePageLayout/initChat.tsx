import { initChat } from "@api/chat";
import type { IFile } from "@lib/types/files.type";
import { useMutation } from "@tanstack/react-query";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@ui/input-group";
import { SendIcon } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router";

interface IInitChatProps {
  file: IFile;
}

const InitChat: React.FC<IInitChatProps> = ({ file }) => {
  const navigate = useNavigate();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const mutation = useMutation({
    mutationFn: initChat,
  });

  const handleSubmit = (e: React.ChangeEvent) => {
    console.log("form submitted");
    e.preventDefault();
    if (!inputRef.current) return;
    const query = inputRef.current.value.trim();
    if (!query) return;

    mutation.mutate(
      {
        query: query,
        file_id: file.id,
      },
      {
        onSuccess: ({ data }) => {
          navigate(`/chat/${data.id}`);
        },
      },
    );
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <p>{file.file_name}</p>
      </header>
      <form className="p-4 border-b flex-1" onSubmit={handleSubmit}>
        <InputGroup>
          <InputGroupTextarea
            placeholder="Ask..."
            ref={inputRef}
            disabled={mutation.isPending}
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton
              className="ml-auto"
              disabled={mutation.isPending}
              aria-label="Send"
              type="submit"
            >
              <SendIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {/* This is the init chat component */}
        {/* <h1 className="text-4xl">This is the chat page</h1> */}
        {/* <p>File id - {file.id}</p> */}
        {/* <p>File name - {file.file_name}</p> */}
      </form>
    </>
  );
};

export default InitChat;
