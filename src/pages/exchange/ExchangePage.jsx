import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import TopBar from "../../components/bar/TopBar";
import FloatingAddButton from "../../components/button/FloatingAddButton";
import LocationVerifyModal from "../../components/modal/LocationVerifyModal";
import MyLocationPopupList from "./MyLocationPopupList";
import AllExchangeList from "./AllExchangeList";

import useApi from "../../hooks/useApi";
import { getMyVerifiedPopups } from "../../api/exchangeApi";
import { likePopup, unlikePopup } from "../../api/popupApi";

const TABS = [
  { label: "내 현장 팝업", value: "my" },
  { label: "전체 교환", value: "all" },
];

// 교환 탭 (피그마 내 현장 팝업 293:9930, 전체 교환 447:21626)
// - 탭은 쿼리(?tab=all)로 관리 → 교환글 상세에서 뒤로 와도 보던 탭 유지
// - "+" 버튼은 두 탭 모두, 위치 인증 여부와 상관없이 표시 (전체 교환 피그마에는 빠져 있음)
export default function ExchangePage() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "all" ? "all" : "my";

  // 탭 전환은 기록을 쌓지 않음 (뒤로가기 시 탭이 아니라 이전 페이지로)
  const handleTabChange = (tab) =>
    setSearchParams(tab === "all" ? { tab: "all" } : {}, { replace: true });

  // ===== 위치 인증 (위치 인증 도메인은 다른 프론트 팀원 담당) =====
  // 인증 여부·내 현장 팝업 목록 (이 화면에 들어올 때 한 번 조회)
  const {
    data: verification,
    setData: setVerification,
    isLoading: isVerificationLoading,
    error: verificationError,
    refetch: refetchVerification,
  } = useApi(getMyVerifiedPopups, []);

  // ===== 내 현장 팝업 찜 (팝업 탭 포스터 카드와 같은 방식, 찜 여부·찜 수는 인증 목록 응답 그대로) =====
  // 저장 후 서버가 준 찜 여부·찜 수로 갱신. 실패하면 에러를 그대로 던짐 (되돌리기·로그인 모달은 목록에서 처리)
  const handlePopupLikeChange = async (popupId, nextLiked) => {
    const result = nextLiked
      ? await likePopup(popupId)
      : await unlikePopup(popupId);

    setVerification((prev) => ({
      ...prev,
      popups: prev.popups.map((popup) =>
        popup.id === popupId ? { ...popup, ...result } : popup,
      ),
    }));
  };

  // 위치 인증 성공 시 내 현장 팝업을 다시 불러옴
  // - 헤더 위치 버튼: Header가 인증 상태·모달을 직접 관리하고, 성공하면 onLocationVerified로 알려 줌
  // - 내 현장 팝업 "위치 인증하러 가기" 버튼: 이 화면에서 위치 인증 모달(담당 팀원 컴포넌트)을 엶
  // - 다른 탭에서 인증하고 오면 이 화면에 들어올 때 새로 조회하므로 바로 반영됨
  // TODO(위치 인증): 위치 인증 상태가 전역으로 관리되면 그 상태를 쓰도록 교체
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const handleVerifyLocation = () => setIsLocationModalOpen(true);

  return (
    <>
      <Header
        variant="main"
        showLocationButton
        onLocationVerified={refetchVerification}
      />

      <TopBar tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === "my" ? (
        <MyLocationPopupList
          verification={verification}
          isLoading={isVerificationLoading}
          error={verificationError}
          onRetry={refetchVerification}
          onVerifyClick={handleVerifyLocation}
          onLikeChange={handlePopupLikeChange}
        />
      ) : (
        <AllExchangeList />
      )}

      {/* 팝업은 작성 화면에서 선택 (넘기는 popupId 없음) */}
      <FloatingAddButton
        aria-label="교환글 작성"
        onClick={() => navigate("/exchange/write")}
      />

      {/* 열 때마다 처음 단계부터 시작하도록 열려 있을 때만 그림 (Header와 같은 방식) */}
      {isLocationModalOpen && (
        <LocationVerifyModal
          isOpen
          onClose={() => setIsLocationModalOpen(false)}
          onVerified={refetchVerification}
        />
      )}
    </>
  );
}
