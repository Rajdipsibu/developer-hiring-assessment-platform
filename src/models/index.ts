import { Sequelize } from "sequelize";
import sequelize from "../config/database.js";
import Roles from "./Roles.js";
import User from "./Users.js";
import UserRole from "./UserRole.js";
//Associations

// User ↔ Role (Many-to-Many)
User.belongsToMany(Roles,{
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
})

Roles.belongsToMany(User,{
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users",
})

export {User,Roles,UserRole,sequelize}

