import "server-only";
import prisma from "@/src/lib/prisma";
import type {
  CreateEnrollmentInput,
  UpdateEnrollmentInput,
} from "./enrollment.types";

export const enrollmentRepository = {
  findAll() {
    return prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: {
            id: true,
            studentId: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        course: {
          select: { id: true, code: true, name: true },
        },
      },
    });
  },

  findById(id: number) {
    return prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: true,
        course: true,
      },
    });
  },

  // Check for existing enrollment before creating (duplicate guard)
  findByStudentAndCourse(studentId: number, courseId: number) {
    return prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    });
  },

  findByStudent(studentId: number) {
    return prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: { select: { id: true, code: true, name: true } },
      },
    });
  },

  findByCourse(courseId: number) {
    return prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            studentId: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  create(data: CreateEnrollmentInput) {
    return prisma.enrollment.create({
      data,
      include: {
        student: true,
        course: true,
      },
    });
  },

  update(id: number, data: UpdateEnrollmentInput) {
    return prisma.enrollment.update({
      where: { id },
      data,
      include: {
        student: true,
        course: true,
      },
    });
  },

  delete(id: number) {
    return prisma.enrollment.delete({ where: { id } });
  },
};