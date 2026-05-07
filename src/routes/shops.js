const router = require('express').Router();
const { createShop, getMyShop, getShop, getAllShops, updateShop, deleteShop } = require('../controllers/shopController');
const { auth, isAllowed } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: Seller shops
 */

/**
 * @swagger
 * /api/shops:
 *   get:
 *     tags: [Shops]
 *     summary: Get all active shops
 *     security: []
 *     responses:
 *       200:
 *         description: List of shops
 */
router.get('/', getAllShops);

/**
 * @swagger
 * /api/shops/mine:
 *   get:
 *     tags: [Shops]
 *     summary: Get my shop (seller)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My shop details
 */
router.get('/mine', auth, getMyShop);

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     tags: [Shops]
 *     summary: Get shop by ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shop details
 */
router.get('/:id', getShop);

/**
 * @swagger
 * /api/shops:
 *   post:
 *     tags: [Shops]
 *     summary: Create a shop (seller only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shop created
 */
router.post('/', auth, isAllowed('seller', 'admin'), createShop);

/**
 * @swagger
 * /api/shops/mine:
 *   put:
 *     tags: [Shops]
 *     summary: Update my shop (seller)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shop updated
 */
router.put('/mine', auth, isAllowed('seller', 'admin'), updateShop);

/**
 * @swagger
 * /api/shops/{id}:
 *   delete:
 *     tags: [Shops]
 *     summary: Delete a shop (seller owner or admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shop deleted
 */
router.delete('/:id', auth, isAllowed('seller', 'admin'), deleteShop);

module.exports = router;
