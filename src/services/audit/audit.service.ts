import "server-only";
import { auditRepository } from "./audit.repository";
import type { LogActionInput } from "./audit.types";

export const auditService = {
  // Called automatically by api-handler.ts after every mutation.
  // Never called manually from routes or other services.
  log(input: LogActionInput) {
    return auditRepository.create(input);
  },

  getAll() {
    return auditRepository.findAll();
  },

  getByEntity(entity: "STUDENT" | "COURSE" | "ENROLLMENT", entityId: number) {
    return auditRepository.findByEntity(entity, entityId);
  },
};
