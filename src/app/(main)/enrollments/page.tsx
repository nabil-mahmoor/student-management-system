import PageLayout from "@/src/components/PageLayout";
import { EnrollmentTable } from "@/src/components/enrollments/EnrollmentTable";
import { Button } from "@/src/components/ui/button";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Enrollments",
};

export default async function EnrollmentsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/enrollments`,
    {
      headers: await headers(),
      cache: "no-store",
    },
  );

  const { data: enrollments } = await res.json();

  return (
    <PageLayout title="Enrollments">
      {/* <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/enrollments/create">
            <Plus className="h-4 w-4 mr-1" />
            Enroll Student
          </Link>
        </Button>
      </div> */}
      <EnrollmentTable data={enrollments ?? []} />
    </PageLayout>
  );
}