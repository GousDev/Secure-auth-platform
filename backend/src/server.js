import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();


import "./config/db.js"

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
});
