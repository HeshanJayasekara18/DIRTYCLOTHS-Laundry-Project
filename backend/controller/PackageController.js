// ============== PACKAGE CONTROLLER ==============
const Package = require('../models/Package');

const getAllPackage = async (req, res) => {
    try {
        const packages = await Package.find();
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packages', error: error.message });
    }
};

const getPackage = async (req, res) => {
    try {
        const { id } = req.params;
        const singlePackage = await Package.findOne({ packageID: id });
        if (!singlePackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json(singlePackage);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching package', error: error.message });
    }
};

const addPackage = async (req, res) => {
    try {
        const newPackage = new Package(req.body);
        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(500).json({ message: 'Error creating package', error: error.message });
    }
};

const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPackage = await Package.findOneAndUpdate(
            { packageID: id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json(updatedPackage);
    } catch (error) {
        res.status(500).json({ message: 'Error updating package', error: error.message });
    }
};

const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPackage = await Package.findOneAndDelete({ packageID: id });
        if (!deletedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting package', error: error.message });
    }
};

module.exports = {
    getAllPackage,
    getPackage,
    addPackage,
    updatePackage,
    deletePackage
};