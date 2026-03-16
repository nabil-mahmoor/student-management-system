import { mutationHandler, readHandler } from "@/src/lib/api-handler";
import { createCourseSchema, courseService } from "@/src/services/course";

// GET /api/courses
export const GET = readHandler(async () => {
  return courseService.getAll();
});

// POST /api/courses
export const POST = mutationHandler(async ({ req }) => {
  const body = createCourseSchema.parse(await req.json());
  const course = await courseService.create(body);

  return {
    action: "CREATE",
    entity: "COURSE",
    entityId: course.id,
    changes: { after: course },
    data: course,
  };
});