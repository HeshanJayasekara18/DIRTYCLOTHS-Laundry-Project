const express = require('express');

const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const {
    
    
   getAllContacts,
   createContact
} = require('../controller/ContactController');

// GET all bookings
router.get('/', getAllContacts);



// POST a new booking
router.post('/', createContact);





module.exports = router;
