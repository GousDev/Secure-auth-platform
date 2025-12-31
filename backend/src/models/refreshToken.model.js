import pool from "../config/db.js";

const RefreshTokenModel = {

    async create(userId, token, expiresAt) {
        const query = `
            INSERT INTO refresh_tokens(user_id, token, expires_at)
            VALUES ($1, $2, $3)
        `;
        await pool.query(query, [userId, token, expiresAt]);
    },

    async findValid(token) {
        const query = `
            SELECT * FROM refresh_tokens
            WHERE token = $1
            AND revoked = false
            AND expires_at > NOW()
        `;
        const { rows } = await pool.query(query, [token]);
        return rows[0];
    },

    async revokeByToken(token) {
        const query = `
            UPDATE refresh_tokens
            SET revoked = true
            WHERE token = $1
            `;
        await pool.query(query, [token]);
    },

    async revokeAllByUser(userId) {
        const query = `
            UPDATE refresh_tokens
            SET revoked = true
            WHERE user_id = $1
            `;
        await pool.query(query, [userId]);

    }

}

export default RefreshTokenModel