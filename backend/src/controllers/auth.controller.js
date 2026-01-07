import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken, generateSecureToken } from "../utils/token.js";
import EmailVerificationOtpModel from "../models/emailVerificationOtp.model.js";
import RefreshTokenModel from "../models/refreshToken.model.js";
import { hashPassword } from "../utils/password.js";
import PasswordResetModel from "../models/passwordResetOtp.model.js";
import { sendEmail } from "../utils/mailer.js";
import { generateOtp } from "../utils/otp.js";
import PasswordResetOtpModel from "../models/passwordResetOtp.model.js";




class authController {

    // ################################################

    static register = async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                })
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format"
                });
            }

            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered"
                })
            }

            const passwordHash = await hashPassword(password);

            const user = await UserModel.createUser({
                name,
                email,
                passwordHash
            })

            // Generate  Verification Token
            const otp = generateOtp();

            await EmailVerificationOtpModel.create({
                userId: user.id,
                otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            });

            // await sendEmailVerificationOtp(email, otp);

            return res.status(201).json({
                success: true,
                message: "Otp sent to email. Please verify your email",
                // data: user
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "User registration failed"
            });
        }
    }

    // ################################################
    static verifyEmailOtp = async (req, res) => {
        try {

            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({
                    success: false,
                    message: "Email and OTP are required"
                });
            }

            // 1️⃣ Find the user
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email or OTP"
                });
            }

            const record = await EmailVerificationOtpModel.findValidOtp(user.id, otp);

            if (!record) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired OTP"
                });
            }

            await UserModel.verifyEmail(user.id);

            await EmailVerificationOtpModel.deleteByUser(user.id);

            return res.status(200).json({
                success: true,
                message: "Email verified successfully."
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Email verification failed"
            })
        }
    }


    // ################################################

    static login = async (req, res) => {
        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                })
            }

            const user = await UserModel.findByEmail(email);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                })
            }

            if (!user.is_active) {
                return res.status(403).json({
                    success: false,
                    message: "Account is disabled"
                })
            }

            if (!user.is_email_verified) {
                return res.status(403).json({
                    success: false,
                    message: "Please verify your email before logging in"
                })
            }

            if (user.locked_until && new Date(user.locked_until) > new Date()) {
                return res.status(403).json({
                    success: false,
                    message: "Account temporarily locked due to failed attempts"
                })
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password_hash
            );

            if (!isPasswordValid) {
                await UserModel.incrementFailedAttempts(user.id);

                if (user.failed_login_attempts + 1 >= 5) {
                    await UserModel.lockAccount(user.id);
                }

                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            await UserModel.resetFailedAttempts(user.id);

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken();

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            await RefreshTokenModel.create(user.id, refreshToken, expiresAt);

            // Send refresh token as HttpOnly cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            return res.status(200).json({
                success: true,
                message: "Login successful",
                accessToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });


        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Login failed"
            })
        }
    }


    // ################################################

    static getProfile = async (req, res) => {
        try {

            const userId = req.user.userId;

            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            return res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    is_email_verified: user.is_email_verified,
                    created_at: user.created_at
                }
            })

        } catch (error) {
            console.error("Get profile error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetched profile"
            })
        }
    }

    // ################################################

    static refresh = async (req, res) => {
        try {
            const refreshToken = req.cookies?.refreshToken;


            if (!refreshToken)
                return res.status(400).json({
                    message: "Refresh token required"
                });

            const storedToken = await RefreshTokenModel.findValid(refreshToken);

            if (!storedToken) {
                return res.status(401).json({
                    message: "Invalid refresh token"
                });
            }

            const user = await UserModel.findById(storedToken.user_id);

            await RefreshTokenModel.revoke(refreshToken);

            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken();

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            await RefreshTokenModel.create(user.id, newRefreshToken, expiresAt);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.json({
                success: true,
                accessToken: newAccessToken,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Token refresh failed"
            });
        }
    };


    // ################################################

    static logout = async (req, res) => {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (refreshToken) {

            }

            await RefreshTokenModel.revokeByToken(refreshToken);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });

            return res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Logout failed"
            });
        }
    };

    //   ################################################
    static logoutAll = async (req, res) => {
        try {
            const userId = req.user.userId;

            await RefreshTokenModel.revokeAllByUser(userId);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            });

            return res.status(200).json({
                success: true,
                message: "Logged out from all devices"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Logout failed"
            });
        }
    };

    // ################################################

    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.json({
                    message: "If the email exists, an OTP has been sent"
                });
            }

            const otp = generateOtp();

            await PasswordResetOtpModel.create(user.id, otp);

            await sendEmail({
                to: user.email,
                subject: "Reset Password OTP",
                html: `<p>Your password reset otp is <b> ${otp}</b></p>.
                <p>This OTP is valid for 5 minutes.</p>`
            })

            res.json({
                success: true,
                message: "If the email exists, OTP has been sent"
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false, message: "Server error"
            });
        }
    };

    // ################################################

    static verifyForgotOtp = async (req, res) => {
        try {
            const { email, otp } = req.body;

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(400).json({
                    message: "Invalid OTP"
                })
            }

            const validOtp = await PasswordResetOtpModel.findValidOtp(user.id, otp);
            if (!validOtp) {
                return res.status(400).json({
                    message: "Invalid or expired OTP"
                })
            }

            await PasswordResetOtpModel.markUsed(validOtp.id);

            await UserModel.setPasswordResetVerified(user.id, true);

            await PasswordResetOtpModel.invalidateAll(user.id);

            return res.json({
                success: true,
                message: "OTP verified successfully"
            })

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }

    // ################################################
    static resetPassword = async (req, res) => {
        try {
            const { email, newPassword } = req.body;

            const user = await UserModel.findByEmail(email);
            if (!user || !user.password_reset_verified) {
                return res.status(400).json({
                    message: "OTP verification required"
                })
            }

            const hashedPassword = await hashPassword(newPassword);

            await UserModel.updatePassword(user.id, hashedPassword);

            await UserModel.setPasswordResetVerified(user.id, false);

            await RefreshTokenModel.revokeAllByUser(user.id);


            res.json({
                success: true,
                message: "Password reset successfully"
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    };


}
export default authController 