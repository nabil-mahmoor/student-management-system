import PageLayout from "@/src/components/PageLayout";
import { StudentTable } from "@/src/components/DataTable/StudentTable";
import { columns } from "@/src/components/students/StudentColumns";
import { auth } from "@/src/services/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Students",
};

export default async function StudentsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  // Fetch students from our API route.
  // This runs on the server — no loading state needed, data arrives ready.
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/students`, {
    headers: await headers(), // forward session cookies for auth
    cache: "no-store", // always fresh — student data changes frequently
  });

  const { data: students } = await res.json();

  return (
    <PageLayout title="Students">
      <StudentTable columns={columns} data={students ?? []} />
    </PageLayout>
  );
}
