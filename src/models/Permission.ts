import { DataTypes, Model, type Optional } from "sequelize";

import sequelize from "../config/database.js";

interface PermissionAttributes {
  id: number;
  name: string;
  module: string;
  action: string;
  description?: string;
  status: boolean;
  is_deleted: boolean;
}

export interface PermissionCreationAttributes extends Optional<
  PermissionAttributes,
  "id" | "description" | "status" | "is_deleted"
> {}

class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  public id!: number;
  public name!: string;
  public module!: string;
  public action!: string;
  public description?: string;
  public status!: boolean;
  public is_deleted!: boolean;  
}

Permission.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: "permissions",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Permission;
