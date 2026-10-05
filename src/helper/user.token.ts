import dotenv from "dotenv";
dotenv.config();
import jwt, { type JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import { RefreshToken, User } from "../models/index.js";
import { getUserPolicies } from "./user.policy.js";

const getJwtSecret = (): string => {
    return process.env.JWT_SECRET || "default_jwt_secret";
};

const getRefreshSecret = (): string => {
    return process.env.REFRESH_SECRET || "default_refresh_secret";
};

export const hashToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface UserTokenPayload {
    id: number;
    policies: string[];
}

export const user_token = async (
    userData: UserTokenPayload
): Promise<TokenResponse> => {
    const jwtSecret = getJwtSecret();
    const refreshSecret = getRefreshSecret();

    // Access token is stateless: we do NOT store it in the database
    const accessToken = jwt.sign(userData, jwtSecret, { expiresIn: "1h" });

    // Refresh token is stateful: we store its hash in the database
    const refreshToken = jwt.sign({ id: userData.id }, refreshSecret, {
        expiresIn: "7d",
    });

    const token_hash = hashToken(refreshToken);
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    try {
        await RefreshToken.create({
            user_id: userData.id,
            token_hash,
            expires_at,
            revoked_at: null,
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.error("Error storing refresh token:", error);
        throw error;
    }
};

export const refreshUserToken = async (
    rawRefreshToken: string
): Promise<TokenResponse> => {
    if (!rawRefreshToken) {
        throw new Error("Refresh token is required");
    }

    const refreshSecret = getRefreshSecret();

    let decoded: JwtPayload | string;
    try {
        decoded = jwt.verify(rawRefreshToken, refreshSecret);
    } catch (err: any) {
        throw new Error("Invalid or expired refresh token signature");
    }

    const userId =
        typeof decoded === "object" && decoded !== null
            ? (decoded as any).id
            : null;
    if (!userId) {
        throw new Error("Invalid refresh token payload");
    }

    const token_hash = hashToken(rawRefreshToken);

    // Check refresh token in database (active or not, expired or not)
    const tokenRecord = await RefreshToken.findOne({
        where: {
            user_id: userId,
            [Op.or]: [{ token_hash }, { token_hash: rawRefreshToken }],
        },
    });

    if (!tokenRecord) {
        throw new Error("Refresh token not found");
    }

    // Check if active (not revoked)
    if (tokenRecord.revoked_at) {
        throw new Error("Refresh token has been revoked");
    }

    // Check if not expired
    if (new Date(tokenRecord.expires_at) <= new Date()) {
        throw new Error("Refresh token has expired");
    }

    // Verify user existence and active status
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User associated with this token does not exist");
    }

    if (user.status === "SUSPENDED" || user.dataValues?.status === "SUSPENDED") {
        throw new Error("Your account is SUSPENDED, please contact your admin");
    }

    if (user.is_deleted || user.dataValues?.is_deleted) {
        throw new Error("User account has been deleted");
    }

    // Revoke old refresh token (token rotation)
    await tokenRecord.update({ revoked_at: new Date() });

    // Fetch latest policies for the user
    const policies = await getUserPolicies(user.id || user.dataValues.id);

    // Generate new access & refresh tokens and store the new refresh token
    const newTokens = await user_token({
        id: user.id || user.dataValues.id,
        policies,
    });

    return newTokens;
};

export const revokeRefreshToken = async (
    rawRefreshToken: string
): Promise<boolean> => {
    if (!rawRefreshToken) return false;
    const token_hash = hashToken(rawRefreshToken);

    const tokenRecord = await RefreshToken.findOne({
        where: {
            [Op.or]: [{ token_hash }, { token_hash: rawRefreshToken }],
        },
    });

    if (tokenRecord && !tokenRecord.revoked_at) {
        await tokenRecord.update({ revoked_at: new Date() });
        return true;
    }

    return false;
};

export default user_token;