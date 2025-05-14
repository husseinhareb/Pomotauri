// src/components/AuditModal/AuditModal.styles.ts
import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  max-width: 95%;
  max-height: 95%;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  position: relative;
`;

export const CloseBtn = styled.button`
  position: absolute; top: 12px; right: 12px;
  background: transparent; border: none; font-size: 24px;
  cursor: pointer;
`;
