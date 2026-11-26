import { z } from "zod";
import { objectId, version } from "../../../shared/utils/management-validation.js";
const fields = z.object({ code: z.string().trim().min(1).max(40).toUpperCase(), name: z.string().trim().min(1).max(120), address: z.string().trim().min(1).max(500) }).strict();
export const createStore = z.object({ body: fields.extend({ organizationId: objectId }).strict() });
export const updateStore = z.object({ params: z.object({ id: objectId }), body: fields.partial().extend({ version }).strict() });
export const archiveStore = z.object({ params: z.object({ id: objectId }), body: z.object({ version }).strict() });
