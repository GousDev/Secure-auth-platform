import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,      // e.g., smtp.gmail.com
    port: process.env.SMTP_PORT,      // 465 for SSL or 587 for TLS
    secure: process.env.SMTP_SECURE === "true", // true for 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendEmail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `Secure Auth Platform <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    })
};

