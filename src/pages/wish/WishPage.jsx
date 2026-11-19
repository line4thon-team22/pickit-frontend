import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import TopBar from "../../components/bar/TopBar";
import LocationVerifyModal from "../../components/modal/LocationVerifyModal";
import WishPopupList from "./WishPopupList";
import WishItemList from "./WishItemList";

import useApi from "../../hooks/useApi";
import { getMyVerifiedPopups } from "../../api/exchangeApi";

const TABS = [
  { label: "찜한 팝업", value: "popup" },
  { label: "찜한 아이템", value: "item" },
];

// 찜 탭 (피그마 찜한 팝업 474:23011, 찜한 아이템 474:23025)
// - 탭은 쿼리(?tab=item)로 관리 → 상세에서 뒤로 와도 보던 탭 유지
export default function WishPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "item" ? "item" : "popup";

  // 탭 전환은 기록을 쌓지 않음 (뒤로가기 시 탭이 아니라 이전 페이지로)
  const handleTabChange = (tab) =>
    setSearchParams(tab === "item" ? { tab: "item" } : {}, { replace: true });

  // ===== 헤더 위치 버튼 (위치 인증 도메인은 다른 프론트 팀원 담당, 교환 탭 ExchangePage와 같은 방식) =====
  // 인증 여부: 로그아웃·에러면 미인증("위치 인증")으로 표시
  // TODO(위치 인증): 담당 팀원의 전역 상태로 교체
  const { data: verification, refetch: refetchVerification } = useApi(
    getMyVerifiedPopups,
    [],
  );

  // "위치 인증"·"팝업 확인"(인증 후 이름만 바뀜) 모두 위치 인증 모달, 닫으면 인증 여부 다시 조회
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const handleVerifyLocation = () => setIsLocationModalOpen(true);
  const handleLocationModalClose = () => {
    setIsLocationModalOpen(false);
    refetchVerification();
  };

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

      {activeTab === "popup" ? <WishPopupList /> : <WishItemList />}

      {/* 열 때마다 처음 단계부터 시작하도록 열려 있을 때만 그림 (Header와 같은 방식) */}
      {isLocationModalOpen && (
        <LocationVerifyModal isOpen onClose={handleLocationModalClose} />
      )}
    </>
  );
}
