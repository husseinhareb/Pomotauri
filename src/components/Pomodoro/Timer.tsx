import React, { useState, useEffect } from "react";
import { core } from '@tauri-apps/api';

// Define the structure of time objects
interface Time {
  minutes: number;
  seconds: number;
}

interface ModeOptions {
  Pomodoro: { time: Time; color: string; btnColor: string; boxColor: string };
  ShortBreak: { time: Time; color: string; btnColor: string; boxColor: string };
  LongBreak: { time: Time; color: string; btnColor: string; boxColor: string };
}

interface TimerProps {
  onSelectMode: (mode: "Pomodoro" | "ShortBreak" | "LongBreak") => void;
  onStatusChange: (isRunning: boolean) => void;
}

const Timer: React.FC<TimerProps> = ({ onSelectMode, onStatusChange }) => {
  const [defaultPomodoroTime, setDefaultPomodoroTime] = useState<Time>({ minutes: 25, seconds: 0 });
  const [shortBreak, setShortBreak] = useState<Time>({ minutes: 5, seconds: 0 });
  const [longBreak, setLongBreak] = useState<Time>({ minutes: 15, seconds: 0 });
  const [time, setTime] = useState<Time>(defaultPomodoroTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<"Pomodoro" | "ShortBreak" | "LongBreak">("Pomodoro");
  const [boxColor, setBoxColor] = useState<string>("");
  const [btnColor, setBtnColor] = useState<string>("");
  const [counter, setCounter] = useState<number>(1);
  const [backgroundColor, setBackgroundColor] = useState<string>("#BA4949");

  const modeOptions: ModeOptions = {
    Pomodoro: { time: defaultPomodoroTime, color: "#BA4949", btnColor: "#C15C5C", boxColor: "#C15C5C" },
    ShortBreak: { time: shortBreak, color: "#428455", btnColor: "#6fa67f", boxColor: "#6fa67f" },
    LongBreak: { time: longBreak, color: "#854284", btnColor: "#c482c3", boxColor: "#c482c3" }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await core.invoke('get_config') as {
          pomodoro_time: Time;
          short_break_time: Time;
          long_break_time: Time;
        };
        setDefaultPomodoroTime(response.pomodoro_time);
        setShortBreak(response.short_break_time);
        setLongBreak(response.long_break_time);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
    const intervalId = setInterval(fetchConfig, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (selectedMode === 'Pomodoro' && isRunning) {
      onStatusChange(true);
    } else {
      onStatusChange(false);
    }
  }, [selectedMode, isRunning]);

  useEffect(() => {
    if (selectedMode && !isRunning) {
      const { time, boxColor } = modeOptions[selectedMode];
      if (!isPaused) {
        setTime(time);
      }
      setBoxColor(boxColor);
      setBtnColor(modeOptions[selectedMode].btnColor);
    }
  }, [selectedMode, isRunning, shortBreak, longBreak, defaultPomodoroTime]);

  useEffect(() => {
    if (time.minutes === 0 && time.seconds === 0 && isRunning) {
      handleTimerEnd();
      setTime(modeOptions[selectedMode].time); // reset time when timer ends
    }
  }, [time, isRunning, selectedMode]);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTime(prevTime => {
          if (prevTime.minutes === 0 && prevTime.seconds === 0) {
            clearInterval(intervalId);
            handleTimerEnd();
            return prevTime;
          }
          if (prevTime.seconds === 0) {
            return { minutes: prevTime.minutes - 1, seconds: 59 };
          } else {
            return { ...prevTime, seconds: prevTime.seconds - 1 };
          }
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isRunning]);

  useEffect(() => {
    document.body.style.transition = 'background-color 0.7s ease-in-out';
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  const selectMode = (mode: "Pomodoro" | "ShortBreak" | "LongBreak") => {
    setSelectedMode(mode);
    setIsRunning(false);
    setIsPaused(false);
    onSelectMode(mode);
    setBoxColor(modeOptions[mode].boxColor);
    setBtnColor(modeOptions[mode].btnColor);
    setBackgroundColor(modeOptions[mode].color);
  };

  const startTimer = () => {
    setIsRunning(prevIsRunning => !prevIsRunning);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleModeChange = (mode: "Pomodoro" | "ShortBreak" | "LongBreak") => {
    setSelectedMode(mode);
    onSelectMode(mode);
    const { time, color, btnColor } = modeOptions[mode];
    setTime(time);
    setBackgroundColor(color);
    setBtnColor(btnColor);
  };

  const resetTimer = () => {
    handleModeChange(selectedMode);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleTimerEnd = () => {
    handleTimerSkip();
  };

  const handleTimerSkip = () => {
    if (selectedMode === 'Pomodoro' && counter < 4) {
      setSelectedMode('ShortBreak');
      handleModeChange('ShortBreak');
    } else if (selectedMode === 'ShortBreak' && counter < 4) {
      setCounter(prevCounter => prevCounter + 1);
      setSelectedMode('Pomodoro');
      handleModeChange('Pomodoro');
    } else if (selectedMode === 'Pomodoro' && counter === 4) {
      setSelectedMode('LongBreak');
      handleModeChange('LongBreak');
    } else if (selectedMode === 'LongBreak') {
      setSelectedMode('Pomodoro');
      handleModeChange('Pomodoro');
      setCounter(1);
    }
    setIsRunning(false);
    setIsPaused(false);
  };

  const minutes = time.minutes;
  const seconds = time.seconds;

  return (
    <div className="box" style={{ backgroundColor: boxColor, transition: 'background-color 0.7s ease-in-out' }}>
      <div className="topButtons">
        <button className={`button ${selectedMode === "Pomodoro" ? "selected" : ""}`} onClick={() => selectMode("Pomodoro")}>Pomodoro</button>
        <button className={`button ${selectedMode === "ShortBreak" ? "selected" : ""}`} onClick={() => selectMode("ShortBreak")}>Short Break</button>
        <button className={`button ${selectedMode === "LongBreak" ? "selected" : ""}`} onClick={() => selectMode("LongBreak")}>Long Break</button>
      </div>
      <div className="buttomButtons">
        <span>
          <div className="countdown">
            {minutes < 10 ? "0" : ""}
            {minutes}:
          </div>
          <button className="start" onClick={isRunning ? pauseTimer : startTimer} style={{ color: btnColor, transition: 'background-color 0.7s ease-in-out' }}>
            {isRunning ? "PAUSE" : "START"}
          </button>
        </span>
        <span>
          <div className="countdown">
            {seconds < 10 ? "0" : ""}
            {seconds}
          </div>
          <button className="reset" onClick={resetTimer} style={{ color: btnColor, transition: 'background-color 0.7s ease-in-out' }}>
            RESET
          </button>
        </span>
      </div>
    </div>
  );
};

export default Timer;
