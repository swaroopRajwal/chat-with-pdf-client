import type { IResponse } from "@lib/types/api.type";
import apiClient from "./apiClient";
import type { IChat, IChatWithMessage, IMessage } from "@lib/types/chat.type";

export const initChat = async ({
  query,
  file_id,
}: {
  query: string;
  file_id: string;
}) =>
  await apiClient<IResponse<IChat>>("/chats/init", {
    method: "POST",
    body: {
      query,
      file_id,
    },
  });

export const getAllChats = async () =>
  await apiClient<IResponse<IChat[]>>("/chats", {
    method: "GET",
  });

export const getSingleChat = async ({ chat_id }: { chat_id: string }) =>
  await apiClient<IResponse<IChatWithMessage>>(`/chats/${chat_id}`, {
    method: "GET",
  });

export const askChatQuery = async ({ data }: { data: IMessage }) =>
  await apiClient(`/chats/${data.chat_id}/ask`, {
    method: "POST",
    body: data,
  });
