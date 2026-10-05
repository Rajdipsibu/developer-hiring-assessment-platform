import sequelize from "../config/database.js";

import Roles from "./Roles.js";
import User from "./Users.js";
import UserRole from "./UserRole.js";
import Module from "./Module.js";
import Action from "./Action.js";
import ModuleAction from "./ModuleAction.js";
import RolePermission from "./RolePermission.js";
import DeveloperProfile from "./DeveloperProfile.js";
import Company from "./Company.js";
import RefreshToken from "./RefreshToken.js";
import OtpVerification from "./OtpVerification.js";
import LoginAttempt from "./LoginAttempt.js";

// =====================================================
// User ↔ Role
// Many-to-Many
// =====================================================

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

// =====================================================
// Role ↔ ModuleAction
// Many-to-Many
// =====================================================

Roles.belongsToMany(ModuleAction, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "module_action_id",
  as: "moduleActions",
});

ModuleAction.belongsToMany(Roles, {
  through: RolePermission,
  foreignKey: "module_action_id",
  otherKey: "role_id",
  as: "roles",
});

RolePermission.belongsTo(Roles, {
  foreignKey: "role_id",
  as: "role",
});

Roles.hasMany(RolePermission, {
  foreignKey: "role_id",
  as: "rolePermissions",
});

RolePermission.belongsTo(ModuleAction, {
  foreignKey: "module_action_id",
  as: "moduleAction",
});

ModuleAction.hasMany(RolePermission, {
  foreignKey: "module_action_id",
  as: "rolePermissions",
});

UserRole.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(UserRole, {
  foreignKey: "user_id",
  as: "userRoles",
});

UserRole.belongsTo(Roles, {
  foreignKey: "role_id",
  as: "role",
});

Roles.hasMany(UserRole, {
  foreignKey: "role_id",
  as: "userRoles",
});

// =====================================================
// Module ↔ ModuleAction
// One-to-Many
// =====================================================

Module.hasMany(ModuleAction, {
  foreignKey: "module_id",
  as: "moduleActions",
});

ModuleAction.belongsTo(Module, {
  foreignKey: "module_id",
  as: "module",
});

// =====================================================
// Action ↔ ModuleAction
// One-to-Many
// =====================================================

Action.hasMany(ModuleAction, {
  foreignKey: "action_id",
  as: "moduleActions",
});

ModuleAction.belongsTo(Action, {
  foreignKey: "action_id",
  as: "action",
});

// =====================================================
// User ↔ DeveloperProfile
// One-to-One
// =====================================================

User.hasOne(DeveloperProfile, {
  foreignKey: "user_id",
  as: "developerProfile",
});

DeveloperProfile.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});


User.hasMany(RefreshToken, {
  foreignKey: "user_id",
  as: "refreshTokens",
});

RefreshToken.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(OtpVerification, {
  foreignKey: "user_id",
  as: "otpVerifications",
});

OtpVerification.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(LoginAttempt, {
  foreignKey: "user_id",
  as: "loginAttempts",
});

LoginAttempt.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// =====================================================
// Exports
// =====================================================

export {
  User,
  Roles,
  UserRole,
  Module,
  Action,
  ModuleAction,
  RolePermission,
  DeveloperProfile,
  Company,
  RefreshToken,
  OtpVerification,
  LoginAttempt,
  sequelize,
};