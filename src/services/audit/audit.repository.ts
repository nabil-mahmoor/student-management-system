import "server-only";
import prisma from "@/src/lib/prisma";
import type { LogActionInput } from "./audit.types";

export const auditRepository = {
  create(data: LogActionInput) {
    return prisma.auditLog.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        performedBy: data.performedBy,
        changes: data.changes ?? {},
        studentId: data.studentId,
        courseId: data.courseId,
        enrollmentId: data.enrollmentId,
      },
    });
  },

  findAll() {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  findByEntity(entity: "STUDENT" | "COURSE" | "ENROLLMENT", entityId: number) {
    return prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },
};
