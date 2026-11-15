import styled from "styled-components";

// TODO: 홈 화면 구현 전 빈 페이지
export default function HomePage() {
  return (
    <Wrapper>
      <Title>홈</Title>
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
