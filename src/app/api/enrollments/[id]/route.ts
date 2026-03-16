import { mutationHandler, readHandler } from "@/src/lib/api-handler";
import {
  updateEnrollmentSchema,
  enrollmentService,
} from "@/src/services/enrollment";

// GET /api/enrollments/:id
export const GET = readHandler(async ({ params }) => {
  return enrollmentService.getById(Number(params!.id));
});

// PUT /api/enrollments/:id
// Only used to update status: ACTIVE → DROPPED or ACTIVE → COMPLETED
export const PUT = mutationHandler(async ({ req, params }) => {
  const body = updateEnrollmentSchema.parse(await req.json());
  const { before, after } = await enrollmentService.update(
    Number(params!.id),
    body,
  );

  return {
    action: "UPDATE",
    entity: "ENROLLMENT",
    entityId: Number(params!.id),
    changes: { before, after },
    data: after,
  };
});

// DELETE /api/enrollments/:id
// Only allowed for DROPPED enrollments
export const DELETE = mutationHandler(async ({ params }) => {
  const enrollment = await enrollmentService.delete(Number(params!.id));

  return {
    action: "DELETE",
    entity: "ENROLLMENT",
    entityId: Number(params!.id),
    changes: { before: enrollment },
    data: { success: true },
  };
});