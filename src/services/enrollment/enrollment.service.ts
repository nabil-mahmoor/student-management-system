import "server-only";
import { enrollmentRepository } from "./enrollment.repository";
import type {
  CreateEnrollmentInput,
  UpdateEnrollmentInput,
  EnrollmentStatus,
} from "./enrollment.types";
import { ENROLLMENT_TRANSITIONS } from "./enrollment.types";

export const enrollmentService = {
  getAll() {
    return enrollmentRepository.findAll();
  },

  async getById(id: number) {
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) throw new Error("Enrollment not found");
    return enrollment;
  },

  getByStudent(studentId: number) {
    return enrollmentRepository.findByStudent(studentId);
  },

  getByCourse(courseId: number) {
    return enrollmentRepository.findByCourse(courseId);
  },

  async create(data: CreateEnrollmentInput) {
    // Enforce the @@unique([studentId, courseId]) constraint at the
    // service layer for a clean error message before hitting the DB
    const existing = await enrollmentRepository.findByStudentAndCourse(
      data.studentId,
      data.courseId,
    );

    if (existing) {
      if (existing.status === "ACTIVE")
        throw new Error("Student is already enrolled in this course");
      if (existing.status === "COMPLETED")
        throw new Error("Student has already completed this course");
      // DROPPED — allow re-enrollment by creating a fresh record
      // The old dropped record remains for audit history
    }

    return enrollmentRepository.create(data);
  },

  async update(id: number, data: UpdateEnrollmentInput) {
    const before = await enrollmentRepository.findById(id);
    if (!before) throw new Error("Enrollment not found");

    // Enforce valid state transitions
    const allowed = ENROLLMENT_TRANSITIONS[before.status as EnrollmentStatus];
    if (!allowed.includes(data.status as EnrollmentStatus)) {
      throw new Error(
        `Cannot transition enrollment from ${before.status} to ${data.status}`,
      );
    }

    const after = await enrollmentRepository.update(id, data);
    return { before, after };
  },

  async delete(id: number) {
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) throw new Error("Enrollment not found");

    // Only allow deleting DROPPED enrollments
    // ACTIVE → use update to DROPPED first
    // COMPLETED → permanent record, cannot be deleted
    if (enrollment.status === "ACTIVE")
      throw new Error("Cannot delete an active enrollment. Drop it first.");
    if (enrollment.status === "COMPLETED")
      throw new Error("Cannot delete a completed enrollment.");

    await enrollmentRepository.delete(id);
    return enrollment;
  },
};