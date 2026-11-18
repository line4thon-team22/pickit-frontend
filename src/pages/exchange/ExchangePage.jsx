import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import TopBar from "../../components/bar/TopBar";
import FloatingAddButton from "../../components/button/FloatingAddButton";
import MyLocationPopupList from "./MyLocationPopupList";
import AllExchangeList from "./AllExchangeList";

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

  // TODO: 위치 인증 흐름·전역 상태 연결
  // 지금은 시연용으로 위치 인증 버튼을 누르면 이 화면 안에서만 인증 상태가 됨
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const handleVerifyLocation = () => setIsLocationVerified(true);

  return (
    <>
      <Header
        variant="main"
        showLocationButton
        isLocationVerified={isLocationVerified}
        onLocationClick={handleVerifyLocation}
      />

      <TopBar tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === "my" ? (
        <MyLocationPopupList
          isLocationVerified={isLocationVerified}
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
