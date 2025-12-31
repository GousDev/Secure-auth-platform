import pool from "../config/db.js";

const PasswordResetModel = {

    async create(userId, token) {
        const query = `
            INSERT INTO password_reset_tokens(user_id, token, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '15 minutes')
        `;
        await pool.query(query, [userId, token]);
    },

    async findValidToken(token) {
        const query = `
            SELECT * FROM password_reset_tokens 
            WHERE token = $1
            AND expires_at > NOW()
            AND used = false
        `;
        const { rows } = await pool.query(query, [token]);
        return rows[0];
    },


    async markUsed(token) {
        const query = `
            UPDATE password_reset_tokens
            SET used = true
            WHERE token = $1
        `;
        await pool.query(query, [token]);
    }
}

export default PasswordResetModel