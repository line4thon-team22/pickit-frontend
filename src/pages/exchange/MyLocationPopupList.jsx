import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PopupCard from "../../components/card/PopupCard";
import BlurOverlay from "../../components/area/BlurOverlay";

import { popups } from "../../data/popupDummyData";
import { myLocationPopupIds } from "../../data/exchangeDummyData";

// 교환 탭 - 내 현장 팝업 (피그마 293:9930)
// - 위치 인증 O: 내 현재 위치에 있는 팝업 목록 → 클릭 시 해당 팝업의 교환 보드로 이동
// - 위치 인증 X: 같은 목록을 흐리게 깔고 위치 인증 안내를 띄움
export default function MyLocationPopupList({
  isLocationVerified,
  onVerifyClick,
}) {
  const navigate = useNavigate();

  // TODO(API): 내 현재 위치 팝업 목록 조회 API 연동 시 더미 데이터 교체
  const myPopups = myLocationPopupIds
    .map((id) => popups.find((popup) => popup.id === id))
    .filter(Boolean);

  const popupGrid = (
    <PopupGrid $isBlurred={!isLocationVerified}>
      {myPopups.map((popup) => (
        <PopupCard
          key={popup.id}
          {...popup}
          onClick={() => navigate(`/exchange/board/${popup.id}`)}
        />
      ))}
    </PopupGrid>
  );

  if (!isLocationVerified) {
    // 위치 미인증 예외 화면 (피그마 677:8158 문구, 모달 대신 흐린 배경 오버레이)
    // 배경은 인증 후 보일 목록과 같은 더미 데이터를 흐리게 사용
    return (
      <BlurOverlay
        title="위치 인증이 필요한 서비스입니다."
        description="위치 인증하고 팝업 현장에서 굿즈를 교환해 보세요!"
        buttonText="위치 인증하러 가기"
        onButtonClick={onVerifyClick}
      >
        {popupGrid}
      </BlurOverlay>
    );
  }

  if (myPopups.length === 0) {
    // TODO: 현장 팝업 없음 디자인 확정되면 수정
    return <EmptyText>지금 계신 곳에서 진행 중인 팝업이 없어요</EmptyText>;
  }

  return popupGrid;
}

// 피그마 293:9930: 탭 아래 padding 24, 2열 간격 10 / 행 간격 32
// 흐린 배경일 때는 목록이 짧아도 안내 문구가 들어갈 높이를 확보
const PopupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 10px;
  row-gap: 32px;
  padding: 24px;
  min-height: ${({ $isBlurred }) => ($isBlurred ? "360px" : "auto")};
`;

const EmptyText = styled.p`
  margin: 0;
  padding: 80px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[700]};
  ${({ theme }) => theme.typography.body3};
`;
