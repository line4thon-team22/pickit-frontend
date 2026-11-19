import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PopupCard from "../../components/card/PopupCard";
import BlurOverlay from "../../components/area/BlurOverlay";

import useApi from "../../hooks/useApi";
import { getPopups } from "../../api/popupApi";
import RequestStateView from "./RequestStateView";

// 미인증 흐린 배경에 깔 팝업 개수 (2열 2줄)
const BACKGROUND_POPUP_COUNT = 4;

// 교환 탭 - 내 현장 팝업 (피그마 293:9930)
// - 위치 인증 O: 내 현재 위치에 있는 팝업 목록 → 클릭 시 해당 팝업의 교환 보드로 이동
// - 위치 인증 X: 팝업 몇 개를 흐리게 깔고 위치 인증 안내를 띄움
// - 로그인 X(401): 같은 흐린 배경에 로그인 안내 (문구는 LoginRequiredModal과 같게)
// - 인증 여부·목록(verification)은 ExchangePage가 받아서 넘김 (헤더 위치 버튼과 같이 씀)
//   verification: { isVerified, popups } (exchangeApi getMyVerifiedPopups)
export default function MyLocationPopupList({
  verification,
  isLoading,
  error,
  onRetry,
  onVerifyClick,
}) {
  const navigate = useNavigate();

  const isLoggedOut = error?.status === 401;
  const isUnverified = verification?.isVerified === false;

  // 흐린 배경이 필요할 때만 팝업을 받아옴 (서버에 내 현장 팝업 데이터가 없어서 팝업 목록 앞쪽 사용)
  const needsBackground = isLoggedOut || isUnverified;
  const { data: backgroundPopups } = useApi(
    () => (needsBackground ? getPopups() : Promise.resolve([])),
    [needsBackground],
  );

  // 흐린 배경 (배경 팝업을 못 받아와도 안내는 그대로 보임)
  const blurredBackground = (
    <PopupGrid $isBlurred>
      {(backgroundPopups ?? [])
        .slice(0, BACKGROUND_POPUP_COUNT)
        .map((popup) => (
          <PopupCard key={popup.id} {...popup} />
        ))}
    </PopupGrid>
  );

  if (isLoading) return <RequestStateView message="불러오는 중이에요" />;

  if (isLoggedOut) {
    // TODO: 로그인 안내 디자인 확정되면 수정 (지금은 위치 미인증 화면과 같은 모양)
    return (
      <BlurOverlay
        title="로그인이 필요한 서비스입니다."
        description="로그인하고 PICKIT의 다양한 기능을 이용해 보세요!"
        buttonText="로그인하러 가기"
        onButtonClick={() => navigate("/login")}
      >
        {blurredBackground}
      </BlurOverlay>
    );
  }

  if (error) {
    return (
      <RequestStateView
        message={error.message}
        action="retry"
        onRetry={onRetry}
      />
    );
  }

  if (!verification) return null;

  if (!verification.isVerified) {
    // 위치 미인증 예외 화면 (피그마 677:8158 문구, 모달 대신 흐린 배경 오버레이)
    return (
      <BlurOverlay
        title="위치 인증이 필요한 서비스입니다."
        description="위치 인증하고 팝업 현장에서 굿즈를 교환해 보세요!"
        buttonText="위치 인증하러 가기"
        onButtonClick={onVerifyClick}
      >
        {blurredBackground}
      </BlurOverlay>
    );
  }

  if (verification.popups.length === 0) {
    // TODO: 현장 팝업 없음 디자인 확정되면 수정
    return (
      <RequestStateView message="지금 계신 곳에서 진행 중인 팝업이 없어요" />
    );
  }

  return (
    <PopupGrid>
      {verification.popups.map((popup) => (
        <PopupCard
          key={popup.id}
          {...popup}
          onClick={() => navigate(`/exchange/board/${popup.id}`)}
        />
      ))}
    </PopupGrid>
  );
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
