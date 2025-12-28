import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import { generateSecureToken } from "../utils/token.util.js";
import EmailVerificationModel from "../models/emailverification.model.js";

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
            return res.status(500).json({
                success: false,
                message: "Email verification failed"
            })
        }

    }

}
export default authController 