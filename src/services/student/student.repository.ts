import prisma from "@/src/lib/prisma";
import "server-only";
import type { CreateStudentInput, UpdateStudentInput } from "./student.types";

export const studentRepository = {
  findAll() {
    return prisma.student.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: number) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { course: true },
        },
      },
    });
  },

  findByStudentId(studentId: string) {
    return prisma.student.findUnique({ where: { studentId } });
  },

  findByEmail(email: string) {
    return prisma.student.findUnique({ where: { email } });
  },

  // Counts students matching the intake/degree prefix in their studentId.
  // e.g. studentId starting with "41/BSE/" for intake 41, degree BSE.
  countByIntakeAndDegree(intakeNumber: string, degree: string) {
    return prisma.student.count({
      where: {
        studentId: {
          startsWith: `${intakeNumber}/${degree}/`,
        },
      },
    });
  },

  create(data: CreateStudentInput) {
    return prisma.student.create({ data });
  },

  update(id: number, data: UpdateStudentInput) {
    return prisma.student.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.student.delete({ where: { id } });
  },
};