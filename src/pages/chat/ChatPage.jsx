import { Link } from "react-router-dom";
import styled from "styled-components";

// TODO: 레이아웃 확인용 빈 페이지 (커밋 전 삭제)
export default function ChatPage() {
  return (
    <Wrapper>
      <Title>채팅</Title>
      <Link to="/chat/1">채팅방으로 이동</Link>
    </Wrapper>
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
