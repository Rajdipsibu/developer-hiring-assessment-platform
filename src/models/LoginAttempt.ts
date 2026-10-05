import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface LoginAttemptAttributes {
    id: number;
    user_id?: number | null;
    email: string;
    ip_address: string;
    user_agent?: string | null;
    status: "SUCCESS" | "FAILED";
    failure_reason?: string | null;
}

export interface LoginAttemptCreationAttributes
    extends Optional<
        LoginAttemptAttributes,
        "id" | "user_id" | "user_agent" | "failure_reason"
    > { }

class LoginAttempt
    extends Model<LoginAttemptAttributes, LoginAttemptCreationAttributes>
    implements LoginAttemptAttributes {
    public id!: number;
    public user_id!: number | null;
    public email!: string;
    public ip_address!: string;
    public user_agent!: string | null;
    public status!: "SUCCESS" | "FAILED";
    public failure_reason!: string | null;
}

LoginAttempt.init(
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        ip_address: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },

        user_agent: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },

        status: {
            type: DataTypes.ENUM("SUCCESS", "FAILED"),
            allowNull: false,
        },

        failure_reason: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        }
    },
    {
        sequelize,
        tableName: "login_attempts",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,

        indexes: [
            {
                fields: ["user_id"],
                name: "login_attempts_user_id_index",
            },
            {
                fields: ["email"],
                name: "login_attempts_email_index",
            },
            {
                fields: ["ip_address"],
                name: "login_attempts_ip_address_index",
            },
            {
                fields: ["created_at"],
                name: "login_attempts_created_at_index",
            },
        ],
    }
);

export default LoginAttempt;