import { useQuery } from "@tanstack/react-query";
import { getAllFiles } from "@api/files";
import FullScreenLoader from "@components/app/fullScreenLoader";
import type { IFile } from "@lib/types/files.type";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import dayjs from "dayjs";
import { MessageSquareMoreIcon } from "lucide-react";
import { Button } from "@ui/button";
import { Link } from "react-router";

const FilesListing: React.FC<{
  data?: IFile[];
}> = ({ data }) => {
  if (!data)
    return (
      <>
        <p>No files uploaded</p>
      </>
    );

  return (
    <Table className="w-4/5 mx-auto">
      <TableCaption>All Files</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Sr. No.</TableHead>
          <TableHead>PDF name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((i, index) => (
          <TableRow key={i.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{i.file_name}</TableCell>
            <TableCell>{dayjs(i.created_at).format("DD MMM, YYYY")}</TableCell>
            <TableCell>
              <Link to={`/chat/${i.id}`}>
                <Button size="icon-lg">
                  <MessageSquareMoreIcon />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const HomePageLayout = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["files"],
    queryFn: getAllFiles,
  });

  if (isLoading) return <FullScreenLoader />;

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-4xl capitalize">All Files</h1>
      <FilesListing data={data?.data} />
    </main>
  );
};
export default HomePageLayout;
