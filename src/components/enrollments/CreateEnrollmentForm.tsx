"use client";

import { Button } from "@/src/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

const enrollmentSchema = z.object({
  studentId: z.number({ message: "Please select a student" }).int().positive(),
  courseId: z.number({ message: "Please select a course" }).int().positive(),
});

type StudentOption = {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
};
type CourseOption = { id: number; code: string; name: string };

export default function CreateEnrollmentForm() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch students and courses in parallel for the dropdowns
  useEffect(() => {
    async function load() {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/courses"),
        ]);
        const { data: studentsData } = await studentsRes.json();
        const { data: coursesData } = await coursesRes.json();
        setStudents(studentsData ?? []);
        setCourses(coursesData ?? []);
      } catch {
        toast.error("Failed to load students and courses");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const form = useForm({
    defaultValues: {
      studentId: 0,
      courseId: 0,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch("/api/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        if (!res.ok) {
          const { error } = await res.json();
          toast.error(error ?? "Failed to enroll student");
          return;
        }

        toast.success("Student enrolled successfully");
        router.push("/enrollments");
        router.refresh();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    },
    validators: {
      onSubmit: enrollmentSchema,
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="max-w-md mx-auto"
    >
      <FieldGroup>
        {/* Student */}
        <form.Field
          name="studentId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Student</FieldLabel>
                <Select
                  value={field.state.value ? String(field.state.value) : ""}
                  onValueChange={(val) => field.handleChange(Number(val))}
                >
                  <SelectTrigger onBlur={field.handleBlur}>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          <span className="font-medium">
                            {s.firstName} {s.lastName}
                          </span>
                          <span className="ml-2 text-muted-foreground text-sm">
                            {s.studentId}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/* Course */}
        <form.Field
          name="courseId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Course</FieldLabel>
                <Select
                  value={field.state.value ? String(field.state.value) : ""}
                  onValueChange={(val) => field.handleChange(Number(val))}
                >
                  <SelectTrigger onBlur={field.handleBlur}>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          <span className="font-medium">{c.name}</span>
                          <span className="ml-2 text-muted-foreground text-sm">
                            {c.code}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <div className="flex gap-4 mt-12">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? "Enrolling..." : "Enroll Student"}
              </>
            )}
          />
        </Button>
      </div>
    </form>
  );
}