export interface IFile {
    id: string;
    file_name: string;
    pages_count: number;
    created_at: Date;
}

export type FilesSortBy = "file_name" | "created_at" | "pages_count";
export type SortOrder = "asc" | "desc";

export interface IFilesQuery {
    page: number;
    limit: number;
    sort_by: FilesSortBy;
    order: SortOrder;
}
