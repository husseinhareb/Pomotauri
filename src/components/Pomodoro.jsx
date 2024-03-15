import React, { useState } from 'react';
import Timer from './Timer';
import "../styles/Pomodoro.css"
import Tasks from './Tasks';
function Pomodoro() {
    const [timerStatus, setTimerStatus] = useState(false); 
    const [selectedMode, setSelectedMode] = useState('Pomodoro');
    let backgroundColor = '';

    const handleTimerStatusChange = (status) => {
        setTimerStatus(status);
    };
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
        <div>
            <div className='pomodoroBox' style={{ backgroundColor: backgroundColor, transition: 'background-color 0.7s ease-in-out' }}>
                <Timer onStatusChange={handleTimerStatusChange} onSelectMode={handleSelectedModeChange} />
            </div>
            <Tasks timerStatus={timerStatus} selectedMode={selectedMode}/>
        </div>
    );
}

export default Pomodoro;
