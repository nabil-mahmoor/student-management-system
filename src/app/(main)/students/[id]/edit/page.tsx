import EditStudentForm from "@/src/components/students/EditStudentForm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Student",
};

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/students/${id}`,
    {
      headers: await headers(),
      cache: "no-store",
    },
  );

  if (!res.ok) notFound();

  const { data: student } = await res.json();

  return (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="font-bold text-2xl sm:text-4xl">Edit Student</h1>
        <p className="text-muted-foreground mt-1">{student.studentId}</p>
      </div>
      <EditStudentForm student={student} />
    </div>
  );
}