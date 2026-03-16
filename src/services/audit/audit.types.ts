import type { AuditLog } from "@/src/lib/generated/prisma";

export type { AuditLog };

export type LogActionInput = {
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: "STUDENT" | "COURSE" | "ENROLLMENT";
  entityId: number;
  performedBy: string;
  changes?: object;
  studentId?: number;
  courseId?: number;
  enrollmentId?: number;
};
