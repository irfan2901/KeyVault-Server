const express = require('express');
const router = express.Router();
const { Category } = require('../models');

// Add category
router.post('/', async (req, res) => {
    const { UserId, CategoryName } = req.body;

    try {
        const category = await Category.create({ UserId, CategoryName });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update category
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { CategoryName } = req.body;

    try {
        const category = await Category.findByPk(id);

        if(!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        category.CategoryName = CategoryName;
        await category.save();
        res.json(category);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete category
router.delete('/delete/:id', async (req, res) => {
    const { CategoryId } = req.params;

    try {
        const category = await Category.findByPk(CategoryId);

        if(!CategoryId) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await category.delete();
        res.status(204).send();

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Show all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Show specific category by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ CategoryId: category.CategoryId, CategoryName: category.CategoryName });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;