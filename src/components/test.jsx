import React, { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/tauri';
import Tasks from "./Tasks";

function Timer({ onSelectMode, onStatusChange }) {

  const [defaultPomodoroTime, setDefaultPomodoroTime] = useState({ minutes: 25, seconds: 0 });
  const [shortBreak, setShortBreak] = useState({ minutes: 5, seconds: 0 });
  const [longBreak, setLongBreak] = useState({ minutes: 15, seconds: 0 });
  const [time, setTime] = useState(defaultPomodoroTime);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Pomodoro");
  const [boxColor, setBoxColor] = useState("");
  const [btnColor, setBtnColor] = useState("");
  const [counter, setCounter] = useState(1);
  const [config, setConfig] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#BA4949");
  const [alarmSound] = useState(new Audio('sounds/alarm.mp3'));
  const [buttonSound] = useState(new Audio('sounds/buttonSound.mp3'));
  const modeOptions = {
    Pomodoro: { time: defaultPomodoroTime, color: "#BA4949", btnColor: "#C15C5C", boxColor: "#C15C5C" },
    ShortBreak: { time: shortBreak, color: "#428455", btnColor: "#6fa67f", boxColor: "#6fa67f" },
    LongBreak: { time: longBreak, color: "#854284", btnColor: "#c482c3", boxColor: "#c482c3" }
  };


  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await invoke('get_config');
        setConfig(response);
        setDefaultPomodoroTime(response.pomodoro_time)
        setShortBreak(response.short_break_time)
        setLongBreak(response.long_break_time)
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
    const intervalId = setInterval(fetchConfig, 1000);

    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    if (selectedMode === 'Pomodoro' && isRunning === true) {
      onStatusChange(true);
    }
    else {
      onStatusChange(false);
    }
  })


  useEffect(() => {
    if (selectedMode && !isRunning) {
      const { time, boxColor } = modeOptions[selectedMode];
      setTime(time);
      setBoxColor(boxColor);
      setBtnColor(btnColor);
    }
  }, [selectedMode, isRunning, shortBreak, longBreak, defaultPomodoroTime]);

  useEffect(() => {
    if (time <= 0 && isRunning) {
      handleTimerEnd();
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


  const selectMode = (mode) => {
    setSelectedMode(mode);
    setIsRunning(false);
    onSelectMode(mode);
    setBoxColor(modeOptions[mode].boxColor);
    setBtnColor(modeOptions[mode].btnColor);
    setBackgroundColor(modeOptions[mode].color);
  };


  const startTimer = () => {
    playBtnSound();
  setIsRunning(prevIsRunning => !prevIsRunning); 
};



  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    onSelectMode(mode);
    const { time, color, btnColor } = modeOptions[mode];
    setTime(time);
    setBackgroundColor(color);
    setBtnColor(btnColor);
  };

  const resetTimer = () => {
    playBtnSound();
    handleModeChange(selectedMode);
    setIsRunning(false);
  };

  const handleTimerEnd = () => {
    handleTimerSkip();
    playAlarm();
  };


  const handleTimerSkip = () => {
    if (selectedMode === 'Pomodoro' && counter < 4) {
      setSelectedMode('ShortBreak');
      handleModeChange('ShortBreak');
    } else if (selectedMode === 'ShortBreak' && counter < 4) {
      setCounter(prevCounter => prevCounter + 1);
      setSelectedMode('Pomodoro');
      handleModeChange('Pomodoro')
    } else if (selectedMode === 'Pomodoro' && counter === 4) {
      setSelectedMode('LongBreak');
      handleModeChange('LongBreak');
    } else if (selectedMode === 'LongBreak') {
      setSelectedMode('Pomodoro');
      handleModeChange('Pomodoro');
      setCounter(1);
    }
    setIsRunning(false);
  };
  const minutes = time.minutes;
  const seconds = time.seconds;

  useEffect(() => {
    if (selectedMode === 'Pomodoro') {
      setFavicon('icons/pomodoroIco.svg');
      document.title = `${minutes}:${seconds < 10 ? "0" : ""}${seconds} - Focus! :|`;
    }
    else if (selectedMode === 'ShortBreak') {
      setFavicon('icons/shortBreakIco.svg');
      document.title = `${minutes}:${seconds < 10 ? "0" : ""}${seconds} - Short Break! :)`;
    }
    else if (selectedMode === 'LongBreak') {
      setFavicon('icons/longBreakIco.svg');
      document.title = `${minutes}:${seconds < 10 ? "0" : ""}${seconds} - Go Outside :D`;
    }
  }, [time]);

  const playBtnSound = () => {
    buttonSound.play();

  }
  const playAlarm = () => {
    alarmSound.play();
  }

  function setFavicon(url) {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon !== null) {
      favicon.href = url;
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = url;
      document.head.appendChild(link);
    }
  }



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
            {minutes}:</div>
          <button className="start" onClick={startTimer} style={{ color: btnColor, transition: 'background-color 0.7s ease-in-out' }}>
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
}

export default Timer;
