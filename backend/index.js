const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let skills = ['Basketball', 'Badminton', 'Swimming', 'Drawing'];

// GET endpoint to retrieve all skills
app.get('/api/skills', (req, res) => {
    res.json({
        success: true,
        message: 'Skills retrieved successfully',
        skills: skills,
    });
});

// POST endpoint to add a new skill
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

// PUT endpoint to update an existing skill by index
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
        skills
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
