import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllFiles } from "@api/files";
import type {
  FilesSortBy,
  IFile,
  IFilesQuery,
  SortOrder,
} from "@lib/types/files.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@ui/pagination";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@ui/empty";
import { Skeleton } from "@ui/skeleton";
import { Button } from "@ui/button";
import dayjs from "dayjs";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  MessageSquareMoreIcon,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";

const PAGE_SIZE = 10;
const SORT_FIELDS: FilesSortBy[] = ["file_name", "created_at", "pages_count"];

const parseQuery = (params: URLSearchParams): IFilesQuery => {
  const page = Number(params.get("page"));
  const sortBy = params.get("sort_by") as FilesSortBy;
  const order = params.get("order");

  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: PAGE_SIZE,
    sort_by: SORT_FIELDS.includes(sortBy) ? sortBy : "created_at",
    order: order === "asc" ? "asc" : "desc",
  };
};

const SortableHead: React.FC<{
  label: string;
  field: FilesSortBy;
  query: IFilesQuery;
  onSort: (field: FilesSortBy) => void;
}> = ({ label, field, query, onSort }) => {
  const active = query.sort_by === field;
  const Icon = !active
    ? ArrowUpDownIcon
    : query.order === "asc"
      ? ArrowUpIcon
      : ArrowDownIcon;

  return (
    <TableHead
      aria-sort={
        active ? (query.order === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2.5"
        onClick={() => onSort(field)}
      >
        {label}
        <Icon data-icon="inline-end" />
      </Button>
    </TableHead>
  );
};

const SkeletonRows = () =>
  Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 5 }).map((_, j) => (
        <TableCell key={j}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));

const FileRows: React.FC<{ files: IFile[]; offset: number }> = ({
  files,
  offset,
}) =>
  files.map((file, index) => (
    <TableRow key={file.id}>
      <TableCell>{offset + index + 1}</TableCell>
      <TableCell className="font-medium">
        <Link to={`/file/${file.id}`} className="hover:underline">
          {file.file_name}
        </Link>
      </TableCell>
      <TableCell>{file.pages_count}</TableCell>
      <TableCell>{dayjs(file.created_at).format("DD MMM, YYYY")}</TableCell>
      <TableCell className="text-right">
        <Link to={`/file/${file.id}`}>
          <Button size="icon-lg" aria-label={`Chat with ${file.file_name}`}>
            <MessageSquareMoreIcon />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  ));

const pageNumbers = (current: number, total: number) => {
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const HomePageLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = parseQuery(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["files", query],
    queryFn: () => getAllFiles(query),
  });

  const files = data?.data ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const update = (next: Partial<IFilesQuery>) => {
    const merged = { ...query, ...next };
    setSearchParams({
      page: String(merged.page),
      sort_by: merged.sort_by,
      order: merged.order,
    });
  };

  const goToPage = (page: number) => update({ page });

  const onSort = (field: FilesSortBy) => {
    const order: SortOrder =
      query.sort_by === field && query.order === "desc" ? "asc" : "desc";
    update({ sort_by: field, order, page: 1 });
  };

  // Page past the end (e.g. a stale link): fall back to the last page
  useEffect(() => {
    if (data && count > 0 && query.page > totalPages) goToPage(totalPages);
  }, [data, count, query.page, totalPages]);

  const offset = (query.page - 1) * PAGE_SIZE;
  const pageLink = (page: number) => ({
    href: `?page=${page}&sort_by=${query.sort_by}&order=${query.order}`,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      goToPage(page);
    },
  });

  return (
    <main className="min-h-screen max-w-7xl mx-auto w-full p-6 flex flex-col gap-4">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">All Files</h1>
        {data && (
          <span className="text-sm text-muted-foreground">
            {count} {count === 1 ? "file" : "files"}
          </span>
        )}
      </header>

      {!isLoading && count === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No files uploaded</EmptyTitle>
            <EmptyDescription>
              Uploaded PDFs will show up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <SortableHead
                  label="PDF name"
                  field="file_name"
                  query={query}
                  onSort={onSort}
                />
                <SortableHead
                  label="Pages"
                  field="pages_count"
                  query={query}
                  onSort={onSort}
                />
                <SortableHead
                  label="Created at"
                  field="created_at"
                  query={query}
                  onSort={onSort}
                />
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <SkeletonRows />
              ) : (
                <FileRows files={files} offset={offset} />
              )}
            </TableBody>
          </Table>

          <footer className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {count > 0 &&
                `Showing ${offset + 1}–${Math.min(offset + PAGE_SIZE, count)} of ${count}`}
            </span>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                {query.page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious {...pageLink(query.page - 1)} />
                  </PaginationItem>
                )}
                {pageNumbers(query.page, totalPages).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === query.page}
                      {...pageLink(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {query.page < totalPages && (
                  <PaginationItem>
                    <PaginationNext {...pageLink(query.page + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </footer>
        </>
      )}
    </main>
  );
};
export default HomePageLayout;
