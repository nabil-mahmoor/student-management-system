import PageLayout from "@/components/PageLayout";
import { Metadata } from "next";
import courses from "./course-data.json";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const metadata: Metadata = {
  title: "Courses",
};

export default function CoursesPage() {
  return (
    <PageLayout title="Courses">
      <DataTable data={courses} columns={columns} />
    </PageLayout>
  );
}
