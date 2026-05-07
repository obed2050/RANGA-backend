const router = require('express').Router();
const { getAll, create, remove } = require('../controllers/categoryController');
const { auth, isAllowed } = require('../middleware/auth');

const adminOnly = [auth, isAllowed('admin')];

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Listing categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     security: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a category (admin only)
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
router.post('/', adminOnly, create);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete a category (admin only)
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
router.delete('/:id', adminOnly, remove);

module.exports = router;
