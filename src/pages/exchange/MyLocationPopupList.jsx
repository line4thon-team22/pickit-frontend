import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PopupCard from "../../components/card/PopupCard";
import BlurOverlay from "../../components/area/BlurOverlay";
import LoginBlurOverlay from "../../components/area/LoginBlurOverlay";
import LoginRequiredModal from "../../components/modal/LoginRequiredModal";

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
//   verification: { isVerified, popups } (exchangeApi getMyVerifiedPopups, popups에 isLiked 포함)
// - 카드 찜 하트: 팝업 탭 포스터 카드와 같은 위치·아이콘·동작
//   onLikeChange(popupId, nextLiked): 저장·데이터 갱신은 ExchangePage, 실패하면 에러를 던짐
export default function MyLocationPopupList({
  verification,
  isLoading,
  error,
  onRetry,
  onVerifyClick,
  onLikeChange,
}) {
  const navigate = useNavigate();

  // ===== 찜 (PopupPage와 같은 방식) =====
  // 하트는 누르는 즉시 바뀌고(카드 안 ToggleIconButton), 그 다음 서버에 저장
  // - 실패: 하트를 원래대로 되돌림 (카드 key를 바꿔 다시 그려서 isLiked로 초기화)
  // - 로그인 안 됨(401): 되돌리고 로그인 안내 모달
  const [revertCounts, setRevertCounts] = useState({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLikeChange = async (popupId, nextLiked) => {
    try {
      await onLikeChange?.(popupId, nextLiked);
    } catch (err) {
      setRevertCounts((prev) => ({
        ...prev,
        [popupId]: (prev[popupId] ?? 0) + 1,
      }));

      if (err.status === 401) setIsLoginModalOpen(true);
      // TODO: 그 밖의 실패 안내(토스트 등) 디자인 확정되면 추가
    }
  };

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
    return <LoginBlurOverlay>{blurredBackground}</LoginBlurOverlay>;
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

  // 찜 하트: 팝업 탭 포스터 카드와 같은 위치·아이콘 (PopupCard showLikeButton)
  return (
    <>
      <PopupGrid>
        {verification.popups.map((popup) => (
          <PopupCard
            key={`${popup.id}-${revertCounts[popup.id] ?? 0}`}
            {...popup}
            showLikeButton
            onClick={() => navigate(`/exchange/board/${popup.id}`)}
            onLikeChange={(nextLiked) => handleLikeChange(popup.id, nextLiked)}
          />
        ))}
      </PopupGrid>

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
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
