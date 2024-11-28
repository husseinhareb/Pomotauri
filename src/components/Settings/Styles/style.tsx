// Settings.styled.ts
import styled from 'styled-components';

export const SettingsWindow = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 600px;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  border-radius: 8px;
`;

export const CloseSettingsButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

export const TimerTitle = styled.h3`
  text-align: center;
  color: #aaaaaa;
`;

export const TimerSection = styled.div`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h4`
  color: #aaaaaa;
  display: flex;
  align-items: center;
`;

export const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #626262;
  font-weight: 500;
`;

export const InputField = styled.div`
  margin-left: 50px;
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  width: 60px;
  height: 30px;
  padding: 6px;
  background-color: #efefef;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: #b1b1b1;
`;

export const SubmitButtonWrapper = styled.div`
  background-color: #efefef;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 8%;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
`;

export const SubmitButton = styled.button`
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 60px;
  height: 30px;
  border: none;
  font-size: 15px;
  background-color: rgb(46, 46, 56);
  border-radius: 6px;
  color: #efefef;
  font-weight: 500;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: rgb(31, 25, 25);
  }
`;

export const Hr = styled.hr`
  width: 100%;
  border-top: 1px solid #ccc;
`;

export const TimerForm = styled.form`
  padding-bottom: 40px;
`;
