import styled from "styled-components";
import ModalBase from "./ModalBase";
import CommonButton from "../button/CommonButton";

export default function VerifiedPopupModal({
  isOpen,
  onClose,
  popups = [],
  isLoading = false,
}) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} $width={330}>
      <Container>
        <Title>현재 인증된 팝업</Title>

        {isLoading ? (
          <Message>팝업 목록을 불러오는 중입니다.</Message>
        ) : popups.length > 0 ? (
          <PopupList>
            {popups.map((popup) => (
              <PopupItem key={popup.popupId}>{popup.name}</PopupItem>
            ))}
          </PopupList>
        ) : (
          <Message>현재 인증된 팝업이 없습니다.</Message>
        )}

        <CommonButton
          $width={288}
          $height={48}
          $fontSize={16}
          onClick={onClose}
        >
          확인
        </CommonButton>
      </Container>
    </ModalBase>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Title = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #141414;
`;

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  color: #727272;
  text-align: center;
`;

const PopupList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  overflow: hidden;
`;

const PopupItem = styled.li`
  padding: 12px;
  font-size: 14px;
  color: #141414;

  &:not(:last-child) {
    border-bottom: 1px solid #e3e3e3;
  }
`;
