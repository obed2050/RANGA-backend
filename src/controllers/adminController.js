const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Category = require('../models/Category');
const bcrypt = require('bcryptjs');

const normalizeUser = (u) => ({
  id: u.id,
  name: u.fullName,
  fullName: u.fullName,
  email: u.email,
  phone: u.phoneNumber,
  phoneNumber: u.phoneNumber,
  whatsappNumber: u.whatsappNumber,
  role: u.role,
  avatar: u.avatar,
  location: u.location,
  gender: u.gender,
  createdAt: u.createdAt,
});

// ── USERS ──────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users.map(normalizeUser));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Shop, as: 'shop' }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(normalizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, fullName, email, password, phone, phoneNumber, role } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName: fullName || name, email, password: hashed, phoneNumber: phoneNumber || phone, role });
    res.status(201).json(normalizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, fullName, phone, phoneNumber, ...rest } = req.body;
    if (rest.password) rest.password = await bcrypt.hash(rest.password, 10);

    await user.update({
      ...rest,
      fullName: fullName || name || user.fullName,
      phoneNumber: phoneNumber || phone || user.phoneNumber,
    });
    res.json(normalizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id)
      return res.status(400).json({ message: 'Cannot delete yourself' });
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── SHOPS ──────────────────────────────────────────────
exports.getAllShopsAdmin = async (req, res) => {
  try {
    const shops = await Shop.findAll({
      include: [{ model: User, as: 'owner', attributes: ['id', 'fullName', 'email', 'phoneNumber'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(shops.map((s) => ({
      ...s.toJSON(),
      owner: s.owner ? { id: s.owner.id, name: s.owner.fullName, email: s.owner.email, phone: s.owner.phoneNumber } : null,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteShopAdmin = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    await shop.destroy();
    res.json({ message: 'Shop deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PRODUCTS ───────────────────────────────────────────
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Shop, as: 'shop', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProductAdmin = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── CATEGORIES ─────────────────────────────────────────
exports.getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['createdAt', 'DESC']] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
