import { Router } from "express";
import { z } from "zod";
import { PERMISSIONS } from "../../constants/permissions.js";
import { validate } from "../../../middleware/validate.js";

import { RoleController } from "../controllers/role.controller.js";

import { authenticate } from "../../../middleware/authenticate.js";
import { authorize } from "../../../middleware/authorize.js";
import { asyncHandler } from "../../../shared/utils/async-handler.js";

const router = Router();

const createRoleSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100),
    slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().max(500).optional(),
    permissions: z.array(z.enum(Object.values(PERMISSIONS))),
  }),
});

router.use(authenticate);

router.post(
  "/",
  authorize(PERMISSIONS.ROLE_CREATE),
  validate(createRoleSchema),
  asyncHandler(RoleController.create)
);

router.get(
  "/",
  authorize(PERMISSIONS.ROLE_READ),
  asyncHandler(RoleController.getAll)
);

export default router;