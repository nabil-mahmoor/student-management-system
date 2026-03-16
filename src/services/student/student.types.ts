import type { Student } from "@/src/lib/generated/prisma";

export type { Student };

export type CreateStudentInput = {
  studentId: string;
  firstName: string;
  lastName: string;
  address: string;
  dob: Date;
  degree: "BCS" | "BSE" | "BCE" | "DBA" | "BIT" | "BIS";
  intake: "INTAKE_40" | "INTAKE_41" | "INTAKE_42" | "INTAKE_43";
  email: string;
};

export type UpdateStudentInput = Partial<Omit<CreateStudentInput, "studentId">>;

export type GenerateIdResult = {
  studentId: string;
  email: string;
  sequence: number;
};