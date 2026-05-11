const router = require('express').Router();
const { getAll, getOne, create, update, remove, getMyListings } = require('../controllers/listingController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Listings
 *   description: Buy, Sell and Rent listings
 */

router.get('/my', auth, getMyListings);

/**
 * @swagger
 * /api/listings:
 *   get:
 *     tags: [Listings]
 *     summary: Get all listings with filters
 *     security: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [buy, sell, rent]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of listings
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/listings/{id}:
 *   get:
 *     tags: [Listings]
 *     summary: Get a single listing
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Listing details
 *       404:
 *         description: Listing not found
 */
router.get('/:id', getOne);

/**
 * @swagger
 * /api/listings:
 *   post:
 *     tags: [Listings]
 *     summary: Create a new listing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, price, type, categoryId]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [buy, sell, rent]
 *               location:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Listing created
 */
router.post('/', auth, create);

/**
 * @swagger
 * /api/listings/{id}:
 *   put:
 *     tags: [Listings]
 *     summary: Update a listing
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
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, sold, rented, inactive]
 *     responses:
 *       200:
 *         description: Listing updated
 */
router.put('/:id', auth, update);

/**
 * @swagger
 * /api/listings/{id}:
 *   delete:
 *     tags: [Listings]
 *     summary: Delete a listing
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
 *         description: Listing deleted
 */
router.delete('/:id', auth, remove);

module.exports = router;
