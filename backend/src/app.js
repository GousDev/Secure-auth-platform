import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import helmet from "helmet";

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true
}));

app.use(express.json());

app.use(helmet());

app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("Server is up");
});

export default app;
