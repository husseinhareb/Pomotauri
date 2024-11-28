// Settings.tsx
import React, { useState, useEffect } from "react";
import { core } from '@tauri-apps/api'; 
import { SettingsWindow, CloseSettingsButton, TimerTitle, TimerSection, SectionTitle, InputRow, InputField, InputLabel, Input, SubmitButtonWrapper, SubmitButton, Hr, TimerForm } from './Styles/style';

interface Timer {
  minutes: number;
  seconds: number;
}

interface SettingsProps {
  onClose: (data: { pomodoroTime: Timer; shortBreakTime: Timer; longBreakTime: Timer }) => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [pomodoroTime, setPomodoroTime] = useState<Timer>({ minutes: 25, seconds: 0 });
  const [shortBreakTime, setShortBreakTime] = useState<Timer>({ minutes: 5, seconds: 0 });
  const [longBreakTime, setLongBreakTime] = useState<Timer>({ minutes: 15, seconds: 0 });

  useEffect(() => {
    const readTimerValues = async () => {
      try {
        const response: {
          pomodoro_time: Timer;
          short_break_time: Timer;
          long_break_time: Timer;
        } = await core.invoke("get_config");  // Backend call to fetch config
        setPomodoroTime(response.pomodoro_time);
        setShortBreakTime(response.short_break_time);
        setLongBreakTime(response.long_break_time);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    readTimerValues();
  }, []);

  const handleClose = () => {
    onClose({ pomodoroTime, shortBreakTime, longBreakTime });
  };

  const handleTimerChange = (
    setter: React.Dispatch<React.SetStateAction<Timer>>,
    field: keyof Timer
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter((prevTime) => ({
      ...prevTime,
      [field]: parseInt(e.target.value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleClose();
    const data = {
      pomodoro_time: pomodoroTime,
      short_break_time: shortBreakTime,
      long_break_time: longBreakTime,
    };

    try {
      // Send data to backend to save settings
      await core.invoke("set_config", { data });  // Send updated data to backend
      console.log(data);
    } catch (error) {
      console.error("Error while sending data to backend:", error);
    }
  };

  return (
    <SettingsWindow>
      <h3 className="settingsTitle">Settings</h3>
      <CloseSettingsButton onClick={handleClose}>✕</CloseSettingsButton>
      <Hr />
      <TimerTitle>Timer</TimerTitle>
      <TimerForm onSubmit={handleSubmit}>
        <TimerSection>
          <SectionTitle>Pomodoro</SectionTitle>
          <InputRow>
            <InputField>
              <InputLabel htmlFor="pomodoro-minutes">Minutes:</InputLabel>
              <Input
                type="number"
                id="pomodoro-minutes"
                placeholder="25"
                value={pomodoroTime.minutes}
                onChange={handleTimerChange(setPomodoroTime, "minutes")}
                min={0}
                max={60}
              />
            </InputField>
            <InputField>
              <InputLabel htmlFor="pomodoro-seconds">Seconds:</InputLabel>
              <Input
                type="number"
                id="pomodoro-seconds"
                placeholder="00"
                value={pomodoroTime.seconds}
                onChange={handleTimerChange(setPomodoroTime, "seconds")}
                min={0}
                max={60}
              />
            </InputField>
          </InputRow>
        </TimerSection>
        <TimerSection>
          <SectionTitle>Short Break</SectionTitle>
          <InputRow>
            <InputField>
              <InputLabel htmlFor="shortbreak-minutes">Minutes:</InputLabel>
              <Input
                type="number"
                id="shortbreak-minutes"
                placeholder="5"
                value={shortBreakTime.minutes}
                onChange={handleTimerChange(setShortBreakTime, "minutes")}
                min={0}
                max={60}
              />
            </InputField>
            <InputField>
              <InputLabel htmlFor="shortbreak-seconds">Seconds:</InputLabel>
              <Input
                type="number"
                id="shortbreak-seconds"
                placeholder="00"
                value={shortBreakTime.seconds}
                onChange={handleTimerChange(setShortBreakTime, "seconds")}
                min={0}
                max={60}
              />
            </InputField>
          </InputRow>
        </TimerSection>
        <TimerSection>
          <SectionTitle>Long Break</SectionTitle>
          <InputRow>
            <InputField>
              <InputLabel htmlFor="longbreak-minutes">Minutes:</InputLabel>
              <Input
                type="number"
                id="longbreak-minutes"
                placeholder="15"
                value={longBreakTime.minutes}
                onChange={handleTimerChange(setLongBreakTime, "minutes")}
                min={0}
                max={60}
              />
            </InputField>
            <InputField>
              <InputLabel htmlFor="longbreak-seconds">Seconds:</InputLabel>
              <Input
                type="number"
                id="longbreak-seconds"
                placeholder="00"
                value={longBreakTime.seconds}
                onChange={handleTimerChange(setLongBreakTime, "seconds")}
                min={0}
                max={60}
              />
            </InputField>
          </InputRow>
        </TimerSection>
        <SubmitButtonWrapper>
          <SubmitButton type="submit">OK</SubmitButton>
        </SubmitButtonWrapper>
        <Hr />
      </TimerForm>
    </SettingsWindow>
  );
};

export default Settings;
