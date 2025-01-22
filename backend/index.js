const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let skills = ['Basketball', 'Badminton', 'Swimming', 'Drawing'];

app.get('/api/skills', (req, res) => {
    res.json({
        success: true,
        message: 'Skills retrieved successfully',
        skills: skills,
    });
});

// POST endpoint
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
        skills: skills,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
