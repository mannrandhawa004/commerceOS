import { z } from "zod";

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid identifier");
export const version = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
export const idParams = z.object({ params: z.object({ id: objectId }) });
export const timezone = z.string().min(1).max(100).refine((value) => {
  try { new Intl.DateTimeFormat("en", { timeZone: value }); return true; } catch { return false; }
}, "Invalid timezone");
export const currency = z.string().regex(/^[A-Za-z]{3}$/).transform((value) => value.toUpperCase());
