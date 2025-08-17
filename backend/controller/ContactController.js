const contact = require('../models/Contact');

const getAllContacts = async (req, res) => {
    try {
        const contacts = await contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
}

const createContact = async (req, res) => {
    try {
        const newContact = new contact(req.body);
        await newContact.save();
        res.status(201).json({ message: 'Contact created successfully', contact: newContact });
    } catch (error) {
        res.status(400).json({ message: 'Error creating contact', error: error.message });
    }
}

module.exports = {
    getAllContacts, 
    createContact
};