const Shop = require('../models/Shop');
const User = require('../models/User');

exports.createShop = async (req, res) => {
  try {
    const exists = await Shop.findOne({ where: { userId: req.user.id } });
    if (exists) return res.status(400).json({ message: 'You already have a shop' });

    const shop = await Shop.create({ ...req.body, userId: req.user.id });
    res.status(201).json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ where: { userId: req.user.id } });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getShop = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'avatar'] }],
    });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.findAll({
      where: { isActive: true },
      include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }],
    });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ where: { userId: req.user.id } });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    await shop.update(req.body);
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    // seller can only delete their own shop
    if (req.user.role !== 'admin' && shop.userId !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });
    await shop.destroy();
    res.json({ message: 'Shop deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
