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

const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await contact.findByIdAndDelete(id);
        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
}

module.exports = {
    getAllContacts, 
    createContact,
    deleteContact
};