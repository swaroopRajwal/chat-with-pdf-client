import { ask } from "@api/ask";
import type { IFile } from "@lib/types/files.type";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { Textarea } from "@ui/textarea";
import { useRef } from "react";

interface IAskPageLayoutProps {
  file: IFile
}

const AskContainer: React.FC<{
  fileId: string
}> = ({ fileId }) => {
  const inputRef = useRef(null);

  const mutation = useMutation({
    mutationFn: ask
  })

  const handleSubmit = () => {
    if (!inputRef.current) return;
    mutation.mutate({
      query: (inputRef.current as any)?.value as string,
      file_id: fileId
    })
  }

  return <div>
    <Textarea
      placeholder="Ask..."
      ref={inputRef}
    />
    <Button onClick={handleSubmit}>Submit</Button>
  </div>
}

const AskPageLayout: React.FC<IAskPageLayoutProps> = ({ file }) => {
  return <main className="min-h-screen flex flex-col justify-center items-center gap-4">
    <h1 className="text-4xl capitalize">This is the chat page</h1>
    <div className="flex flex-col gap-4">
      <div>
        <p>File Name: {file.file_name}</p>
        <p>File Id: {file.id}</p>
      </div>
      <AskContainer
        fileId={file.id}
      />
      <p>Check the networks tab for LLM response and loading state ... </p>
    </div>
  </main>;
};
export default AskPageLayout;
