const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    const { UserName, Email, Password } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({
            where: {
                UserName,
                Email
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const user = await User.create({ UserName, Email, Password: hashedPassword });

        // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        const token = jwt.sign({ id: user.UserID }, process.env.JWT_SECRET);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ where: { Email } });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.UserID }, process.env.JWT_SECRET);

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Update current user
router.put('/update/:id', auth, async (req, res) => { // Change this line
    const { id } = req.params;
    const { UserName, Email, Password } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields
        if (UserName) user.UserName = UserName;
        if (Email) user.Email = Email;
        if (Password) {
            const salt = await bcrypt.genSalt(10);
            user.Password = await bcrypt.hash(Password, salt);
        }

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

//Delete user
router.delete('/delete/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Show current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findOne({ where: { UserID: req.userId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user data, excluding the password
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user' });
    }
});

// Show all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving users' });
    }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // Find the user by ID from the auth middleware
        const user = await User.findOne({ where: { UserID: req.userId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.Password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(newPassword, salt);

        // Save the updated user
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error changing password' });
    }
});

module.exports = router;