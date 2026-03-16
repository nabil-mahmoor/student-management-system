import "server-only";
import { courseRepository } from "./course.repository";
import type {
  CreateCourseInput,
  UpdateCourseInput,
  CourseWithEnrolled,
} from "./course.types";

export const courseService = {
  // Normalizes the Prisma _count shape into a clean `enrolled` number
  // so the rest of the app never needs to know about _count internals
  async getAll(): Promise<CourseWithEnrolled[]> {
    const courses = await courseRepository.findAll();
    return courses.map((c) => ({
      ...c,
      enrolled: c._count.enrollments,
    }));
  },

  async getById(id: number) {
    const course = await courseRepository.findById(id);
    if (!course) throw new Error("Course not found");
    return {
      ...course,
      enrolled: course._count.enrollments,
    };
  },

  async create(data: CreateCourseInput) {
    const existing = await courseRepository.findByCode(data.code);
    if (existing) throw new Error(`Course code ${data.code} is already in use`);
    return courseRepository.create(data);
  },

  async update(id: number, data: UpdateCourseInput) {
    const before = await courseRepository.findById(id);
    if (!before) throw new Error("Course not found");

    if (data.code && data.code !== before.code) {
      const codeTaken = await courseRepository.findByCode(data.code);
      if (codeTaken)
        throw new Error(`Course code ${data.code} is already in use`);
    }

    const after = await courseRepository.update(id, data);
    return { before, after };
  },

  async delete(id: number) {
    const course = await courseRepository.findById(id);
    if (!course) throw new Error("Course not found");

    // Prevent deleting a course that has active enrollments
    if (course._count.enrollments > 0)
      throw new Error(
        `Cannot delete course with ${course._count.enrollments} active enrollment(s). Drop all enrollments first.`,
      );

    await courseRepository.delete(id);
    return course;
  },
};