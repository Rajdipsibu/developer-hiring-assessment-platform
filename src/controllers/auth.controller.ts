import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, LoginAttempt } from "../models/index.js";
import { getUserPolicies } from "../helper/user.policy.js";
import {
    user_token,
    refreshUserToken,
    revokeRefreshToken,
} from "../helper/user.token.js";

const recordLoginAttempt = async (
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

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existUser = await User.findOne({ where: { email } });
        if (existUser) {
            return res.status(400).json({ message: "user already exist !!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        if (!newUser) {
            return res.status(400).json({ message: "user not created !!" });
        }
        return res.status(200).json({ message: "user created successfully !!" });
    } catch (error: any) {
        return res.status(500).json({ message: "Something went wrong !!" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            await recordLoginAttempt(
                email || "unknown",
                "FAILED",
                null,
                "Missing email or password",
                req
            );
            return res.status(401).json({ message: "all fields are required  !" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            await recordLoginAttempt(
                email,
                "FAILED",
                null,
                "Invalid email or password",
                req
            );
            return res.status(401).json({ message: "invalid email and Password !" });
        }

        const compare = await bcrypt.compare(password, user.dataValues.password);
        if (!compare) {
            await recordLoginAttempt(
                email,
                "FAILED",
                user.dataValues.id,
                "Invalid email or password",
                req
            );
            return res.status(401).json({ message: "invalid email and Password !" });
        }

        const userStatus = user.dataValues.status;
        if (userStatus === "SUSPENDED") {
            await recordLoginAttempt(
                email,
                "FAILED",
                user.dataValues.id,
                "Account suspended",
                req
            );
            return res.status(401).json({
                message: "Your Account is SUSPENDED please contact your admin !",
            });
        }

        const policies = await getUserPolicies(user.dataValues.id);
        const userData = { id: user.dataValues.id, policies };
        const result = await user_token(userData);

        await recordLoginAttempt(email, "SUCCESS", user.dataValues.id, null, req);

        return res.status(200).json({
            message: "Login Successful",
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "internal server error !!" });
    }
};

export const loginUser = login;

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token =
            req.body?.refreshToken ||
            req.body?.token ||
            req.headers["x-refresh-token"];

        if (!token || typeof token !== "string") {
            return res.status(400).json({ message: "Refresh token is required !" });
        }

        const result = await refreshUserToken(token);

        return res.status(200).json({
            message: "Token refreshed successfully",
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error: any) {
        console.error("Refresh token error:", error);
        return res
            .status(401)
            .json({ message: error.message || "Invalid or expired refresh token !" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const token =
            req.body?.refreshToken ||
            req.body?.token ||
            req.headers["x-refresh-token"];

        if (token && typeof token === "string") {
            await revokeRefreshToken(token);
        }

        return res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "internal server error !!" });
    }
};
