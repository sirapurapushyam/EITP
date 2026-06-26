import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    }
});

export async function sendPasswordResetLink(email, token) {
    const resetUrl = `${env.CLIENT_URL}/reset-password/${token}`;
    await transporter.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "Reset your password",
        html: `
            <h2>Password Reset</h2>

            <p>You requested a password reset.</p>

            <a href="${resetUrl}">
                Reset Password
            </a>

            <p>This link expires in 1 hour.</p>

            <p>If you didn't request this, ignore this email.</p>
        `
    });
}