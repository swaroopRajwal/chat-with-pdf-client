import InitChat from "./initChat";
import { useQuery } from "@tanstack/react-query";
import { getSingleFile } from "@api/files";
import FullScreenLoader from "@components/app/fullScreenLoader";

interface IFilePageLayoutProps {
  file_id: string;
}

const FilePageLayout: React.FC<IFilePageLayoutProps> = ({ file_id }) => {
  const { isLoading, data } = useQuery({
    queryKey: ["files", file_id],
    queryFn: () => getSingleFile({ id: file_id }),
  });

  if (isLoading) return <FullScreenLoader />;

  if (!data) return <h1 className="text-5xl">File not found!!</h1>;

  // const socket = useSocket(file.id);
  //
  // const [messages, setMessages] = useState<IMessage[]>([]);
  // const [input, setInput] = useState("");
  //
  // useEffect(() => {
  //   if (!socket) return;
  //
  //   const handleNewMessage = (msg: IMessage) => {
  //     setMessages(prev => [...prev, msg]);
  //   }
  //
  //   socket.on("receive_message", handleNewMessage);
  //
  //   return () => {
  //     socket.off("receive_message", handleNewMessage);
  //   }
  // }, [socket])
  //
  // const handleSend = () => {
  //   if (input.trim() && socket) {
  //     socket.emit("send_message", { text: input, file_id: file.id })
  //   }
  // }

  return (
    <main className="min-h-screen flex flex-col">
      <InitChat file={data?.data} />
      {/* <Chat /> */}
      {/* <h1 className="text-4xl">This is the chat page</h1> */}
      {/* <p>File id - {file.id}</p> */}
      {/* <p>File name - {file.file_name}</p> */}
      {/* <div> */}
      {/*   <div> */}
      {/*     {messages.map((msg, index) => ( */}
      {/*       <p key={index}>{msg.text}</p> */}
      {/*     ))} */}
      {/*   </div> */}
      {/*   <form */}
      {/*     className="flex gap-3" */}
      {/*     onSubmit={(e) => { */}
      {/*       e.preventDefault() */}
      {/*       handleSend() */}
      {/*     }}> */}
      {/*     <Input */}
      {/*       value={input} */}
      {/*       onChange={(e) => { */}
      {/*         setInput(e.target.value); */}
      {/*       }} */}
      {/*       placeholder="Ask anything related to this file ... " */}
      {/*     /> */}
      {/*     <Button type="submit"> */}
      {/*       Send */}
      {/*     </Button> */}
      {/*   </form> */}
      {/* </div> */}
    </main>
  );
};

export default FilePageLayout;
