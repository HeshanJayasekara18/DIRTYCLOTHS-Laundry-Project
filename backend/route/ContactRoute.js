const express = require('express');

const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const {
    
    
   getAllContacts,
   createContact,
   deleteContact
} = require('../controller/ContactController');

// GET all bookings
router.get('/', getAllContacts);



// POST a new booking
router.post('/add', createContact);
router.delete('/delete/:id', deleteContact);





module.exports = router;
