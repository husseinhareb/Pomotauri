import React, { useState } from "react";
import Timer from "../Pomodoro/Timer";
import Tasks from "../Tasks/Tasks";

const Pomodoro: React.FC = () => {
  const [timerStatus, setTimerStatus] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<"Pomodoro" | "ShortBreak" | "LongBreak">("Pomodoro");

  const handleTimerStatusChange = (status: boolean): void => {
    setTimerStatus(status);
  };

  const handleSelectedModeChange = (mode: "Pomodoro" | "ShortBreak" | "LongBreak"): void => {
    setSelectedMode(mode);
  };

  const backgroundColor: string =
    selectedMode === "Pomodoro"
      ? "#C15C5C"
      : selectedMode === "ShortBreak"
      ? "#6fa67f"
      : "#c482c3";

  return (
    <div>
      <div
        className="pomodoroBox"
        style={{ backgroundColor: backgroundColor, transition: "background-color 0.7s ease-in-out" }}
      >
        <Timer onStatusChange={handleTimerStatusChange} onSelectMode={handleSelectedModeChange} />
      </div>
      <Tasks timerStatus={timerStatus} />
    </div>
  );
};

export default Pomodoro;
