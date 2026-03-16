import * as z from "zod";

export const createEnrollmentSchema = z.object({
  studentId: z.number().int().positive("Invalid student"),
  courseId: z.number().int().positive("Invalid course"),
});

export const updateEnrollmentSchema = z.object({
  status: z.enum(["ACTIVE", "DROPPED", "COMPLETED"]),
});