export const sendResetEmail = async (email, token) => {
    const resetLink = `http://localhost:4000/reset-password?token=${token}`;
    console.log(`📧 Password reset link for ${email}: ${resetLink}`);
};
