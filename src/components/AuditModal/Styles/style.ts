import styled, { keyframes } from "styled-components";

// Fade-in animation for overlay
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Slide-down animation for modal content
const slideDown = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 85%;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: ${slideDown} 0.4s ease-out;

  /* Custom scroll bar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #e0e0e0;
    transform: scale(1.1);
  }

  &:active {
    background: #d0d0d0;
    transform: scale(0.95);
  }
`;
