const router = require('express').Router();
const {
  getAllUsers, getUser, createUser, updateUser, deleteUser,
  getAllShopsAdmin, deleteShopAdmin,
  getAllProductsAdmin, deleteProductAdmin,
  getAllCategoriesAdmin,
} = require('../controllers/adminController');
const { auth, isAllowed } = require('../middleware/auth');

const adminOrSeller = [auth, isAllowed('admin', 'seller')];
const adminOnly = [auth, isAllowed('admin')];

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin & Seller management endpoints
 */

// ── USERS ──────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (admin & seller)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', adminOrSeller, getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get user by ID (admin & seller)
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
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/users/:id', adminOrSeller, getUser);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     tags: [Admin]
 *     summary: Create a user (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [buyer, seller, admin]
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/users', adminOnly, createUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [buyer, seller, admin]
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/users/:id', adminOnly, updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a user (admin only)
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
 *         description: User deleted
 */
router.delete('/users/:id', adminOnly, deleteUser);

// ── SHOPS ──────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/shops:
 *   get:
 *     tags: [Admin]
 *     summary: Get all shops (admin & seller)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All shops including inactive
 */
router.get('/shops', adminOrSeller, getAllShopsAdmin);

/**
 * @swagger
 * /api/admin/shops/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete any shop (admin only)
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
router.delete('/shops/:id', adminOrSeller, deleteShopAdmin);

// ── PRODUCTS ───────────────────────────────────────────

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     tags: [Admin]
 *     summary: Get all products (admin & seller)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products
 */
router.get('/products', adminOrSeller, getAllProductsAdmin);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete any product (admin only)
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
 *         description: Product deleted
 */
router.delete('/products/:id', adminOrSeller, deleteProductAdmin);

// ── CATEGORIES ─────────────────────────────────────────

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     tags: [Admin]
 *     summary: Get all categories (admin & seller)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All categories
 */
router.get('/categories', adminOrSeller, getAllCategoriesAdmin);

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     tags: [Admin]
 *     summary: Create a category (admin & seller)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/categories', adminOrSeller, require('../controllers/categoryController').create);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a category (admin & seller)
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
 *         description: Category deleted
 */
router.delete('/categories/:id', adminOrSeller, require('../controllers/categoryController').remove);

module.exports = router;
