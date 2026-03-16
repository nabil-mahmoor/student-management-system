import type { Course } from "@/src/lib/generated/prisma";

export type { Course };

export type CreateCourseInput = {
  code: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
};

export type UpdateCourseInput = Partial<CreateCourseInput>;

// Course with derived enrolled count from _count.enrollments
export type CourseWithEnrolled = Course & {
  enrolled: number;
};