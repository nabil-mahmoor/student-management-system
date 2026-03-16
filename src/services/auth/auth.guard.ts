import { NextRequest } from "next/server";
import { auth } from "./auth.config";

export async function requireAdmin(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) throw new Error("Unauthorized");
  return { userId: session.user.id };
}