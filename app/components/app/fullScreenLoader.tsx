import { LoaderCircleIcon } from "lucide-react";

const FullScreenLoader = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-4">
      <LoaderCircleIcon size={58} className="animate-spin" />
    </main>
  );
};
export default FullScreenLoader;
