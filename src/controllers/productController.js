const { Op } = require('sequelize');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const Category = require('../models/Category');

const getSellerShop = async (userId) => Shop.findOne({ where: { userId } });

const normalize = (p) => {
  // images can be stored as JSON string or array
  let imagesArr = [];
  if (Array.isArray(p.images)) {
    imagesArr = p.images;
  } else if (typeof p.images === 'string') {
    try { imagesArr = JSON.parse(p.images); } catch { imagesArr = [p.images]; }
  }
  const imageUrl = imagesArr[0] || null;

  return {
    _id: String(p.id),
    id: p.id,
    title: p.name,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    status: p.status,
    categoryId: p.categoryId,
    shopId: p.shopId,
    image: imageUrl,
    images: imagesArr,
    category: p.category?.name || '',
    location: p.shop?.location || '',
    phone: p.shop?.phone || '',
    sellerName: p.shop?.name || '',
    seller: p.shop ? { name: p.shop.name, phone: p.shop.phone, address: p.shop.location } : null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

exports.getAll = async (req, res) => {
  try {
    const { shopId, categoryId, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
    const where = { status: 'available' };
    if (shopId) where.shopId = shopId;
    if (categoryId) where.categoryId = categoryId;
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Shop, as: 'shop', attributes: ['id', 'name', 'logo', 'phone', 'location'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: rows.map((p) => normalize(p.toJSON())),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Shop, as: 'shop' },
        { model: Category, as: 'category' },
      ],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(normalize(product.toJSON()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const shop = await getSellerShop(req.user.id);
    if (!shop) return res.status(400).json({ message: 'Create a shop first' });
    const product = await Product.create({ ...req.body, shopId: shop.id });
    const full = await Product.findByPk(product.id, {
      include: [{ model: Shop, as: 'shop' }, { model: Category, as: 'category' }],
    });
    res.status(201).json(normalize(full.toJSON()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const shop = await getSellerShop(req.user.id);
    if (!shop) return res.status(400).json({ message: 'Shop not found' });
    const product = await Product.findOne({ where: { id: req.params.id, shopId: shop.id } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    const full = await Product.findByPk(product.id, {
      include: [{ model: Shop, as: 'shop' }, { model: Category, as: 'category' }],
    });
    res.json(normalize(full.toJSON()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Shop, as: 'shop' }],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (req.user.role !== 'admin') {
      const shop = await getSellerShop(req.user.id);
      if (!shop || product.shopId !== shop.id)
        return res.status(403).json({ message: 'Access denied' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
