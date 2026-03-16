import type { auth } from "./auth.config";

// Extract the session type without importing the runtime auth object.
// `import type` is erased at build time — it never bundles auth.config
// or anything it imports (prisma, pg, dns, etc.)
export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];