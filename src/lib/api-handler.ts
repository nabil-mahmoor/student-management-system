// src/lib/api-handler.ts
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/services/auth/auth.guard";
import { auditService } from "@/src/services/audit";
import { successResponse, errorResponse } from "./api-response";

type HandlerContext = {
  req: NextRequest;
  session: { userId: string };
  params?: Record<string, string>;
};

type MutationResult = {
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: "STUDENT" | "COURSE" | "ENROLLMENT";
  entityId: number;
  changes?: object;
  data: unknown;
};

export function readHandler(
  fn: (ctx: HandlerContext) => Promise<unknown>
) {
  return async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> } = {}) => {
    try {
      const session = await requireAdmin(req);
      const resolvedParams = params ? await params : undefined;
      const result = await fn({ req, session, params: resolvedParams });
      return successResponse(result);
    } catch (err: any) {
      return handleError(err);
    }
  };
}

export function mutationHandler(
  fn: (ctx: HandlerContext) => Promise<MutationResult>
) {
  return async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> } = {}) => {
    try {
      const session = await requireAdmin(req);
      const resolvedParams = params ? await params : undefined;
      const result = await fn({ req, session, params: resolvedParams });

      await auditService.log({
        action: result.action,
        entity: result.entity,
        entityId: result.entityId,
        performedBy: session.userId,
        changes: result.changes,
      });

      return successResponse(result.data, result.action === "CREATE" ? 201 : 200);
    } catch (err: any) {
      return handleError(err);
    }
  };
}

function handleError(err: Error) {
  if (err.message === "Unauthorized")
    return errorResponse("Unauthorized", 401);
  if (err.message.includes("not found"))
    return errorResponse(err.message, 404);
  if (err.message.includes("already"))
    return errorResponse(err.message, 409);
  console.error(err);
  return errorResponse("Internal server error", 500);
}