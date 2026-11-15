import styled from "styled-components";

// TODO: 레이아웃 확인용 빈 페이지 (커밋 전 삭제)
export default function WishPage() {
  return (
    <Wrapper>
      <Title>찜</Title>
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
