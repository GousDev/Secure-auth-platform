import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.get('/verify-email-otp', authController.verifyEmailOtp);
router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/refresh-token', authController.refresh);
router.post('/logout', authController.logout);
router.post('/logout-all', authMiddleware, authController.logoutAll);
router.post('/forgot-password', authRateLimiter, authController.forgotPassword);
router.post('/verify-forgot-password-otp', authController.verifyForgotOtp);
router.post('/reset-password', authController.resetPassword);


export default router
