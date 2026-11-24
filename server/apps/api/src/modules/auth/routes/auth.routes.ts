import { Router } from "express";

import { AuthController } from "../controllers/auth.controller.js";

import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "../validators/auth.validator.js";

import { validate } from "../../../middleware/validate.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { asyncHandler } from "../../../shared/utils/async-handler.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(AuthController.register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(AuthController.login)
);

router.post(
  "/refresh",
  validate(refreshSchema),
  asyncHandler(AuthController.refresh)
);

router.post(
  "/logout",
  validate(logoutSchema),
  asyncHandler(AuthController.logout)
);

router.get(
  "/me",
  authenticate,
  asyncHandler(AuthController.me)
);

export default router;