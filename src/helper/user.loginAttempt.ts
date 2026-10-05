import { LoginAttempt } from "../models/index.js";
import { type Request } from 'express';


export const recordLoginAttempt = async (
    email: string,
    status: "SUCCESS" | "FAILED",
    userId: number | null = null,
    failureReason: string | null = null,
    req?: Request
) => {
    try {
        const ip_address = (
            req?.ip ||
            req?.socket?.remoteAddress ||
            "127.0.0.1"
        ).slice(0, 45);
        const user_agent =
            (req?.headers?.["user-agent"] || null)?.slice(0, 500) || null;

        await LoginAttempt.create({
            user_id: userId,
            email,
            ip_address,
            user_agent,
            status,
            failure_reason: failureReason,
        });
    } catch (error) {
        console.error("Failed to record login attempt:", error);
    }
};