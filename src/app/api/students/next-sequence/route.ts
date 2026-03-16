import { readHandler } from "@/src/lib/api-handler";
import { studentService } from "@/src/services/student";

// GET /api/students/next-sequence?intake=INTAKE_41&degree=BSE
//
// Read-only preview — nothing is written to the DB.
// Called by the Generate button in StudentRegisterForm.
export const GET = readHandler(async ({ req }) => {
  const { searchParams } = new URL(req.url);
  const intake = searchParams.get("intake");
  const degree = searchParams.get("degree");

  if (!intake || !degree) {
    throw new Error("Both intake and degree query params are required");
  }

  return studentService.generateStudentId(intake, degree);
});