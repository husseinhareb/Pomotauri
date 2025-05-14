// Navbar.tsx
import React, { useState } from "react";
import Clock from "../Clock/Clock";
import Settings from "../Settings/Settings";
import { 
  NavbarContainer, 
  List, 
  LeftItems, 
  RightItems, 
  IconButton, 
  ClockText 
} from "./Styles/style";
import { FaApple } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { IoIosSettings } from "react-icons/io";
const Navbar: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = (): void => {
    setShowSettings(prev => !prev);
  };

  const handleCloseSettings = (): void => {
    setShowSettings(false);
  };

  return (
    <NavbarContainer>
      <LeftItems>
        <IconButton onClick={() => window.location.reload()} title="Pomotauri">
          <FaApple className="appleIco" />
          Pomotauri
        </IconButton>
        <List>
          <li>
            <ClockText>
              <Clock />
            </ClockText>
          </li>
        </List>
      </LeftItems>

      <RightItems>
        <List>
          <li>
            <IconButton className="homeButton">
              <FiHome className="homeIco" />
              Home
            </IconButton>
          </li>
          <li>
            <IconButton onClick={toggleSettings} className="settingsButton">
              <IoIosSettings className="settingsIco" />
              Settings
            </IconButton>
          </li>
        </List>
      </RightItems>

      {showSettings && <Settings onClose={handleCloseSettings} />}
    </NavbarContainer>
  );
};

export default Navbar;
