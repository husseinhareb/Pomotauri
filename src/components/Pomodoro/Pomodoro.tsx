// Pomodoro.tsx
import React, { useState } from 'react';
import Timer from '../Pomodoro/Timer';
import Tasks from '../Tasks/Tasks';
import { PomodoroBox } from './Styles/style';

const Pomodoro: React.FC = () => {
  const [timerStatus, setTimerStatus] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<'Pomodoro' | 'ShortBreak' | 'LongBreak'>('Pomodoro');

  const handleTimerStatusChange = (status: boolean): void => {
    setTimerStatus(status);
  };

  const handleSelectedModeChange = (mode: 'Pomodoro' | 'ShortBreak' | 'LongBreak'): void => {
    setSelectedMode(mode);
  };

  const backgroundColor: string =
    selectedMode === 'Pomodoro'
      ? '#C15C5C'
      : selectedMode === 'ShortBreak'
      ? '#6fa67f'
      : '#c482c3';

  return (
    <div>
      <PomodoroBox style={{ backgroundColor }}>
        <Timer onStatusChange={handleTimerStatusChange} onSelectMode={handleSelectedModeChange} />
      </PomodoroBox>
      <Tasks timerStatus={timerStatus} />
    </div>
  );
};

export default Pomodoro;
