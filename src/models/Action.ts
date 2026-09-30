import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface ActionAttributes {
  id: number;
  name: string;
  code: string;
  created_at?: Date;
  updated_at?: Date;
}

interface ActionCreationAttributes
  extends Optional<
    ActionAttributes,
    "id"
  > {}

class Action
  extends Model<ActionAttributes, ActionCreationAttributes>
  implements ActionAttributes
{
  public id!: number;
  public name!: string;
  public code!: string;
}

Action.init(
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
    }
  },
  {
    sequelize,
    tableName: "actions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Action;