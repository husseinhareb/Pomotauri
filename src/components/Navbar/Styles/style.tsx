// Navbar.styled.ts
import styled from "styled-components";

// Navbar container with flex layout and centered content
export const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  margin: 0 auto;
  margin-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #3f3d3d;
`;

// Style for unordered lists (left and right items)
export const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
`;

// Left items section (clock and title)
export const LeftItems = styled.div`
  display: flex;
  align-items: center;
`;

// Right items section (home and settings buttons)
export const RightItems = styled.div`
  display: flex;
  align-items: center;
`;

// Common button styling for home, settings, and title
export const Button = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
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
    color: white;
  }
`;

// Styling for the clock text
export const ClockText = styled.span`
  color: #f7e3e3;
  font-weight: 600;
`;
