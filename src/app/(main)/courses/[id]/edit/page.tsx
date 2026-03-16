import EditCourseForm from "@/src/components/courses/EditCourseForm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Course",
};

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${id}`,
    {
      headers: await headers(),
      cache: "no-store",
    },
  );

  if (!res.ok) notFound();

  const { data: course } = await res.json();

  return (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="font-bold text-2xl sm:text-4xl">Edit Course</h1>
        <p className="text-muted-foreground mt-1">{course.code}</p>
      </div>
      <EditCourseForm course={course} />
    </div>
  );
}