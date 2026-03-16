import "server-only";
import prisma from "@/src/lib/prisma";
import type { CreateCourseInput, UpdateCourseInput } from "./course.types";

export const courseRepository = {
  findAll() {
    return prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        // enrolled is derived — never stored as a column
        _count: { select: { enrollments: true } },
      },
    });
  },

  findById(id: number) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        _count: { select: { enrollments: true } },
        enrollments: {
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
        },
      },
    });
  },

  findByCode(code: string) {
    return prisma.course.findUnique({ where: { code } });
  },

  create(data: CreateCourseInput) {
    return prisma.course.create({ data });
  },

  update(id: number, data: UpdateCourseInput) {
    return prisma.course.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.course.delete({ where: { id } });
  },
};