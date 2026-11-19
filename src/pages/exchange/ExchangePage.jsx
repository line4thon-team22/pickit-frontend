import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import TopBar from "../../components/bar/TopBar";
import FloatingAddButton from "../../components/button/FloatingAddButton";
import MyLocationPopupList from "./MyLocationPopupList";
import AllExchangeList from "./AllExchangeList";

import useApi from "../../hooks/useApi";
import { getMyVerifiedPopups } from "../../api/exchangeApi";

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
  // 인증 여부·내 현장 팝업 목록: 헤더 위치 버튼과 내 현장 팝업 탭이 같이 씀
  // TODO(위치 인증): 담당 팀원의 전역 상태로 교체 (지금은 이 화면에 들어올 때 한 번 조회)
  const {
    data: verification,
    isLoading: isVerificationLoading,
    error: verificationError,
    refetch: refetchVerification,
  } = useApi(getMyVerifiedPopups, []);

  // 헤더 "위치 인증"·"팝업 확인"(인증 후 이름만 바뀜)·오버레이 버튼 모두 같은 위치 인증 흐름
  // TODO(위치 인증): 담당 팀원의 위치 인증 흐름(확인 모달 → 위치 검색 → 인증)으로 교체
  // 개발 중 인증 테스트는 Console 위치 인증 스크립트 실행 후 새로고침 (docs/notes/api-integration-handoff.md)
  const handleVerifyLocation = () => alert("위치 인증 기능을 준비하고 있어요");

  return (
    <>
      <Header
        variant="main"
        showLocationButton
        isLocationVerified={verification?.isVerified ?? false}
        onLocationClick={handleVerifyLocation}
        onPopupCheckClick={handleVerifyLocation}
      />

      <TopBar tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === "my" ? (
        <MyLocationPopupList
          verification={verification}
          isLoading={isVerificationLoading}
          error={verificationError}
          onRetry={refetchVerification}
          onVerifyClick={handleVerifyLocation}
        />
      ) : (
        <AllExchangeList />
      )}

      {/* 팝업은 작성 화면에서 선택 (넘기는 popupId 없음) */}
      <FloatingAddButton
        aria-label="교환글 작성"
        onClick={() => navigate("/exchange/write")}
      />
    </>
  );
}
