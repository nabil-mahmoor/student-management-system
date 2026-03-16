import PageLayout from "@/src/components/PageLayout";
import { CourseGrid } from "@/src/components/DataTable/CourseGrid";
import { columns } from "@/src/components/courses/CourseColumns";
import { auth } from "@/src/services/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Courses",
};

export default async function CoursesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  // Fetch courses from our API route.
  // The API returns enrolled as _count.enrollments — the serialized
  // response shape matches the Course type the grid expects.
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses`, {
    headers: await headers(),
    cache: "no-store",
  });

  const { data: courses } = await res.json();

  return (
    <PageLayout title="Courses">
      <CourseGrid columns={columns} data={courses ?? []} />
    </PageLayout>
  );
}
