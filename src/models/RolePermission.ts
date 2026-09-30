import { DataTypes, Model, type Optional } from "sequelize";

import sequelize from "../config/database.js";

interface RolePermissionAttributes {
  id: number;
  role_id: number;
  module_action_id: number;
  status: boolean;
  is_deleted: boolean;
}

export interface RolePermissionCreationAttributes
  extends Optional<
    RolePermissionAttributes,
    "id" | "status" | "is_deleted"
  > {}

class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  public id!: number;
  public role_id!: number;
  public module_action_id!: number;
  public status!: boolean;
  public is_deleted!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

RolePermission.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    module_action_id: {
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
    tableName: "role_permissions",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    indexes: [
      {
        unique: true,
        fields: ["role_id", "module_action_id"],
        name: "role_permissions_role_id_module_action_id_unique",
      },
    ],
  }
);

export default RolePermission;