import type { IChat, IChatWithMessage } from "@lib/types/chat.type";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@ui/item";
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
  SidebarTrigger,
} from "@ui/sidebar";
import { Link } from "react-router";
import ChatArea from "./chatArea";
import useChat from "@app/hooks/useChat";

interface IChatsListingProps {
  activeChat: IChatWithMessage;
  chats: IChat[];
}

const ChatsListing: React.FC<IChatsListingProps> = ({ activeChat, chats }) => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-2 items-stretch">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Chat ID</ItemTitle>
              <ItemDescription>{activeChat.id}</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>File</ItemTitle>
              <ItemDescription>{activeChat.file.file_name}</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>File ID</ItemTitle>
              <ItemDescription>{activeChat.file.id}</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Previous Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat, index) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    isActive={chat.id === activeChat.id}
                    render={
                      <Link to={`/chat/${chat.id}`}>Chat no. {index + 1}</Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

interface IChatsProps {
  activeChat: IChatWithMessage;
  allChats: IChat[];
}

const Chats: React.FC<IChatsProps> = ({ activeChat, allChats }) => {
  return (
    <SidebarProvider>
      <ChatsListing activeChat={activeChat} chats={allChats || []} />
      <SidebarInset className="h-screen">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>chat</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{activeChat.id}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <ChatArea chat={activeChat} />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Chats;
