import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { OtpVerification, User } from "../models/index.js";
import { getUserPolicies } from "../helper/user.policy.js";
import { recordLoginAttempt } from "../helper/user.loginAttempt.js";
import {
    userToken,
    refreshUserToken,
    revokeRefreshToken,
} from "../helper/user.token.js";
import { generateOTP, sendEmail } from "../helper/sendEmail.js";

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
        const result = await userToken(userData);

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

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "email is required !" })
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: "user not found !" })
    }
    const userData = user.dataValues;
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpData = await OtpVerification.create({
        user_id: userData.id,
        otp_hash: hashedOtp,
        purpose: 'PASSWORD_RESET',
        expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });
    await sendEmail({
        recipient: userData.email,
        subject: 'Password Reset',
        text: `Your OTP is ${otp}`
    });
    return res.status(200).json({ message: "OTP sent successfully !" })
}

export const verifyOtp = async (req: Request, res: Response) => {
    const { email, OTP } = req.body;
    if (!email || !OTP) {
        return res.status(400).json({ message: "email and OTP is required !" })
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: "user not found !" })
    }
    const otpData = await OtpVerification.findOne({ where: { user_id: user.dataValues.id, purpose: 'PASSWORD_RESET', used_at: null } });
    if (!otpData) {
        return res.status(404).json({ message: "otp not found !" })
    }
    const compareOtp = await bcrypt.compare(OTP, otpData.dataValues.otp_hash);
    if (!compareOtp) {
        return res.status(400).json({ message: "invalid otp !" })
    }
    if (otpData.dataValues.attempts > 3) {
        return res.status(400).json({ message: "otp attempts are exceeded !" })
    }
    if (otpData.dataValues.expires_at < new Date()) {
        return res.status(400).json({ message: "otp is expired !" })
    }
    //mark otp as used
    await OtpVerification.update({
        used_at: new Date(),
    }, { where: { user_id: user.dataValues.id, purpose: 'PASSWORD_RESET' } });
    return res.status(200).json({ message: "otp verified successfully !" })
}
//we have to think how to track the attempt of otp