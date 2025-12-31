import pool from "../config/db.js";

const UserModel = {

    async findByEmail(email) {
        const query = `SELECT * FROM users where email=$1`;
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    },

    async findById(Id) {
        const query = `SELECT * FROM users where id=$1`;
        const { rows } = await pool.query(query, [Id]);
        return rows[0];
    },

    async createUser({ name, email, passwordHash }) {
        const query = `
                    INSERT INTO users(name, email , password_hash)
                    VALUES ($1,$2,$3)
                    RETURNING id, name, email, role, is_email_verified, created_at
                    `;
        const values = [name, email, passwordHash];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async verifyEmail(userId) {
        const query = `
            UPDATE users
            SET is_email_verified = true, updated_at = NOW()
            WHERE id=$1
        `;
        await pool.query(query, [userId]);
    },

    async incrementFailedAttempts(userId) {
        const query = `
            UPDATE users 
            SET failed_login_attempts = failed_login_attempts + 1
            WHERE id = $1    
        `;
        await pool.query(query, [userId]);
    },

    async resetFailedAttempts(userId) {
        const query = `
            UPDATE users 
            SET failed_login_attempts = 0, locked_until = NULL
            WHERE id = $1
        `;
        await pool.query(query, [userId]);
    },

    async lockAccount(userId) {
        const query = `
            UPDATE users
            SET locked_until = NOW() + INTERVAL '15 minutes'
            WHERE id = $1
        `;
        await pool.query(query, [userId]);
    },

    async updatePassword(userId, hashedPassword) {
        const query = `
            UPDATE users
            SET password = $1 
            WHERE id = $2
        `;
        await pool.query(query, [hashedPassword, userId]);
    }
}

export default UserModel