const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shop = require('./Shop');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  images: { type: DataTypes.JSON },
  status: { type: DataTypes.ENUM('available', 'out_of_stock', 'inactive'), defaultValue: 'available' },
  shopId: { type: DataTypes.INTEGER, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'products', timestamps: true });

Product.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Shop.hasMany(Product, { foreignKey: 'shopId', as: 'products' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

module.exports = Product;
