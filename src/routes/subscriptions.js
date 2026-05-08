const router = require('express').Router();
const { getMySubscription, subscribe, getPlans, getAllSubscriptions, canUpload } = require('../controllers/subscriptionController');
const { auth, isAllowed } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Seller subscription management
 */

/**
 * @swagger
 * /api/subscriptions/plans:
 *   get:
 *     tags: [Subscriptions]
 *     summary: Get all available plans
 *     security: []
 *     responses:
 *       200:
 *         description: List of plans
 */
router.get('/plans', getPlans);

/**
 * @swagger
 * /api/subscriptions/mine:
 *   get:
 *     tags: [Subscriptions]
 *     summary: Get my active subscription
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active subscription or null
 */
router.get('/mine', auth, getMySubscription);

/**
 * @swagger
 * /api/subscriptions/can-upload:
 *   get:
 *     tags: [Subscriptions]
 *     summary: Check if seller can upload more products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Upload permission status
 */
router.get('/can-upload', auth, canUpload);

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     tags: [Subscriptions]
 *     summary: Subscribe to a plan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [plan]
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [basic, standard, premium]
 *     responses:
 *       201:
 *         description: Subscription created
 */
router.post('/', auth, isAllowed('seller', 'admin'), subscribe);

/**
 * @swagger
 * /api/subscriptions/all:
 *   get:
 *     tags: [Subscriptions]
 *     summary: Get all subscriptions (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All subscriptions
 */
router.get('/all', auth, isAllowed('admin'), getAllSubscriptions);

module.exports = router;
