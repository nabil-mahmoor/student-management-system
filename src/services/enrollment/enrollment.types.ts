import type { Enrollment, EnrollmentStatus } from "@/src/lib/generated/prisma";

export type { Enrollment, EnrollmentStatus };

export type CreateEnrollmentInput = {
  studentId: number;
  courseId: number;
};

export type UpdateEnrollmentInput = {
  status: EnrollmentStatus;
};

// Valid status transitions — terminal states cannot be changed
export const ENROLLMENT_TRANSITIONS: Record<
  EnrollmentStatus,
  EnrollmentStatus[]
> = {
  ACTIVE: ["DROPPED", "COMPLETED"],
  DROPPED: [],
  COMPLETED: [],
};