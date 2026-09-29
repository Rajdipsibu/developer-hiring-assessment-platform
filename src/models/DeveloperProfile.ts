import {
  DataTypes,
  Model,
  type Optional,
} from "sequelize";

import sequelize from "../config/database.js";

interface DeveloperProfileAttributes {
  id: number;
  user_id: number;
  first_name: string;
  last_name?: string;
  phone?: string;
  headline?: string;
  bio?: string;
  location?: string;
  experience_years?: number;
  resume_url?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  status?: boolean;
  is_deleted?: boolean;
}

export interface DeveloperProfileCreationAttributes
  extends Optional<
    DeveloperProfileAttributes,
    | "id"
    | "last_name"
    | "phone"
    | "headline"
    | "bio"
    | "location"
    | "experience_years"
    | "resume_url"
    | "github_url"
    | "linkedin_url"
    | "portfolio_url"
    | "status"
    | "is_deleted"
  > {}

class DeveloperProfile
  extends Model<
    DeveloperProfileAttributes,
    DeveloperProfileCreationAttributes
  >
  implements DeveloperProfileAttributes
{
  public id!: number;
  public user_id!: number;
  public first_name!: string;
  public last_name?: string;
  public phone?: string;
  public headline?: string;
  public bio?: string;
  public location?: string;
  public experience_years?: number;
  public resume_url?: string;
  public github_url?: string;
  public linkedin_url?: string;
  public portfolio_url?: string;
  public status?: boolean;
  public is_deleted?: boolean;
}

DeveloperProfile.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    headline: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    experience_years: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
    },

    resume_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    github_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    linkedin_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    portfolio_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "developer_profiles",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default DeveloperProfile;