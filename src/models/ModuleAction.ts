import { DataTypes, Model, type Optional } from "sequelize";

import sequelize from "../config/database.js";

interface ModuleActionAttributes {
  id: number;
  name: string;
  code: string;
  module_id: number;
  action_id: number;
  description?: string;
  status: boolean;
  is_deleted: boolean;
}

export interface ModuleActionCreationAttributes
  extends Optional<
    ModuleActionAttributes,
    "id" | "description" | "status" | "is_deleted"
  > {}

class ModuleAction
  extends Model<ModuleActionAttributes, ModuleActionCreationAttributes>
  implements ModuleActionAttributes
{
  public id!: number;
  public name!: string;
  public code!: string;
  public module_id!: number;
  public action_id!: number;
  public description?: string;
  public status!: boolean;
  public is_deleted!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModuleAction.init(
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
    },

    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    module_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    action_id: {
      type: DataTypes.BIGINT,
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
    }
  },
  {
    sequelize,
    tableName: "module_actions",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default ModuleAction;