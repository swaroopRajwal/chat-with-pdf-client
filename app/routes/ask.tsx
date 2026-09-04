import type { Route } from "./+types/ask";
import { getSingleFile } from "@api/files";
import AskPageLayout from "@layouts/askPageLayout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ask" },
    { name: "description", content: "Ask LLM about this file" },
  ];
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

export default function Ask({
  loaderData
}: Route.ComponentProps) {
  return <AskPageLayout file={loaderData.file.data} />;
}
