import { z } from 'zod';
import { objectId } from '../../../shared/utils/management-validation.js';
export const createEmployee = z.object({
  body: z
    .object({
      firstName: z.string().trim().min(2).max(50),
      lastName: z.string().trim().min(2).max(50),
      email: z.string().trim().email().toLowerCase().max(254),
      password: z
        .string()
        .min(8)
        .refine(
          (value) => Buffer.byteLength(value, 'utf8') <= 72,
          'Password must be at most 72 bytes',
        ),
    })
    .strict(),
});
export const updateEmployee = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      firstName: z.string().trim().min(2).max(50).optional(),
      lastName: z.string().trim().min(2).max(50).optional(),
      status: z.enum(['active', 'inactive', 'blocked']).optional(),
    })
    .strict()
    .refine(
      (value) => Object.keys(value).length > 0,
      'Provide at least one field',
    ),
});
export const assignRole = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      roleId: objectId,
      scope: z.enum(['organization', 'store']),
      organizationId: objectId,
      storeIds: z.array(objectId).max(100).default([]),
    })
    .strict()
    .superRefine((value, ctx) => {
      if ((value.scope === 'store') !== value.storeIds.length > 0)
        ctx.addIssue({
          code: 'custom',
          message:
            'Store scope requires store IDs; organization scope cannot include them',
        });
      if (
        new Set(value.storeIds.map((id) => id.toLowerCase())).size !==
        value.storeIds.length
      )
        ctx.addIssue({ code: 'custom', message: 'Duplicate store IDs' });
    }),
});
export const assignmentParams = z.object({
  params: z.object({ id: objectId, assignmentId: objectId }),
});
