import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";

class authController {

    static register = async (req, res) => {
        console.log("register api hit")
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

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user
            })


        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "User registration failed"
            });
        }
    }


}
export default authController 