// Pomodoro.styled.ts
import styled from 'styled-components';

// Container for the Pomodoro timer box
export const PomodoroBox = styled.div`
  background-color: #c15c5c;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 500px;
  margin: 5% auto 0;
  border-radius: 6px;
  transition: background-color 0.7s ease-in-out;
`;

// Timer display (countdown)
export const Countdown = styled.div`
  font-size: 120px;
  color: white;
  font-weight: bold;
  font-family: 'Arial-Rounded-Bold';
  letter-spacing: 14px;
`;

// Container for buttons at the bottom
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Wrapper for the mode selection buttons
export const ModeButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Button styling for Pomodoro, ShortBreak, LongBreak modes
export const ModeButton = styled.button<{ selected: boolean }>`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  margin: 0 5px;
  color: #ffffff;
  font-size: 16px;
  border-radius: 8px;

  ${({ selected }) =>
    selected &&
    `
    background-color: #ffffff;
    color: #000000;
  `}
`;

// Start and reset buttons
export const StartResetButton = styled.button`
  width: 140px;
  height: 50px;
  color: #c15c5c;
  font-weight: 1000;
  margin: 5px;
  padding: 8px;
  cursor: pointer;
  background-color: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: #ebebeb 4px 4px 0 0, #ebebeb 4px 4px 0 1px;
  font-size: 14px;
  font-weight: 800;
  text-align: center;

  &:hover {
    text-decoration: none;
  }

  &:active {
    box-shadow: #ebebeb 0 3px 5px inset;
    outline: 0;
  }
`;

export const ResetButton = styled(StartResetButton)`
  margin-right: 10px;
`;

// For mobile responsiveness
