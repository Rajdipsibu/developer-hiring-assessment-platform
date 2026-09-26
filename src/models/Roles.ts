import { DataTypes, Model, type Optional } from "sequelize";

import sequelize from "../config/database.js";

interface RolesAttributes {
  id: number;
  name: string;
  description?: string;
  status: boolean;
  is_deleted: boolean;
}

export interface RolesCreationAttributes extends Optional<
  RolesAttributes,
  "id" | "description" |"status"|"is_deleted"
> {}

class Roles
  extends Model<RolesAttributes, RolesCreationAttributes>
  implements RolesAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public status!: boolean;
  public is_deleted!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

Roles.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
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
    tableName: "roles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Roles;
