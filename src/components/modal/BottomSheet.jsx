import styled, { keyframes } from "styled-components";

// 아래에서 올라오는 바텀시트 (피그마 필터 바텀시트 257:6153, 배경 딤 293:7653)
// - 사용법은 ModalBase와 같음: isOpen, onClose, children
// - 좌우 여백은 넣지 않음 (안쪽 내용에서 정함)
// TODO: 닫힘 애니메이션 (지금은 열릴 때만 애니메이션, 닫힐 때는 바로 사라짐)
// TODO: 핸들을 끌어서 닫기
export default function BottomSheet({ isOpen, onClose, children, ...props }) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Sheet
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <Handle />
        <Content>{children}</Content>
      </Sheet>
    </Overlay>
  );
}

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;

const Sheet = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  max-height: 90dvh;
  padding-top: 10px;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;

  border-radius: 12px 12px 0 0;
  background-color: #ffffff;

  animation: ${slideUp} 0.25s ease-out;
`;

const Handle = styled.div`
  flex-shrink: 0;
  width: 72px;
  height: 8px;
  margin-bottom: 32px;
  border-radius: 10000px;
  background-color: #d9d9d9;
`;

// 내용이 길면 시트 안에서 스크롤
const Content = styled.div`
  width: 100%;
  min-height: 0;
  overflow-y: auto;
`;
