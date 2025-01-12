const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

// Signup route
authRouter.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, password, city, locality, state } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = new User({ fullName, email, password: hashedPassword, city, locality, state });
        user = await user.save();
        res.json({ user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Login route
authRouter.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt:', email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        console.log('User found:', user.email);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match for user:', email);
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (e) {
        console.error('Login error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

module.exports = authRouter;