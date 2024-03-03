import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "../Styles/Settings.css";
import closeIco from "../assets/icons/closeIco.svg";
import clockIco from "../assets/icons/clockIco.svg"

function Settings({ onClose }) {
  const [pomodoroTime, setPomodoroTime] = useState({ minutes: 25, seconds: 0 });
  const [shortBreakTime, setShortBreakTime] = useState({ minutes: 5, seconds: 0 });
  const [longBreakTime, setLongBreakTime] = useState({ minutes: 15, seconds: 0 });

  useEffect(() => {
    const readCookieValues = () => {
      const pomodoroTimeCookie = Cookies.get("pomodoroTime");
      const shortBreakTimeCookie = Cookies.get("shortBreakTime");
      const longBreakTimeCookie = Cookies.get("longBreakTime");

      if (pomodoroTimeCookie) {
        setPomodoroTime(JSON.parse(pomodoroTimeCookie));
      }
      if (shortBreakTimeCookie) {
        setShortBreakTime(JSON.parse(shortBreakTimeCookie));
      }
      if (longBreakTimeCookie) {
        setLongBreakTime(JSON.parse(longBreakTimeCookie));
      }
    };

    readCookieValues();
  }, []);

  const handleClose = () => {
    onClose({ pomodoroTime, shortBreakTime, longBreakTime });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleClose();
    Cookies.set("pomodoroTime", JSON.stringify(pomodoroTime), { sameSite: "None", secure: true });
    Cookies.set("shortBreakTime", JSON.stringify(shortBreakTime), { sameSite: "None", secure: true });
    Cookies.set("longBreakTime", JSON.stringify(longBreakTime), { sameSite: "None", secure: true });
  };

  const handlePomodoroMinutesChange = (e) => {
    setPomodoroTime((prevTime) => ({
      ...prevTime,
      minutes: parseInt(e.target.value) || 0
    }));
  };

  const handlePomodoroSecondsChange = (e) => {
    setPomodoroTime((prevTime) => ({
      ...prevTime,
      seconds: parseInt(e.target.value) || 0
    }));
  };

  const handleShortBreakMinutesChange = (e) => {
    setShortBreakTime((prevTime) => ({
      ...prevTime,
      minutes: parseInt(e.target.value) || 0
    }));
  };

  const handleShortBreakSecondsChange = (e) => {
    setShortBreakTime((prevTime) => ({
      ...prevTime,
      seconds: parseInt(e.target.value) || 0
    }));
  };

  const handleLongBreakMinutesChange = (e) => {
    setLongBreakTime((prevTime) => ({
      ...prevTime,
      minutes: parseInt(e.target.value) || 0
    }));
  };

  const handleLongBreakSecondsChange = (e) => {
    setLongBreakTime((prevTime) => ({
      ...prevTime,
      seconds: parseInt(e.target.value) || 0
    }));
  };

  return (
    <div className="settings-window">
      <h3 className="settingsTitle">Settings</h3>
      <button onClick={handleClose} className="closeSettings">
        <img className="closeIco" src={closeIco} alt="Icon" />
      </button>
      <hr className="mainHr" />
      <h3 className="timerTitle">
        <img className="clockIco" src={clockIco} alt="Icon" />
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
                onChange={handlePomodoroMinutesChange}
                min={0}
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
                onChange={handlePomodoroSecondsChange}
                min={0}
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
                onChange={handleShortBreakMinutesChange}
                min={0}
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
                onChange={handleShortBreakSecondsChange}
                min={0}
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
                onChange={handleLongBreakMinutesChange}
                min={0}
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
                onChange={handleLongBreakSecondsChange}
                min={0}
              />
            </div>
          </div>
        </div>
        <div className="submitDiv">
          <button className="submitButton" type="submit">OK</button>
        </div>
        <hr className="Hr" />
      </form>
    </div>

  );
}

export default Settings;
