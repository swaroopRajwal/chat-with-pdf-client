import { useSocket } from "@app/hooks/useSocket"
import type { IFile } from "@lib/types/files.type"
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { useEffect, useState } from "react";

interface IChatPageLayoutProps {
  file: IFile
}

interface IMessage {
  text: string;
  file_id: string;
}

const ChatPageLayout: React.FC<IChatPageLayoutProps> = ({ file }) => {

  const socket = useSocket(file.id);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: IMessage) => {
      setMessages(prev => [...prev, msg]);
    }

    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("receive_message", handleNewMessage);
    }
  }, [socket])

  const handleSend = () => {
    if (input.trim() && socket) {
      socket.emit("send_message", { text: input, file_id: file.id })
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-4xl">This is the chat page</h1>
      <p>File id - {file.id}</p>
      <p>File name - {file.file_name}</p>
      <div>
        <div>
          {messages.map((msg, index) => (
            <p key={index}>{msg.text}</p>
          ))}
        </div>
        <form
          className="flex gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}>
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Ask anything related to this file ... "
          />
          <Button type="submit">
            Send
          </Button>
        </form>
      </div>
    </main>
  )
}

export default ChatPageLayout
