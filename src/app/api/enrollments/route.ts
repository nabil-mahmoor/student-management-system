import { mutationHandler, readHandler } from "@/src/lib/api-handler";
import {
  createEnrollmentSchema,
  enrollmentService,
} from "@/src/services/enrollment";

// GET /api/enrollments
// Optional query params: ?studentId=1 or ?courseId=2 to filter
export const GET = readHandler(async ({ req }) => {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const courseId = searchParams.get("courseId");

  if (studentId) return enrollmentService.getByStudent(Number(studentId));
  if (courseId) return enrollmentService.getByCourse(Number(courseId));
  return enrollmentService.getAll();
});

// POST /api/enrollments
export const POST = mutationHandler(async ({ req }) => {
  const body = createEnrollmentSchema.parse(await req.json());
  const enrollment = await enrollmentService.create(body);

  return {
    action: "CREATE",
    entity: "ENROLLMENT",
    entityId: enrollment.id,
    changes: { after: enrollment },
    data: enrollment,
  };
});