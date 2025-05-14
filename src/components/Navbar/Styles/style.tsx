// Navbar/Styles/style.ts
import styled from "styled-components";

export const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  margin: 15px auto 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #3f3d3d;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
`;

export const LeftItems = styled.div`
  display: flex;
  align-items: center;

  /* push the clock a bit to the right of title */
  & > ${List} {
    margin-left: 10px;
  }
`;

export const RightItems = styled.div`
  display: flex;
  align-items: center;

  /* space items */
  ${List} li {
    margin-left: 10px;
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: 2px solid #ffacacaa;
  border-radius: 4px;
  font-size: 14px;
  padding: 5px;
  color: #f7e3e3;
  cursor: pointer;
  font-weight: 600;
  outline: none;

  &:hover {
    font-weight: 800;
    color: #ffffff;
  }

  /* icon spacing & sizing */
  svg {
    margin-right: 5px;
    height: 14px;
    width: 14px;
    fill: currentColor;
  }
`;

export const ClockText = styled.span`
  color: #f7e3e3;
  font-weight: 600;
`;
