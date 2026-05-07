const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Shop = sequelize.define('Shop', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  logo: { type: DataTypes.STRING },
  banner: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
}, { tableName: 'shops', timestamps: true });

Shop.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
User.hasOne(Shop, { foreignKey: 'userId', as: 'shop' });

module.exports = Shop;
