// Navbar.tsx
import React, { useState } from "react";
import Clock from "../Clock/Clock";
import Settings from "../Settings/Settings";
import AuditModal from "../AuditModal/AuditModal";
import {
  NavbarContainer,
  List,
  LeftItems,
  RightItems,
  IconButton,
  ClockText
} from "./Styles/style";
import { FaApple } from "react-icons/fa";
import { FiBarChart2, FiHome } from "react-icons/fi";
import { IoIosSettings } from "react-icons/io";
const Navbar: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

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
            <IconButton onClick={() => setShowAudit(true)}>
              <FiBarChart2 /> History
            </IconButton>
            {showAudit && <AuditModal onClose={() => setShowAudit(false)} />}

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
