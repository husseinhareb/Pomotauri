// src/components/Navbar/Navbar.tsx
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
  ClockText,
} from "./Styles/style";
import { FaApple, FaHome } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoBarChartSharp } from "react-icons/io5";

const Navbar: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  return (
    <NavbarContainer>
      <LeftItems>
        <IconButton
          onClick={() => window.location.reload()}
          title="Pomotauri"
        >
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
              <FaHome className="homeIco" />
              Home
            </IconButton>
          </li>
          <li>
            <IconButton onClick={() => setShowAudit(true)}>
              <IoBarChartSharp />
              History
            </IconButton>
            {showAudit && (
              <AuditModal onClose={() => setShowAudit(false)} />
            )}
          </li>
          <li>
            <IconButton
              onClick={() => setShowSettings((s) => !s)}
              className="settingsButton"
            >
              <IoIosSettings className="settingsIco" />
              Settings
            </IconButton>
          </li>
        </List>
      </RightItems>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </NavbarContainer>
  );
};

export default Navbar;
