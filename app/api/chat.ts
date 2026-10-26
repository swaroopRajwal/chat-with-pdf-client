import type { IResponse } from "@lib/types/api.type";
import apiClient from "./apiClient";
import type { IChat, IChatWithMessage } from "@lib/types/chat.type";

export const getAllChats = async () =>
  await apiClient<IResponse<IChat[]>>("/chats", {
    method: "GET",
  });

export const getSingleChat = async ({ chat_id }: { chat_id: string }) =>
  await apiClient<IResponse<IChatWithMessage>>(`/chats/${chat_id}`, {
    method: "GET",
  });
