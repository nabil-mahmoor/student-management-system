import PageLayout from "@/components/PageLayout";
import { Metadata } from "next";
import { columns, student } from "./columns";
import { DataTable } from "./data-table";

export const metadata: Metadata = {
  title: "Students",
};

export default function StudentsPage() {
  return (
    <PageLayout title="Students">
      <DataTable columns={columns} data={student} />
    </PageLayout>
  );
}
