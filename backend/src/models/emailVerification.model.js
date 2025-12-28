import pool from "../config/db.js";

const EmailVerificationModel = {

    async create(userId, token) {
        const query = `
            INSERT INTO email_verification_tokens
            (user_id, token, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '24 hours')
        `;
        await pool.query(query, [userId, token]);
    },

    async findByToken(token) {
        const query = `
            SELECT user_id, token, expires_at FROM email_verification_tokens
            WHERE token = $1 AND expires_at > NOW()
        `;
        const { rows } = await pool.query(query, [token]);
        console.log(rows[0]);
        return rows[0];
    },

    async deleteByToken(token) {
        const query = `
            DELETE FROM email_verification_tokens 
            WHERE token = $1
        `;
        await pool.query(query, [token])
    }
}

export default EmailVerificationModel