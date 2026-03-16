import { mutationHandler, readHandler } from "@/src/lib/api-handler";
import { updateCourseSchema, courseService } from "@/src/services/course";

// GET /api/courses/:id
export const GET = readHandler(async ({ params }) => {
  return courseService.getById(Number(params!.id));
});

// PUT /api/courses/:id
export const PUT = mutationHandler(async ({ req, params }) => {
  const body = updateCourseSchema.parse(await req.json());
  const { before, after } = await courseService.update(
    Number(params!.id),
    body,
  );

  return {
    action: "UPDATE",
    entity: "COURSE",
    entityId: Number(params!.id),
    changes: { before, after },
    data: after,
  };
});

// DELETE /api/courses/:id
export const DELETE = mutationHandler(async ({ params }) => {
  const course = await courseService.delete(Number(params!.id));

  return {
    action: "DELETE",
    entity: "COURSE",
    entityId: Number(params!.id),
    changes: { before: course },
    data: { success: true },
  };
});