// Styles/style.ts
import styled, { keyframes } from "styled-components";

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
  height: 100px;
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

  &:hover {
    color: #fff;
  }
`;

export const TasksSettingsButton = styled.button`
  background-color: transparent;
  border: 0;
  font-size: 20px;
  color: #e0dcdc;
  cursor: pointer;
  margin-top: 10px;
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    color: #fff;
  }
`;

export const TaskHr = styled.hr`
  border: none;
  height: 2px;
  background-color: #fff;
`;

export const TaskList = styled.div`
  overflow: hidden;
  max-height: 262px;

  &:hover {
    overflow: auto;
  }
`;

export const AddTaskWrapper = styled.div`
  background-color: transparent;
`;

export const AddTaskButton = styled.button`
  width: 100%;
  height: 60px;
  background-color: transparent;
  border: 2px dashed #e0dcdc;
  cursor: pointer;
  border-radius: 8px;
  outline: none;
  color: #e0dcdc;
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;

  &:hover {
    color: #ffffff;
    border: 2px dashed #ffffff;
  }
`;

export const NewTask = styled.form`
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 5px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  animation: ${expand} 0.4s ease forwards;
`;

export const TaskInput = styled.input`
  width: 90%;
  margin: 0 auto;
  margin-top: 10px;
  border: 0;
  outline: none;
  font-size: 30px;
  margin-bottom: 10px;
`;

export const TaskTimeInput = styled.input`
  width: 50px;
  font-size: 20px;
  margin-left: 24px;
  margin-top: 4px;
  margin-bottom: 10px;
  background-color: #efefef;
  border: 0;
  border-radius: 8px;
  padding: 6px;
  color: #858585;
  outline: none;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const TimeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const DecrementButton = styled.button`
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.9;
  font-size: 14px;
  padding: 8px 12px;
  display: inline-block;
  background-color: white;
  color: rgb(85, 85, 85);
  border: 1px solid rgb(223, 223, 223);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 2px;
  margin-left: 2px;
  margin-top: 6px;
  margin-bottom: 10px;
`;

export const IncrementButton = styled.button`
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.9;
  font-size: 14px;
  padding: 8px 12px;
  display: inline-block;
  background-color: white;
  color: rgb(85, 85, 85);
  border: 1px solid rgb(223, 223, 223);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 2px;
  margin-left: 2px;
  margin-top: 6px;
  margin-bottom: 10px;
`;

export const NewTaskBottom = styled.div`
  background-color: #efefef;
  bottom: 10px;
  margin-top: auto;
  height: 30%;
  display: flex;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  outline: none;
  margin-left: 5px;
  margin-right: 5px;
  border: 0;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 15px;
  border-radius: 6px;
  cursor: pointer;
  color: #998e8e;
  background-color: transparent;

  &:hover {
    color: #5f5b5b;
  }
`;

export const AddButton = styled.button`
  outline: none;
  margin-left: 5px;
  margin-right: 5px;
  border: 0;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 15px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  background-color: rgb(46, 46, 56);

  &:hover {
    background-color: rgb(31, 25, 25);
  }
`;

export const TaskItem = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;             /* more space between items */
  cursor: pointer;
  border-radius: 6px;
  text-align: center;
  opacity: 0.9;
  font-size: 14px;
  padding: 12px 16px;        /* vertical + horizontal padding */
  background-color: white;
  color: rgb(85, 85, 85);
  border: 1px solid rgb(223, 223, 223);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 2px;
  min-height: 60px;          /* ensure at least 60px tall */
  border-left: 5px solid
    ${({ selected }) => (selected ? "#222222" : "transparent")};

  &:hover {
    border-left-color: #e0dcdc;
  }
`;

export const DeleteTaskButton = styled.button`
  border: 0;
  background-color: transparent;
  font-size: 18px;
  color: #e0dcdc;
  cursor: pointer;

  &:hover {
    color: #858585;
  }
`;

export const TaskSettings = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  width: 160px;
  height: 90px;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const ClearButton = styled.button`
  width: 100%;
  margin-top: 5px;
  background-color: white;
  border: 0;
  display: flex;
  align-items: flex-start;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background-color: #ccc;
    cursor: pointer;
  }
`;

export const NoTasksMessage = styled.p`
  color: #e0dcdc;
  font-weight: bold;
  cursor: default;

  &:hover {
    color: white;
  }
`;

export const TaskContentWrapper = styled.div`
  display: flex;
  align-items: center;
   input[type='checkbox'] {
  width: 20px;      
   height: 20px;
   margin-right: 12px;
   cursor: pointer;
}
  

`;

export const TimerWrapper = styled.div`
  border-left: 2px solid #222222;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 10px;
  padding-left: 4px;
`;
export const TimeWorked = styled.p`
  font-size: 14px;
  margin: 0 0 4px 0;
`;

export const EstTime = styled.p`
  font-size: 10px;
  margin: 0 54px 0 0;
`;

