import React from 'react';
import SkillList from './components/SkillList.jsx';

const App = () => {
    const skills = ['Basketball', 'Badminton', 'Swimming', 'Drawing'];

    return (
        <div>
            <h1>Sports Training Platform</h1>
            <SkillList skills={skills} />
        </div>
    );
};

export default App;
