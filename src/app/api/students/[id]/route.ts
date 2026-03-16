import { mutationHandler, readHandler } from "@/src/lib/api-handler";
import { updateStudentSchema, studentService } from "@/src/services/student";

// GET /api/students/:id
export const GET = readHandler(async ({ params }) => {
  return studentService.getById(Number(params!.id));
});

// PUT /api/students/:id
export const PUT = mutationHandler(async ({ req, params }) => {
  const body = updateStudentSchema.parse(await req.json());
  const { before, after } = await studentService.update(
    Number(params!.id),
    body,
  );

  return {
    action: "UPDATE",
    entity: "STUDENT",
    entityId: Number(params!.id),
    changes: { before, after },
    data: after,
  };
});

// DELETE /api/students/:id
export const DELETE = mutationHandler(async ({ params }) => {
  const student = await studentService.delete(Number(params!.id));

  return {
    action: "DELETE",
    entity: "STUDENT",
    entityId: Number(params!.id),
    changes: { before: student },
    data: { success: true },
  };
});