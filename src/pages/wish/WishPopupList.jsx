import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PopupCard from "../../components/card/PopupCard";

import { wishPopups } from "../../data/wishDummyData";

// 찜 탭 - 찜한 팝업 (피그마 474:23011)
// - 카드 클릭 → 팝업 상세 → "상품 교환하기" → 해당 팝업 교환 보드 (기존 흐름)
// - 하트를 해제해도 목록에서 바로 빼지 않음 (다음에 목록을 불러올 때 빠짐, 실수로 눌러도 다시 찜 가능)
export default function WishPopupList() {
  const navigate = useNavigate();

  // TODO(API): 찜한 팝업 목록 조회 API 연동 시 더미 데이터 교체
  if (wishPopups.length === 0) {
    // TODO: 빈 목록 디자인 확정 후 교체
    return <EmptyText>아직 찜한 팝업이 없어요</EmptyText>;
  }

  return (
    <PopupGrid>
      {wishPopups.map((popup) => (
        <PopupCard
          key={popup.id}
          {...popup}
          showLikeButton
          onClick={() => navigate(`/popup/${popup.id}`)}
        />
      ))}
    </PopupGrid>
  );
}

// 피그마 474:23019: padding 24, 2열 간격 10 / 행 간격 32
const PopupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 10px;
  row-gap: 32px;
  padding: 24px;
`;

const EmptyText = styled.p`
  margin: 0;
  padding: 80px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[700]};
  ${({ theme }) => theme.typography.body3};
`;
