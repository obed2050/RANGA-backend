const sequelize = require('../config/database');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const User = require('../models/User');
const Notification = require('../models/Notification');

const normalizeOrder = (o) => ({
  _id: String(o.id),
  id: o.id,
  total: o.totalAmount,
  totalAmount: o.totalAmount,
  status: o.status,
  deliveryAddress: o.deliveryAddress,
  notes: o.notes,
  buyerId: o.buyerId,
  createdAt: o.createdAt,
  items: (o.items || []).map((item) => ({
    title: item.product?.name || 'Product',
    name: item.product?.name || 'Product',
    price: Number(item.unitPrice),
    quantity: item.quantity,
    image: Array.isArray(item.product?.images) ? item.product.images[0] : (item.product?.images || null),
    productId: item.productId,
  })),
});

exports.placeOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, deliveryAddress, notes } = req.body;
    let totalAmount = 0;
    const orderItems = [];
    const sellerNotifications = {};

    for (const item of items) {
      const product = await Product.findByPk(item.productId, {
        include: [{ model: Shop, as: 'shop' }],
        transaction: t,
      });
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

      totalAmount += Number(product.price) * item.quantity;
      orderItems.push({ productId: product.id, quantity: item.quantity, unitPrice: product.price });
      await product.update({ stock: product.stock - item.quantity }, { transaction: t });

      const sellerId = product.shop.userId;
      if (!sellerNotifications[sellerId]) sellerNotifications[sellerId] = [];
      sellerNotifications[sellerId].push(product.name);
    }

    const order = await Order.create(
      { totalAmount, deliveryAddress, notes, buyerId: req.user.id },
      { transaction: t }
    );

    for (const oi of orderItems) {
      await OrderItem.create({ ...oi, orderId: order.id }, { transaction: t });
    }

    for (const [sellerId, productNames] of Object.entries(sellerNotifications)) {
      await Notification.create({
        userId: parseInt(sellerId),
        type: 'new_order',
        title: 'New Order Received!',
        message: `You have a new order for: ${productNames.join(', ')}`,
        referenceId: order.id,
      }, { transaction: t });
    }

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });

    res.status(201).json(normalizeOrder(fullOrder.toJSON()));
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { buyerId: req.user.id },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders.map((o) => normalizeOrder(o.toJSON())));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({ where: { userId: req.user.id } });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const products = await Product.findAll({ where: { shopId: shop.id }, attributes: ['id'] });
    const productIds = products.map((p) => p.id);

    const orderItems = await OrderItem.findAll({
      where: { productId: productIds },
      include: [
        { model: Order, as: 'order', include: [{ model: User, as: 'buyer', attributes: ['id', 'name', 'phone', 'email'] }] },
        { model: Product, as: 'product' },
      ],
      order: [['id', 'DESC']],
    });

    res.json(orderItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.update({ status: req.body.status });

    await Notification.create({
      userId: order.buyerId,
      type: 'order_delivered',
      title: 'Order Status Updated',
      message: `Your order #${order.id} status changed to: ${req.body.status}`,
      referenceId: order.id,
    });

    res.json(normalizeOrder(order.toJSON()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
