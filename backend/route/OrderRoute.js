const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const {
    addOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getAllOrdersAdmin, // Import the new function
    getOrder
} = require('../controller/OrderController');

// GET all orders for users (filtered by user email)
router.get('/', verifyToken, getAllOrders);

// GET all orders for admin (no filtering) - add this route
router.get('/admin/all', verifyToken, getAllOrdersAdmin);

// GET a order by ID
router.get('/:id', getOrder);

// POST a new order
router.post('/', verifyToken, addOrder);

// PUT (update) a order by ID
router.put('/:id', updateOrder);

// DELETE a order by ID
router.delete('/:id', deleteOrder);

module.exports = router;