import { mutationHandler, readHandler } from "@/src/lib/api-handler";
import { createStudentSchema } from "@/src/services/student";
import { studentService } from "@/src/services/student";

// GET /api/students
export const GET = readHandler(async () => {
  return studentService.getAll();
});

// POST /api/students
export const POST = mutationHandler(async ({ req }) => {
  const body = createStudentSchema.parse(await req.json());
  const student = await studentService.create(body);

  return {
    action: "CREATE",
    entity: "STUDENT",
    entityId: student.id,
    changes: { after: student },
    data: student,
  };
});