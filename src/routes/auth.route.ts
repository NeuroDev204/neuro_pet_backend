import { Router } from "express";
import {
    login,
    logout,
    me,
    register,
    resendOtp,
    verifyEmail
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    resendOtpSchema
} from "../validations/auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/resend-otp", validate(resendOtpSchema), resendOtp);
router.post("/login", validate(loginSchema), login);

router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
