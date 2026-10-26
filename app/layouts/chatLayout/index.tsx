import { formatTitle } from "@lib/utils";
import { getAllChats } from "@lib/chatStorage";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { Skeleton } from "@ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@ui/sidebar";
import { ArrowLeftIcon, SquarePenIcon } from "lucide-react";
import {
  Link,
  matchPath,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router";

const NEW_CHAT_PATH = "/chat/new";

const ChatLayout = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getAllChats,
  });

  const chats = data ?? [];

  const isNewChat = pathname === NEW_CHAT_PATH;
  const activeChatId = isNewChat
    ? undefined
    : matchPath("/chat/:chat_id", pathname)?.params.chat_id;

  // The file that "New chat" starts a chat about: the one being viewed
  const fileId = isNewChat
    ? searchParams.get("file")
    : chats.find((chat) => chat.id === activeChatId)?.file_id;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ArrowLeftIcon data-icon="inline-start" />
              All Books
            </Button>
          </Link>
          {fileId ? (
            <Link to={`${NEW_CHAT_PATH}?file=${fileId}`}>
              <Button variant="outline" className="w-full">
                <SquarePenIcon data-icon="inline-start" />
                New chat
              </Button>
            </Link>
          ) : (
            <Button variant="outline" className="w-full" disabled>
              <SquarePenIcon data-icon="inline-start" />
              New chat
            </Button>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoading &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <Skeleton className="h-10 w-full" />
                    </SidebarMenuItem>
                  ))}
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      className="h-auto py-2"
                      isActive={chat.id === activeChatId}
                      render={
                        <Link to={`/chat/${chat.id}`}>
                          <span className="flex min-w-0 flex-col items-start">
                            <span className="w-full truncate">
                              {chat.title}
                            </span>
                            <span className="w-full truncate text-xs text-muted-foreground">
                              {formatTitle(chat.file_name)}
                            </span>
                          </span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="h-screen">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ChatLayout;
