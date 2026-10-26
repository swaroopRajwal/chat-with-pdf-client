import type { Route } from "./+types/chat";
import ChatPageLayout from "@layouts/chatPageLayout";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Chat" }, { name: "description", content: "Chat with PDF" }];
}

// TODO: setup 404
export async function loader({ params }: Route.LoaderArgs) {
  return {
    chat_id: params.chat_id,
  };
}

const Chat: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  return <ChatPageLayout chat_id={loaderData.chat_id} />;
};

export default Chat;
