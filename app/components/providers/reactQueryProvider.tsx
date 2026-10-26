import { CHATS_STORAGE_KEY } from "@lib/chatStorage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

const queryClient = new QueryClient();

const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Fires for changes made by other tabs, keeping the chats in sync across them
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CHATS_STORAGE_KEY || e.key === null)
        queryClient.invalidateQueries({ queryKey: ["chats"] });
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
