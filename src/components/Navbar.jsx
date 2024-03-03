import React, { useState } from "react";
import Clock from "./Clock";
import Settings from "./Settings";
import settingsIco from "../assets/icons/settingsIco.svg";
import homeIco from "../assets/icons/homeIco.svg";
import appleIco from "../assets/icons/appleIco.svg";
import "../Styles/NavBar.css"
function Navbar() {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <nav className="navbar">
      <ul className="left-items">
        <button onClick={() => { window.location.reload(); }} className="title">
          <img className="appleIco" src={appleIco} alt="Icon" /> Pomodoro
        </button>
        <li>
          <Clock />
        </li>
      </ul>
      <ul className="right-items">
        <li>
          <button className="homeButton">
            <img className="homeIco" src={homeIco} alt="Icon" /> Home
          </button>
        </li>
        <li>
          <button onClick={toggleSettings} className="settingsButton">
            <img className="settingsIco" src={settingsIco} alt="Icon" /> Settings
          </button>
        </li>
      </ul>
      {showSettings && <Settings onClose={handleCloseSettings} />}
    </nav>
  );
}

export default Navbar;
