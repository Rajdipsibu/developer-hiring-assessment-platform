import { DataTypes, Model, type Optional } from "sequelize";

import sequelize from "../config/database.js";

interface OtpVerificationAttributes {
    id: number;
    user_id: number;
    otp_hash: string;
    purpose: string;
    expires_at: Date;
    attempts: number;
    used_at?: Date | null;
}

export interface OtpVerificationCreationAttributes
    extends Optional<
        OtpVerificationAttributes,
        "id" | "attempts" | "used_at"
    > { }

class OtpVerification
    extends Model<
        OtpVerificationAttributes,
        OtpVerificationCreationAttributes
    >
    implements OtpVerificationAttributes {
    public id!: number;
    public user_id!: number;
    public otp_hash!: string;
    public purpose!: string;
    public expires_at!: Date;
    public attempts!: number;
    public used_at!: Date | null;
}

OtpVerification.init(
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        otp_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        purpose: {
            type: DataTypes.ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'EMAIL_CHANGE', 'LOGIN', 'MFA'),
            allowNull: false,
        },

        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        attempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        used_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        }
    },
    {
        sequelize,
        tableName: "otp_verification",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",

        indexes: [
            {
                fields: ["user_id"],
                name: "otp_verification_user_id_index",
            },
            {
                fields: ["expires_at"],
                name: "otp_verification_expires_at_index",
            },
            {
                fields: ["user_id", "purpose"],
                name: "otp_verification_user_id_purpose_index",
            },
        ],
    }
);

export default OtpVerification;