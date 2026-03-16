import * as z from "zod";

export const createStudentSchema = z.object({
  studentId: z.string().min(1, "Please generate a student ID"),

  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[A-Za-z\s'-]+$/, "First name contains invalid characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Last name contains invalid characters"),

  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must not exceed 200 characters"),

  dob: z
    .string()
    .min(1, "Date of birth is required")
    .transform((val) => new Date(val))
    .refine((date) => date < new Date(), {
      message: "Date of birth must be in the past",
    })
    .refine(
      (date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 15 && age <= 100;
      },
      { message: "Student age must be between 15 and 100" },
    ),

  email: z.string().min(1, "Please generate a student email"),

  intake: z.enum(["INTAKE_40", "INTAKE_41", "INTAKE_42", "INTAKE_43"]),

  degree: z.enum(["BCS", "BSE", "BCE", "DBA", "BIT", "BIS"]),
});

export const updateStudentSchema = createStudentSchema
  .omit({ studentId: true })
  .partial();
