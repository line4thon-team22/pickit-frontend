import styled from "styled-components";
import Header from "../../components/header/Header";

// TODO: 레이아웃 확인용 빈 페이지 (커밋 전 삭제)
export default function ChatRoomPage() {
  return (
    <>
      <Header variant="chat" user={{ nickname: "우사기", rating: 4.8 }} />
      <Wrapper>
        <Title>채팅방</Title>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
`;
