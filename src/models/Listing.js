const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');

const Listing = sequelize.define('Listing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(15, 2) },
  currency: { type: DataTypes.STRING, defaultValue: 'RWF' },
  type: { type: DataTypes.ENUM('buy', 'sell', 'rent'), defaultValue: 'sell' },
  status: { type: DataTypes.ENUM('active', 'sold', 'rented', 'inactive'), defaultValue: 'active' },
  location: { type: DataTypes.STRING },
  images: { type: DataTypes.JSON },
  subcategory: { type: DataTypes.STRING },
  mediaType: { type: DataTypes.ENUM('image', 'video'), defaultValue: 'image' },
  mediaUrl: { type: DataTypes.TEXT },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  categoryId: { type: DataTypes.INTEGER },
  whatsapp: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
}, { tableName: 'listings', timestamps: true });

Listing.belongsTo(User, { foreignKey: 'userId', as: 'seller' });
Listing.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
User.hasMany(Listing, { foreignKey: 'userId' });
Category.hasMany(Listing, { foreignKey: 'categoryId' });

module.exports = Listing;
