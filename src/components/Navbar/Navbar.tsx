// Navbar.tsx
import React, { useState } from "react";
import Clock from "../Clock/Clock";
import Settings from "../Settings/Settings";
import { NavbarContainer, List, LeftItems, RightItems, Button, ClockText } from "./Styles/style";

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
    <NavbarContainer>
      <LeftItems>
        <Button onClick={() => window.location.reload()} className="title">
          Pomotauri
        </Button>
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
            <Button className="homeButton">Home</Button>
          </li>
          <li>
            <Button onClick={toggleSettings} className="settingsButton">
              Settings
            </Button>
          </li>
        </List>
      </RightItems>

      {showSettings && <Settings onClose={handleCloseSettings} />}
    </NavbarContainer>
  );
};

export default Navbar;
