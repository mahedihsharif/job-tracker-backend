import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import {
  userLoginValidation,
  userRegisterValidation,
  userResetPasswordValidation,
} from "../users/user.validation";
import { AuthController } from "./auth.controller";

const router = Router();

const auth = checkAuth();

router.post(
  "/register",
  validateRequest(userRegisterValidation),
  AuthController.register,
);

router.post(
  "/login",
  validateRequest(userLoginValidation),
  AuthController.login,
);
router.post(
  "/reset-password",
  auth,
  validateRequest(userResetPasswordValidation),
  AuthController.resetPassword,
);
router.post("/refresh-token",AuthController.refreshToken)
router.post("/logout", auth, AuthController.logout);
router.get("/me", auth, AuthController.getMe);

export const AuthRoutes = router;
