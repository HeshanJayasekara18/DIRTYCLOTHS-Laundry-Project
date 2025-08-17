// ============== PACKAGE ROUTES ==============
const express = require('express');
const router = express.Router();
const {
    addPackage,
    updatePackage,
    deletePackage,
    getAllPackage,
    getPackage
} = require('../controller/PackageController');

// GET all packages
router.get('/', getAllPackage);

// GET a package by ID
router.get('/:id', getPackage);

// POST a new package
router.post('/', addPackage);

// PUT (update) a package by ID
router.put('/:id', updatePackage);

// DELETE a package by ID
router.delete('/:id', deletePackage);

module.exports = router;