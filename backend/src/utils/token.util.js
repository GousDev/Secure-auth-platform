import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateSecureToken = () => {
    return crypto.randomBytes(32).toString("hex");
};


export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );
};

export const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString("hex");
};