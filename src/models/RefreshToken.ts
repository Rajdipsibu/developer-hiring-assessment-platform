import { DataTypes, Model, type Optional } from "sequelize";

import sequelize from "../config/database.js";

interface RefreshTokenAttributes {
    id: number;
    user_id: number;
    token_hash: string;
    expires_at: Date;
    revoked_at?: Date | null;
}

export interface RefreshTokenCreationAttributes
    extends Optional<
        RefreshTokenAttributes,
        "id" | "revoked_at"
    > { }

class RefreshToken
    extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes {
    public id!: number;
    public user_id!: number;
    public token_hash!: string;
    public expires_at!: Date;
    public revoked_at!: Date | null;
}

RefreshToken.init(
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

        token_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        revoked_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        }
    },
    {
        sequelize,
        tableName: "refresh_tokens",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",

        indexes: [
            {
                fields: ["user_id"],
                name: "refresh_tokens_user_id_index",
            },
            {
                fields: ["expires_at"],
                name: "refresh_tokens_expires_at_index",
            },
        ],
    }
);

export default RefreshToken;