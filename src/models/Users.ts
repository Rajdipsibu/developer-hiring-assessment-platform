import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

type UserStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
interface UserAttributes {
  id: number;
  name:string;
  email:string;
  password:string;
  is_verified:boolean;
  status:UserStatus;
  is_deleted:boolean;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'status' | 'is_verified'|'is_deleted'>{}

class User extends Model<UserAttributes,UserCreationAttributes>implements UserAttributes{
  public id!:number;
  public name!:string;
  public email!:string;
  public password!:string;
  public status!:UserStatus;
  public is_deleted!:boolean;
  public is_verified!:boolean;
}

User.init(
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name:{
      type: DataTypes.STRING,
      allowNull:false
    },   
    email:{
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },   
    password:{
      type: DataTypes.STRING,
      allowNull:false
    },       
    status:{
      type: DataTypes.ENUM('PENDING' , 'ACTIVE' , 'INACTIVE' , 'SUSPENDED'),
      allowNull:false,
      defaultValue:'PENDING'
    },    
    is_deleted:{
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },    
    is_verified:{
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    }    
  },
  {
    sequelize,
    tableName:"users",
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default User;