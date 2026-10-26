import { redirect } from "react-router";
import type { Route } from "./+types/chatNew";
import NewChatPageLayout from "@layouts/newChatPageLayout";

export function meta({}: Route.MetaArgs) {
  return [{ title: "New chat" }, { name: "description", content: "Talk with books" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const file_id = new URL(request.url).searchParams.get("file");

  if (!file_id) throw redirect("/");

  return { file_id };
}

const ChatNew: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  return <NewChatPageLayout file_id={loaderData.file_id} />;
};

export default ChatNew;
