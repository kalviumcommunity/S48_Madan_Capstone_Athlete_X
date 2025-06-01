const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// In-memory data stores
let skills = ['Basketball', 'Badminton', 'Swimming', 'Drawing'];
let users = [];

// Register New User
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ success: false, message: 'Username and password required' });

    if (users.find(user => user.username === username))
        return res.status(400).json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ success: true, message: 'User registered successfully' });
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user)
        return res.status(401).json({ success: false, message: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
        return res.status(401).json({ success: false, message: 'Invalid username or password' });

    res.json({ success: true, message: 'Login successful!' });
});

// GET all skills
app.get('/api/skills', (req, res) => {
    res.json({
        success: true,
        message: 'Skills retrieved successfully',
        skills,
    });
});

// POST new skill
app.post('/api/skills', (req, res) => {
    const { skill } = req.body;

    if (!skill) {
        return res.status(400).json({
            success: false,
            message: 'Skill is required',
        });
    }

    skills.push(skill);
    res.status(201).json({
        success: true,
        message: 'Skill added successfully',
        skills,
    });
});

// PUT update skill by index
app.put('/api/skills/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const { skill } = req.body;

    if (!skill) {
        return res.status(400).json({ success: false, message: 'Skill is required' });
    }

    if (isNaN(index) || index < 0 || index >= skills.length) {
        return res.status(404).json({ success: false, message: 'Skill not found at this index' });
    }

    skills[index] = skill;

    res.json({
        success: true,
        message: `Skill updated successfully at index ${index}`,
        skills,
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
