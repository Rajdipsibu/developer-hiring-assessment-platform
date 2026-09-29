import { Sequelize } from "sequelize";
import sequelize from "../config/database.js";
import Roles from "./Roles.js";
import User from "./Users.js";
import UserRole from "./UserRole.js";
import Permission from "./Permission.js";
import RolePermission from "./RolePermission.js";
import DeveloperProfile from "./DeveloperProfile.js";
import Company from "./Company.js";
//Associations

// User ↔ Role (Many-to-Many)
User.belongsToMany(Roles, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
});

Roles.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users",
});

//Role ↔ Permission
Roles.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions",
});

Permission.belongsToMany(Roles, {
  through: RolePermission,
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles",
});

// User ↔ DeveloperProfile
User.hasOne(DeveloperProfile, {
  foreignKey: "user_id",
  as: "developerProfile",
});

DeveloperProfile.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

export { 
  User, 
  Roles, 
  UserRole, 
  RolePermission, 
  DeveloperProfile, 
  Permission,
  Company,
  sequelize 
};
