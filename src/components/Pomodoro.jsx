import React, { useState } from 'react';
import Timer from './Timer';
import "../Styles/Pomodoro.css"
function Pomodoro() {
    const [selectedMode, setSelectedMode] = useState('Pomodoro');
    let backgroundColor = '';

    const handleSelectedModeChange = (mode) => {
        setSelectedMode(mode);
    };

    if (selectedMode === 'Pomodoro') {
        backgroundColor = '#C15C5C';
    } else if (selectedMode === 'ShortBreak') {
        backgroundColor = '#6fa67f';
    } else if (selectedMode === 'LongBreak') {
        backgroundColor = '#c482c3';
    }

    return (
        <div className='pomodoroBox' style={{ backgroundColor: backgroundColor, transition: 'background-color 0.7s ease-in-out' }}>
            <Timer onSelectMode={handleSelectedModeChange} />
        </div>
    );
}

export default Pomodoro;
