const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  deliveryAddress: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
  buyerId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'orders', timestamps: true });

Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
User.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });

module.exports = Order;
