import React, { useState, useEffect } from "react";
import { core } from '@tauri-apps/api'; 

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
    <div className="settings-window">
      <h3 className="settingsTitle">Settings</h3>
      <button onClick={handleClose} className="closeSettings">
        {/* Close button icon */}
      </button>
      <hr className="mainHr" />
      <h3 className="timerTitle">
        Timer
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="timer-section">
          <h4 className="pomodoroTitle">Pomodoro</h4>
          <div className="input-row">
            <div className="input-field">
              <label htmlFor="pomodoro-minutes">Minutes:</label>
              <input
                type="number"
                id="pomodoro-minutes"
                placeholder="25"
                className="minutes"
                value={pomodoroTime.minutes}
                onChange={handleTimerChange(setPomodoroTime, "minutes")}
                min={0}
                max={60}
              />
            </div>
            <div className="input-field">
              <label htmlFor="pomodoro-seconds">Seconds:</label>
              <input
                type="number"
                id="pomodoro-seconds"
                placeholder="00"
                className="seconds"
                value={pomodoroTime.seconds}
                onChange={handleTimerChange(setPomodoroTime, "seconds")}
                min={0}
                max={60}
              />
            </div>
          </div>
        </div>
        <div className="timer-section">
          <h4 className="shortTitle">Short Break</h4>
          <div className="input-row">
            <div className="input-field">
              <label htmlFor="shortbreak-minutes">Minutes:</label>
              <input
                type="number"
                id="shortbreak-minutes"
                placeholder="5"
                className="minutes"
                value={shortBreakTime.minutes}
                onChange={handleTimerChange(setShortBreakTime, "minutes")}
                min={0}
                max={60}
              />
            </div>
            <div className="input-field">
              <label htmlFor="shortbreak-seconds">Seconds:</label>
              <input
                type="number"
                id="shortbreak-seconds"
                placeholder="00"
                className="seconds"
                value={shortBreakTime.seconds}
                onChange={handleTimerChange(setShortBreakTime, "seconds")}
                min={0}
                max={60}
              />
            </div>
          </div>
        </div>
        <div className="timer-section">
          <h4 className="longTitle">Long Break</h4>
          <div className="input-row">
            <div className="input-field">
              <label htmlFor="longbreak-minutes">Minutes:</label>
              <input
                type="number"
                id="longbreak-minutes"
                placeholder="15"
                className="minutes"
                value={longBreakTime.minutes}
                onChange={handleTimerChange(setLongBreakTime, "minutes")}
                min={0}
                max={60}
              />
            </div>
            <div className="input-field">
              <label htmlFor="longbreak-seconds">Seconds:</label>
              <input
                type="number"
                id="longbreak-seconds"
                placeholder="00"
                className="seconds"
                value={longBreakTime.seconds}
                onChange={handleTimerChange(setLongBreakTime, "seconds")}
                min={0}
                max={60}
              />
            </div>
          </div>
        </div>
        <div className="submitDiv">
          <button className="submitButton" type="submit">
            OK
          </button>
        </div>
        <hr className="Hr" />
      </form>
    </div>
  );
};

export default Settings;
