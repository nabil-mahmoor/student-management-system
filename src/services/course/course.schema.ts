import * as z from "zod";

export const createCourseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(4, "Course code must be at least 4 characters")
    .max(10, "Course code must not exceed 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Course code must be uppercase letters and numbers only",
    ),

  name: z
    .string()
    .trim()
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),

  imageUrl: z.string().url("Must be a valid URL"),

  tags: z
    .array(z.string().trim().min(1))
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed"),
});

export const updateCourseSchema = createCourseSchema.partial();