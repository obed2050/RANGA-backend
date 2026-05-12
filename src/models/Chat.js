const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Chat = sequelize.define('Chat', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text:     { type: DataTypes.TEXT, allowNull: false },
  from:     { type: DataTypes.ENUM('user', 'admin', 'support'), defaultValue: 'user' },
  userId:   { type: DataTypes.INTEGER, allowNull: true },
  senderName: { type: DataTypes.STRING },
}, { tableName: 'chats', timestamps: true });

Chat.belongsTo(User, { foreignKey: 'userId', as: 'sender' });

module.exports = Chat;
