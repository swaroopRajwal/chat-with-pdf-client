import { getSingleFile } from "@api/files";
import type { Route } from "./+types/chat"
import ChatPageLayout from "@layouts/chatPageLayout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Chat" },
    { name: "description", content: "Chat with PDF" }
  ]
}

export async function loader({ params }: Route.LoaderArgs) {
  let file_id = params.file_id;

  const file = await getSingleFile({
    id: file_id
  })

  return {
    file
  }
}

const Chat: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  return <ChatPageLayout file={loaderData.file.data} />
}

export default Chat

