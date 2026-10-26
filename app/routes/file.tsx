import FilePageLayout from "@layouts/filePageLayout";
import type { Route } from "./+types/file";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Chat" }, { name: "description", content: "Chat with PDF" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  return {
    file_id: params.file_id,
  };
}

const File: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  return <FilePageLayout file_id={loaderData.file_id} />;
};

export default File;
