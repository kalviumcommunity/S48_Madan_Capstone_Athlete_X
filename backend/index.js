const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Secret key for JWT
const SECRET_KEY = "mysecretkey";

app.use(bodyParser.json());

// In-memory data stores
let skills = ['Basketball', 'Badminton', 'Swimming', 'Drawing'];
let users = [];

// ==============================
// REGISTER USER
// ==============================
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password required'
        });
    }

    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        username,
        password: hashedPassword
    });

    res.status(201).json({
        success: true,
        message: 'User registered successfully'
    });
});

// ==============================
// LOGIN USER + GENERATE JWT
// ==============================
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }

    // Generate JWT token
    const token = jwt.sign(
        { username: user.username },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({
        success: true,
        message: 'Login successful',
        token
    });
});

// ==============================
// JWT AUTH MIDDLEWARE
// ==============================
function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {

        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        req.user = user;
        next();
    });
}

// ==============================
// GET SKILLS (Protected)
// ==============================
app.get('/api/skills', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Skills retrieved successfully',
        user: req.user,
        skills
    });
});

// ==============================
// ADD NEW SKILL (Protected)
// ==============================
app.post('/api/skills', authenticateToken, (req, res) => {

    const { skill } = req.body;

    if (!skill) {
        return res.status(400).json({
            success: false,
            message: 'Skill is required'
        });
    }

    skills.push(skill);

    res.status(201).json({
        success: true,
        message: 'Skill added successfully',
        skills
    });
});

// ==============================
// UPDATE SKILL (Protected)
// ==============================
app.put('/api/skills/:index', authenticateToken, (req, res) => {

    const index = parseInt(req.params.index);

    const { skill } = req.body;

    if (!skill) {
        return res.status(400).json({
            success: false,
            message: 'Skill is required'
        });
    }

    if (isNaN(index) || index < 0 || index >= skills.length) {
        return res.status(404).json({
            success: false,
            message: 'Skill not found'
        });
    }

    skills[index] = skill;

    res.json({
        success: true,
        message: 'Skill updated successfully',
        skills
    });
});

// ==============================
// START SERVER
// ==============================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});