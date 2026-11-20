import styled from "styled-components";

export default function ModalBase({ isOpen, onClose, children, ...props }) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()} {...props}>
        {children}
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: ${({ $width }) => $width || 330}px;
  border-radius: 12px;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
`;
