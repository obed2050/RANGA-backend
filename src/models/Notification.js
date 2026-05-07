const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.ENUM('new_order', 'order_cancelled', 'order_delivered', 'general'), defaultValue: 'general' },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  referenceId: { type: DataTypes.INTEGER },
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'notifications', timestamps: true });

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

module.exports = Notification;
