import type { IResponse, IResponseMultiple } from "@lib/types/api.type";
import apiClient from "./apiClient";
import type { IFile, IFilesQuery } from "@lib/types/files.type";

export const getAllFiles = async (params: IFilesQuery) => await apiClient<IResponseMultiple<IFile>>("/files", {
  method: 'GET',
  params,
});

export const getSingleFile = async ({
  id
}: {
  id: string
}) => await apiClient<IResponse<IFile>>(`/files/${id}`, {
  method: "GET"
})
