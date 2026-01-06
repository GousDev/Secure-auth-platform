import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authheader = req.headers.authorization;

        if (!authheader || !authheader.toLowerCase().startsWith("bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing"
            })
        }

        const token = authheader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }

}

export default authMiddleware

