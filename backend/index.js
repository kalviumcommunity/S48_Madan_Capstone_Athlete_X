const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/skills', (req, res) => {
    res.json({
        success: true,
        message: 'Skills retrieved successfully',
        skills: ['Basketball', 'Badminton', 'Swimming', 'Drawing']
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
