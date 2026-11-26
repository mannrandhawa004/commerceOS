import { z } from "zod";
import { currency, objectId, timezone, version } from "../../../shared/utils/management-validation.js";
const fields = z.object({ name: z.string().trim().min(1).max(120), slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100), currency, timezone }).strict();
export const createOrganization = z.object({ body: fields });
export const updateOrganization = z.object({ params: z.object({ id: objectId }), body: fields.partial().extend({ version }).strict() });
export const archiveOrganization = z.object({ params: z.object({ id: objectId }), body: z.object({ version }).strict() });
