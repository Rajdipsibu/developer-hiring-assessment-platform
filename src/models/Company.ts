import {
  DataTypes,
  Model,
  type Optional,
} from "sequelize";

import sequelize from "../config/database.js";

type VerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

interface CompanyAttributes {
  id: number;
  name: string;
  email: string;
  website?: string;
  description?: string;
  industry?: string;
  company_size?: string;
  logo_url?: string;
  location?: string;
  verification_status: VerificationStatus;
  status?: boolean;
  is_deleted?: boolean;
}

export interface CompanyCreationAttributes
  extends Optional<
    CompanyAttributes,
    | "id"
    | "website"
    | "description"
    | "industry"
    | "company_size"
    | "logo_url"
    | "location"
    | "verification_status"
    | "status"
    | "is_deleted"
  > {}

class Company
  extends Model<
    CompanyAttributes,
    CompanyCreationAttributes
  >
  implements CompanyAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public website?: string;
  public description?: string;
  public industry?: string;
  public company_size?: string;
  public logo_url?: string;
  public location?: string;
  public verification_status!: VerificationStatus;
  public status?: boolean;
  public is_deleted?: boolean;
}

Company.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    industry: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    company_size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    verification_status: {
      type: DataTypes.ENUM(
        "PENDING",
        "VERIFIED",
        "REJECTED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
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
    tableName: "companies",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Company;