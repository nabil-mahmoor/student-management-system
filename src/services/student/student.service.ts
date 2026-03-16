import "server-only";
import { studentRepository } from "./student.repository";
import type {
  CreateStudentInput,
  UpdateStudentInput,
  GenerateIdResult,
} from "./student.types";

// Maps Prisma Intake enum → numeric string used in student IDs
const INTAKE_NUMBER: Record<string, string> = {
  INTAKE_40: "40",
  INTAKE_41: "41",
  INTAKE_42: "42",
  INTAKE_43: "43",
};

export const studentService = {
  getAll() {
    return studentRepository.findAll();
  },

  async getById(id: number) {
    const student = await studentRepository.findById(id);
    if (!student) throw new Error("Student not found");
    return student;
  },

  // ─── ID & Email Generation ────────────────────────────────────────────────
  //
  // Builds a student ID and email from intake + degree + next sequence.
  //
  //   studentId → "41/BSE/0032"
  //   email     → "41-bse-0032@kdu.ac.lk"
  //
  // Sequence = COUNT of existing students with same prefix + 1.
  // This is safe for this use case since students are never bulk-deleted.
  async generateStudentId(
    intake: string,
    degree: string,
  ): Promise<GenerateIdResult> {
    const intakeKey = intake.startsWith("INTAKE_")
      ? intake
      : `INTAKE_${intake}`;
    const intakeNumber = INTAKE_NUMBER[intakeKey];
    if (!intakeNumber) throw new Error(`Invalid intake: ${intake}`);

    const validDegrees = ["BCS", "BSE", "BCE", "DBA", "BIT", "BIS"];
    if (!validDegrees.includes(degree))
      throw new Error(`Invalid degree: ${degree}`);

    const count = await studentRepository.countByIntakeAndDegree(
      intakeNumber,
      degree,
    );

    const sequence = count + 1;
    const padded = String(sequence).padStart(4, "0");

    return {
      studentId: `${intakeNumber}/${degree}/${padded}`,
      email: `${intakeNumber}-${degree.toLowerCase()}-${padded}@kdu.ac.lk`,
      sequence,
    };
  },

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async create(data: CreateStudentInput) {
    // Guard against race condition — two admins generating at the same time
    const idTaken = await studentRepository.findByStudentId(data.studentId);
    if (idTaken)
      throw new Error(
        `Student ID ${data.studentId} is already taken. Please regenerate.`,
      );

    const emailTaken = await studentRepository.findByEmail(data.email);
    if (emailTaken) throw new Error(`Email ${data.email} is already in use.`);

    return studentRepository.create(data);
  },

  async update(id: number, data: UpdateStudentInput) {
    const before = await studentRepository.findById(id);
    if (!before) throw new Error("Student not found");

    if (data.email && data.email !== before.email) {
      const emailTaken = await studentRepository.findByEmail(data.email);
      if (emailTaken) throw new Error("Email is already in use");
    }

    const after = await studentRepository.update(id, data);
    return { before, after };
  },

  async delete(id: number) {
    const student = await studentRepository.findById(id);
    if (!student) throw new Error("Student not found");
    await studentRepository.delete(id);
    return student;
  },
};