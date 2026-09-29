import {
  DataTypes,
  Model,
  type Optional,
} from "sequelize";

import sequelize from "../config/database.js";

interface CompanyMemberAttributes {
  id: number;
  company_id: number;
  user_id: number;
  company_role: string;
  status: boolean;
  is_deleted: boolean;
}

export interface CompanyMemberCreationAttributes
  extends Optional<
    CompanyMemberAttributes,
    "id" | "status" | "is_deleted"
  > {}

class CompanyMember
  extends Model<
    CompanyMemberAttributes,
    CompanyMemberCreationAttributes
  >
  implements CompanyMemberAttributes
{
  public id!: number;
  public company_id!: number;
  public user_id!: number;
  public company_role!: string;
  public status!: boolean;
  public is_deleted!: boolean;
}

CompanyMember.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    company_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    company_role: {
      type: DataTypes.STRING(50),
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
    tableName: "company_members",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    indexes: [
      {
        unique: true,
        fields: ["company_id", "user_id"],
        name: "company_members_company_id_user_id_unique",
      },
    ],
  }
);

export default CompanyMember;