const { Op } = require('sequelize');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Category = require('../models/Category');

exports.getMyListings = async (req, res) => {
  req.query.sellerId = req.user.id;
  return exports.getAll(req, res);
};

exports.getAll = async (req, res) => {
  try {
    const { type, categoryId, location, minPrice, maxPrice, status, page = 1, limit = 10 } = req.query;
    const where = {};
    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (status) where.status = status;
    else where.status = 'active';
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const { count, rows } = await Listing.findAndCountAll({
      where,
      include: [
        { model: User, as: 'seller', attributes: ['id', 'fullName', 'phoneNumber', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({ total: count, page: parseInt(page), pages: Math.ceil(count / limit), data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [
        { model: User, as: 'seller', attributes: ['id', 'fullName', 'phoneNumber', 'avatar'] },
        { model: Category, as: 'category' },
      ],
    });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, price, type, location, categoryId, images } = req.body;
    const listing = await Listing.create({
      title, description, price, type, location, categoryId, subcategory, whatsapp, phone, mediaType, mediaUrl,
      sellerId: req.user.id,
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.sellerId !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    await listing.update(req.body);
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.sellerId !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    await listing.destroy();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
