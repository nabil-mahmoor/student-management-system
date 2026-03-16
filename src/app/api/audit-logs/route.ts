import { readHandler } from "@/src/lib/api-handler";
import { auditService } from "@/src/services/audit";

// GET /api/audit-logs
// Optional query params: ?entity=STUDENT&entityId=1 to filter by record
export const GET = readHandler(async ({ req }) => {
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity") as
    | "STUDENT"
    | "COURSE"
    | "ENROLLMENT"
    | null;
  const entityId = searchParams.get("entityId");

  if (entity && entityId) {
    return auditService.getByEntity(entity, Number(entityId));
  }

  return auditService.getAll();
});

// Audit logs are immutable — no POST, PUT, or DELETE routes