import pool from "../config/db.js";

const PasswordResetOtpModel = {
    async create(userId, otp) {
        const query = `
      INSERT INTO password_reset_otps (user_id, otp, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
      RETURNING id
    `;
        const { rows } = await pool.query(query, [userId, otp]);
        return rows[0];
    },

    async findValidOtp(userId, otp) {
        const query = `
      SELECT * FROM password_reset_otps
      WHERE user_id = $1
        AND otp = $2
        AND is_used = false
        AND expires_at > NOW()
    `;
        const { rows } = await pool.query(query, [userId, otp]);
        return rows[0];
    },

    async markUsed(id) {
        const query = `
      UPDATE password_reset_otps
      SET is_used = true
      WHERE id = $1
    `;
        await pool.query(query, [id]);
    },

    async invalidateAll(userId) {
        const query = `
      UPDATE password_reset_otps
      SET is_used = true
      WHERE user_id = $1
    `;
        await pool.query(query, [userId]);
    }
};

export default PasswordResetOtpModel;
