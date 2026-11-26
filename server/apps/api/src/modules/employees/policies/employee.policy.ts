import { AppError } from "../../../shared/errors/app-error.js";
export function preventSelfChange(actorId: string, targetId: string) {
  if (actorId === targetId) throw new AppError("You cannot change your own account or assignments here", 403, "FORBIDDEN");
}
