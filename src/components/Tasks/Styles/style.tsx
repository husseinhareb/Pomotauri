// Styles/style.ts
import styled, { keyframes } from "styled-components";

// Expand animation for new-task
const expand = keyframes`
  from { height: 0; }
  to   { height: 180px; }
`;

export const TasksContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const TasksDiv = styled.div`
  width: 500px;
`;

export const TopTask = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

export const TaskTitle = styled.p`
  color: #e0dcdc;
  font-weight: 600;
  font-size: 16px;
  cursor: default;
  &:hover { color: #fff; }
`;

export const TasksSettingsButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  color: #e0dcdc;
  cursor: pointer;
  margin-top: 10px;
  &:hover { color: #fff; }
`;

export const TaskHr = styled.hr`
  border: none;
  height: 2px;
  background-color: #fff;
`;

export const TaskList = styled.div`
  overflow: hidden;
  max-height: 262px;
  &:hover { overflow: auto; }
`;

export const AddTaskButton = styled.button`
  width: 100%;
  height: 60px;
  background: transparent;
  border: 2px dashed #e0dcdc;
  border-radius: 8px;
  color: #e0dcdc;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 5px;
  outline: none;
  &:hover {
    color: #fff;
    border-color: #fff;
  }
`;

export const NewTask = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 12px;
  margin: 5px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  animation: ${expand} 0.4s ease forwards;
`;

export const TaskInput = styled.input`
  width: 90%;
  margin: 10px auto;
  font-size: 30px;
  border: none;
  outline: none;
`;

export const TaskTimeInput = styled.input`
  width: 50px;
  font-size: 20px;
  margin: 4px 0 10px 24px;
  background: #efefef;
  border: none;
  border-radius: 8px;
  padding: 6px;
  color: #858585;
  outline: none;
`;

export const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const timeButtonStyles = `
  padding: 8px 12px;
  margin: 6px 2px 10px 0;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  background: #fff;
  color: #555;
  cursor: pointer;
  opacity: 0.9;
  box-shadow: rgba(0,0,0,0.2) 0 2px 2px;
`;

export const IncrementButton = styled.button`
  ${timeButtonStyles}
`;

export const DecrementButton = styled.button`
  ${timeButtonStyles}
`;

export const NewTaskBottom = styled.div`
  background: #efefef;
  height: 30%;
  display: flex;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  margin: 4px 5px;
  padding: 0;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  color: #998e8e;
  background: transparent;
  &:hover { color: #5f5b5b; }
`;

export const AddButton = styled.button`
  margin: 4px 5px;
  padding: 0;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  color: #fff;
  background: #2e2e38;
  &:hover { background: #1f1919; }
`;

export const TaskItem = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2px 0;
  padding: 8px 12px;
  background: #fff;
  color: #555;
  border: 1px solid #dfdfdf;
  box-shadow: rgba(0,0,0,0.2) 0 2px 2px;
  border-radius: 6px;
  height: 45px;
  cursor: pointer;
  opacity: 0.9;
  border-left: 5px solid ${({ selected }) => (selected ? "#222" : "transparent")};
  &:hover {
    border-left-color: #e0dcdc;
  }
`;

export const DeleteTaskButton = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  color: #e0dcdc;
  cursor: pointer;
  &:hover { color: #858585; }
`;

export const NoTasksMessage = styled.p`
  color: #e0dcdc;
  font-weight: bold;
  cursor: default;
  &:hover { color: #fff; }
`;

export const TaskContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const TimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 10px;
`;

export const TimeWorked = styled.p`
  font-size: 12px;
  margin: 0;
`;

export const EstTime = styled.p`
  font-size: 10px;
  margin: 0 54px 0 0;
`;

export const TaskSettings = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  width: 160px;
  height: 90px;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 5px 0;
  z-index: 9999;
`;

export const ClearButton = styled.button`
  width: 100%;
  background: #fff;
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #ccc; }
`;
