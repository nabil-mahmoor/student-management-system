"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function PageLayout({
  title,
  children,
}: {
  title: string;

  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-bold lg:text-5xl text-4xl">{title}</h1>
        {title === "Students" ? (
          <Button onClick={() => router.push("/students/register")}>
            <Plus />
            <span className="md:block hidden">Register Student</span>
          </Button>
        ) : title === "Courses" ? (
          <Button onClick={() => router.push("/courses/create")}>
            <Plus />
            <span className="md:block hidden">Create Course</span>
          </Button>
        ) : null}
      </div>
      {children}
    </main>
  );
}
