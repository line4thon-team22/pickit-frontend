import styled from "styled-components";

// TODO: 레이아웃 확인용 빈 페이지 (커밋 전 삭제)
export default function PopupDetailPage() {
  return (
    <Wrapper>
      <Title>팝업 상세</Title>
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
