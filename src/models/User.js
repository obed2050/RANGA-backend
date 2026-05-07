const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM('buyer', 'seller', 'admin'), defaultValue: 'buyer' },
  avatar: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  gender: { type: DataTypes.ENUM('male', 'female', 'other') },
}, { tableName: 'users', timestamps: true });

module.exports = User;
