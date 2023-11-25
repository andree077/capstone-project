const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Replace with your secret key

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
  
        if (existingUser) {
            return res.status(409).send({ error: 'Username already in use' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).send({ error: 'An error occurred during signup' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' }); // Token expiration is set to 1 hour

        res.send({ token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send({ error: 'An error occurred during login' });
    }
};

// Add any other auth related functions if needed
