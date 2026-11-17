import styled from "styled-components";
import Header from "../../components/header/Header";

// TODO: 레이아웃 확인용 빈 페이지 (담당자가 실제 화면으로 구현)
export default function MyPage() {
  return (
    <>
      <Header variant="back" />
      <Wrapper>
        <Title>내 정보</Title>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
`;
