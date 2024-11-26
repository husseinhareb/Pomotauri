import React, { useState } from "react";
import Clock from "../Clock/Clock";
import Settings from "../Settings/Settings";
import settingsIco from "../assets/icons/settingsIco.svg";
import homeIco from "../assets/icons/homeIco.svg";
import appleIco from "../assets/icons/appleIco.svg";
import "../styles/NavBar.css";

// Define the Props interface for the Settings component (if needed)
interface NavbarProps {
  // Add any props you might need for the Navbar component
}

const Navbar: React.FC<NavbarProps> = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const toggleSettings = (): void => {
    setShowSettings((prev) => !prev);
  };

  const handleCloseSettings = (): void => {
    setShowSettings(false);
  };

  return (
    <nav className="navbar">
      <ul className="left-items">
        <button onClick={() => window.location.reload()} className="title">
          <img className="appleIco" src={appleIco} alt="Icon" /> Pomotauri
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
};

export default Navbar;
