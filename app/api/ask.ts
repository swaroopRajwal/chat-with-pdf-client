import type { IResponse } from "@lib/types/api.type";
import apiClient from "./apiClient";

export const ask = async ({
  query,
  file_id
}: {
  query: string,
  file_id: string
}) => await apiClient<IResponse<{
  answer: string,
  query: string
}>>("/ask", {
  method: "POST",
  body: {
    query,
    file_id
  }
})
