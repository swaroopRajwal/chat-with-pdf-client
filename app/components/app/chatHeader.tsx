import { SidebarTrigger } from "@ui/sidebar";

const ChatHeader: React.FC<{ fileName: string }> = ({ fileName }) => (
  <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4">
    <SidebarTrigger className="-ml-1" />
    <p className="truncate font-medium">{fileName}</p>
  </header>
);

export default ChatHeader;
