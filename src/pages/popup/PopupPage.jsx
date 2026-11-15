import { Link } from "react-router-dom";
import styled from "styled-components";

// TODO: 레이아웃 확인용 빈 페이지 (커밋 전 삭제)
export default function PopupPage() {
  return (
    <Wrapper>
      <Title>팝업</Title>
      <Link to="/popup/1">팝업 상세로 이동</Link>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* 스크롤 확인용 높이 */
  min-height: 1200px;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
`;
