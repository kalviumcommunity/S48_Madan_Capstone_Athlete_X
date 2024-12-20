import React from 'react';

const SkillList = ({ skills }) => {
    return (
        <div>
            <h2>Skills</h2>
            <ul>
                {skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>
        </div>
    );
};

export default SkillList;
