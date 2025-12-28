import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();


import pool from "./config/db.js";

const PORT = process.env.PORT || 4000;

(async () => {
    const res = await pool.query("SELECT NOW()")
    console.log("DB Time :", res.rows[0])
})();


app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
});
