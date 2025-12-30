import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken, generateSecureToken } from "../utils/token.util.js";
import EmailVerificationModel from "../models/emailverification.model.js";
import RefreshTokenModel from "../models/refreshToken.model.js";



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

            const passwordHash = await bcrypt.hash(password, 10);

            const user = await UserModel.createUser({
                name,
                email,
                passwordHash
            })

            // Generate  Verification Token
            const verificationToken = generateSecureToken();

            await EmailVerificationModel.create(user.id, verificationToken);

            console.log(`
                Verify your email:
                http://localhost:4000/api/auth/verify-email?token=${encodeURIComponent(verificationToken)}
            `);

            return res.status(201).json({
                success: true,
                message: "User registered. Please verify your email",
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
    static verifyEmail = async (req, res) => {
        try {

            const token = req.query.token;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: "Verification token missing"
                });
            }


            const record = await EmailVerificationModel.findByToken(token);

            console.log("Verification DB result:", record);

            if (!record) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired verification token"
                });
            }

            await UserModel.verifyEmail(record.user_id);

            await EmailVerificationModel.deleteByToken(token);

            return res.status(201).json({
                success: true,
                message: "Email verified successfully."
            });

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

            // const token = jwt.sign(
            //     { userId: user.id, email: user.email, role: user.role },
            //     process.env.JWT_ACCESS_SECRET,
            //     { expiresIn: "1h" }
            // )
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken();

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            await RefreshTokenModel.create(user.id, refreshToken, expiresAt);

            return res.status(200).json({
                success: true,
                message: "Login successful",
                accessToken,
                refreshToken
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

            console.log(userId);

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
                    is_email_verified: user.is_email_verified,
                    created_at: user.created_at
                }
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetched profile"
            })
        }
    }

    // ################################################

    static refresh = async (req, res) => {
        try {
            const { refreshToken } = req.body;

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

            res.json({
                success: true,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Token refresh failed"
            });
        }
    };


}
export default authController 