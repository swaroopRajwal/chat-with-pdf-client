import type { IResponse, IResponseMultiple } from "@lib/types/api.type";
import apiClient from "./apiClient";
import type { IFile } from "@lib/types/files.type";

export const getAllFiles = async () => await apiClient<IResponseMultiple<IFile>>("/files", {
    method: 'GET'
});