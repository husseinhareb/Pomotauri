import React, { useState } from "react";
import Clock from "../Clock/Clock";
import Settings from "../Settings/Settings";


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
         Pomotauri
        </button>
        <li>
          <Clock />
        </li>
      </ul>
      <ul className="right-items">
        <li>
          <button className="homeButton">
             Home
          </button>
        </li>
        <li>
          <button onClick={toggleSettings} className="settingsButton">
              Settings
          </button>
        </li>
      </ul>
      {showSettings && <Settings onClose={handleCloseSettings} />}
    </nav>
  );
};

export default Navbar;
