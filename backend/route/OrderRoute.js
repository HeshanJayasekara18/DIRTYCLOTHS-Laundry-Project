const express = require('express');

const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const {
    
    addOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getOrder
} = require('../controller/OrderController');

// GET all bookings
router.get('/', getAllOrders);

// GET a booking by ID
router.get('/:id', getOrder);

// POST a new booking
router.post('/',verifyToken, addOrder);

// PUT (update) a booking by ID
router.put('/:id', updateOrder);

// DELETE a booking by ID
router.delete('/:id', deleteOrder);



module.exports = router;
