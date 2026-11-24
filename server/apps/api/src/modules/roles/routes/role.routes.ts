import { Router } from "express";

import { RoleController } from "../controllers/role.controller.js";

import { authenticate } from "../../../middleware/authenticate.js";
import { authorize } from "../../../middleware/authorize.js";
import { asyncHandler } from "../../../shared/utils/async-handler.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("roles.create"),
  asyncHandler(RoleController.create)
);

router.get(
  "/",
  authorize("roles.read"),
  asyncHandler(RoleController.getAll)
);

export default router;