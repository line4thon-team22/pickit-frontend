import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import CategoryButton from "../../components/button/CategoryButton";
import CommonButton from "../../components/button/CommonButton";
import { POPUP_FILTER_GROUPS } from "../../data/popupDummyData";

export default function InterestSettingPage() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories =
    POPUP_FILTER_GROUPS.find((group) => group.key === "category")?.options ??
    [];

  const handleCategoryClick = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleComplete = () => {
    // TODO(API): 관심 카테고리 저장
    console.log("선택한 관심 카테고리:", selectedCategories);

    navigate("/", {
      state: { showInterestModal: true },
    });
  };

  return (
    <Container>
      <Main>
        <Title>
          어떤 주제에
          <br />
          관심이 있으신가요?
        </Title>

        <Description>
          기본 관심사는 <Highlight>최대 3개</Highlight>까지 선택할 수 있으며,
          <br />
          <Highlight>피킷 프리미엄</Highlight> 가입 시 더 많은 관심사를 추가할
          수 있습니다.
        </Description>

        <SectionTitle>카테고리</SectionTitle>

        <CategoryList>
          {categories.map((category) => (
            <CategoryButton
              key={category.value}
              selected={selectedCategories.includes(category.value)}
              onChange={() => handleCategoryClick(category.value)}
            >
              {category.label}
            </CategoryButton>
          ))}
        </CategoryList>
      </Main>

      <Bottom>
        <CommonButton
          $width={354}
          $height={60}
          $fontSize={20}
          $borderRadius={10000}
          onClick={handleComplete}
        >
          선택 완료
        </CommonButton>
      </Bottom>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`;

const Main = styled.main`
  flex: 1;
  padding: 24px 20px 32px;
`;

const Title = styled.h1`
  margin: 0 0 10px;
  font-size: 32px;
  font-weight: 700;
  color: #141414;
`;

const Description = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  color: #727272;
  font-weight: 300;
`;

const Highlight = styled.span`
  color: #ff006a;
`;

const SectionTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 600;
  color: #141414;
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 24px 32px;
  background: #ffffff;
`;
