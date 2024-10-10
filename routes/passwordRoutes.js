const express = require('express');
const { Category, Password } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Show all passwords for the current user across all categories
router.get('/allpasswords/:userId', auth, async (req, res) => {
    try {
        const passwords = await Password.findAll({
            where: {
                UserId: req.params.userId,  // Ensure we only get the passwords for the current user
            },
            order: [['createdAt', 'DESC']], // Order by createdAt in descending order
        });
        res.json(passwords);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Utility function to find category by name
const findCategoryByName = async (categoryName) => {
    return await Category.findOne({ where: { CategoryName: categoryName } });
};

// Add password to a specific category by category name
router.post('/:categoryName', auth, async (req, res) => {
    try {
        const category = await findCategoryByName(req.params.categoryName);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const passwordEntry = await Password.create({
            ...req.body,
            CategoryId: category.CategoryId,
        });
        res.status(201).json(passwordEntry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update specific password from a specific category by category name
router.put('/:categoryName/:passwordId', auth, async (req, res) => {
    try {
        const category = await findCategoryByName(req.params.categoryName);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const passwordEntry = await Password.findOne({
            where: {
                PasswordId: req.params.passwordId,
                CategoryId: category.CategoryId,
            },
        });
        if (!passwordEntry) {
            return res.status(404).json({ error: 'Password not found' });
        }
        await passwordEntry.update(req.body);
        res.json(passwordEntry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete specific password from a specific category by category name
router.delete('/:categoryName/:passwordId', auth, async (req, res) => {
    try {
        const category = await findCategoryByName(req.params.categoryName);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const passwordEntry = await Password.findOne({
            where: {
                PasswordId: req.params.passwordId,
                CategoryId: category.CategoryId,
            },
        });
        if (!passwordEntry) {
            return res.status(404).json({ error: 'Password not found' });
        }
        await passwordEntry.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Show specific password from a specific category by category name
router.get('/:categoryName/:passwordId', auth, async (req, res) => {
    try {
        const category = await findCategoryByName(req.params.categoryName);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const passwordEntry = await Password.findOne({
            where: {
                PasswordId: req.params.passwordId,
                CategoryId: category.CategoryId,
            },
        });
        if (!passwordEntry) {
            return res.status(404).json({ error: 'Password not found' });
        }
        res.json(passwordEntry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Show all passwords from a specific category by category name
router.get('/:categoryName', auth, async (req, res) => {
    try {
        const category = await findCategoryByName(req.params.categoryName);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const passwords = await Password.findAll({
            where: {
                CategoryId: category.CategoryId,
            },
        });
        res.json(passwords);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;