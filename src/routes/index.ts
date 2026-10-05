import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";

import {
  registerUser,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Authentication routes
router.post("/auth/register", validate(registerSchema), registerUser);
router.post("/auth/login", login);
router.post("/auth/refresh-token", refreshToken);
router.post("/auth/logout", logout);

// Other routes (uncomment as features are implemented)
// router.post('/auth/forgot-password', forgotPassword);
// router.post('/auth/reset-password', resetPassword);
// router.post('/auth/verify-otp', verifyOtp);
// router.post('/auth/send-otp', sendOtp);
// router.get('/auth/profile', userPolicy, getProfile);
// router.patch('/auth/change-password', userPolicy, changePassword);

export default router;
