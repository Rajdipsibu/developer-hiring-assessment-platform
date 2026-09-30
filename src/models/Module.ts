import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface ModuleAttributes {
  id: number;
  name: string;
  code: string;
  status: boolean;
  is_deleted: boolean;
}

interface ModuleCreationAttributes
  extends Optional<
    ModuleAttributes,
    "id" | "status" | "is_deleted"
  > {}

class Module
  extends Model<ModuleAttributes, ModuleCreationAttributes>
  implements ModuleAttributes
{
  public id!: number;
  public name!: string;
  public code!: string;
  public status!: boolean;
  public is_deleted!: boolean;
}

Module.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
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
    tableName: "modules",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Module;