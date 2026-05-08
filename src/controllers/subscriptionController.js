const Subscription = require('../models/Subscription');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

const PLANS = {
  basic:    { price: 5000,  label: 'Basic',    products: 10,   days: null, description: 'Upload up to 10 products' },
  standard: { price: 10000, label: 'Standard', products: 50,   days: null, description: 'Upload up to 50 products' },
  premium:  { price: 20000, label: 'Premium',  products: 9999, days: 30,   description: 'Unlimited products for 30 days' },
};

const getProductCount = async (userId) => {
  const shop = await Shop.findOne({ where: { userId } });
  if (!shop) return 0;
  return Product.count({ where: { shopId: shop.id } });
};

const checkValid = async (sub, userId) => {
  if (!sub || sub.status !== 'active') return false;
  if (sub.plan === 'premium') return new Date(sub.endDate) > new Date();
  const count = await getProductCount(userId);
  return count < PLANS[sub.plan].products;
};

exports.getMySubscription = async (req, res) => {
  try {
    let sub = await Subscription.findOne({
      where: { userId: req.user.id, status: 'active' },
      order: [['createdAt', 'DESC']],
    });

    if (sub) {
      const valid = await checkValid(sub, req.user.id);
      if (!valid) {
        await sub.update({ status: 'expired' });
        sub = null;
      }
    }

    if (!sub) return res.json(null);

    const productCount = await getProductCount(req.user.id);
    const planInfo = PLANS[sub.plan];

    res.json({
      ...sub.toJSON(),
      planInfo,
      productCount,
      productLimit: planInfo.products,
      remaining: Math.max(0, planInfo.products - productCount),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.canUpload = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      where: { userId: req.user.id, status: 'active' },
      order: [['createdAt', 'DESC']],
    });

    if (!sub) return res.json({ allowed: false, reason: 'no_subscription' });

    const valid = await checkValid(sub, req.user.id);
    if (!valid) {
      await sub.update({ status: 'expired' });
      const reason = sub.plan === 'premium' ? 'date_expired' : 'limit_reached';
      return res.json({ allowed: false, reason, plan: sub.plan });
    }

    const productCount = await getProductCount(req.user.id);
    const limit = PLANS[sub.plan].products;
    res.json({ allowed: true, plan: sub.plan, productCount, productLimit: limit, remaining: limit - productCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan' });

    await Subscription.update({ status: 'cancelled' }, { where: { userId: req.user.id, status: 'active' } });

    const startDate = new Date();
    const endDate = new Date();
    if (plan === 'premium') {
      endDate.setDate(endDate.getDate() + 30);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 10); // controlled by product count
    }

    const sub = await Subscription.create({
      userId: req.user.id, plan, price: PLANS[plan].price,
      status: 'active', startDate, endDate,
    });

    res.status(201).json({ subscription: sub, plan: PLANS[plan] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPlans = async (req, res) => res.json(PLANS);

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.findAll({
      include: [{ association: 'user', attributes: ['id', 'fullName', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
