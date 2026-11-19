import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import CategoryButton from "../../components/button/CategoryButton";
import CommonButton from "../../components/button/CommonButton";
import {
  getCategories,
  getMyInterests,
  updateMyInterests,
} from "../../api/interestApi";

export default function InterestSettingPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxCount, setMaxCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadInterests = async () => {
      try {
        const [categoryData, interestData] = await Promise.all([
          getCategories(),
          getMyInterests(),
        ]);

        console.log("전체 카테고리 목록:", categoryData);
        console.log("내가 저장한 관심사:", interestData);

        if (!active) return;

        setCategories(categoryData);
        setSelectedCategories(
          interestData.interests.map((item) => item.categoryId),
        );
        setMaxCount(interestData.maxCount);
      } catch (error) {
        console.error("관심사 조회 실패:", error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadInterests();

    return () => {
      active = false;
    };
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }

      if (prev.length >= maxCount) {
        alert(`관심사는 최대 ${maxCount}개까지 선택할 수 있습니다.`);
        return prev;
      }

      return [...prev, categoryId];
    });
  };

  const handleComplete = async () => {
    if (isSaving || isLoading) return;

    try {
      setIsSaving(true);

      const data = await updateMyInterests(selectedCategories);

      console.log("💗 관심사 저장 결과:", data);

      navigate("/", {
        state: { showInterestModal: true },
      });
    } catch (error) {
      console.error("관심사 저장 실패:", error);
      alert("관심사 저장에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
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
              key={category.categoryId}
              selected={selectedCategories.includes(category.categoryId)}
              onChange={() => handleCategoryClick(category.categoryId)}
            >
              {category.name}
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
          {isSaving ? "저장 중..." : "선택 완료"}
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
