import pool from "../config/db.js";

const EmailVerificationOtpModel = {

    async create({ userId, otp, expiresAt }) {
        const query = `
            INSERT INTO email_verification_otps (user_id, otp, expires_at)
            VALUES ($1, $2, $3)
        `;
        await pool.query(query, [userId, otp, expiresAt]);
    },

    async findValidOtp(userId, otp) {
        const query = `
            SELECT * FROM email_verification_otps
            WHERE user_id = $1
              AND otp = $2
              AND expires_at > NOW()
        `;
        const { rows } = await pool.query(query, [userId, otp]);
        return rows[0];
    },

    async deleteByUser(userId) {
        const query = `
            DELETE FROM email_verification_otps
            WHERE user_id = $1
        `;
        await pool.query(query, [userId]);
    }
}

export default EmailVerificationOtpModel;
