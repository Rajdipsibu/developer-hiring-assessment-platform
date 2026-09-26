import { DataTypes, Model, type Optional } from "sequelize";

import sequelize from "../config/database.js";

interface UserRoleAttributes {
  id: number;
  user_id: number;
  role_id: number;
  status: boolean;
  is_deleted: boolean;
}

export interface UserRoleCreationAttributes extends Optional<
  UserRoleAttributes,
  "id" | "status" | "is_deleted"
> {}

class UserRole
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>
  implements UserRoleAttributes
{
  public id!: number;
  public user_id!: number;
  public role_id!: number;
  public status!: boolean;
  public is_deleted!: boolean;
}

UserRole.init(
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

    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "user_roles",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    indexes: [
      {
        unique: true,
        fields: ["user_id", "role_id"],
        name: "user_roles_user_id_role_id_unique",
      },
    ],
  },
);

export default UserRole;
