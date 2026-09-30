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
  sequelize,
};