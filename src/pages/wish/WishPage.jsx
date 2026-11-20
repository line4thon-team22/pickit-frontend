import { useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import TopBar from "../../components/bar/TopBar";
import WishPopupList from "./WishPopupList";
import WishItemList from "./WishItemList";

const TABS = [
  { label: "찜한 팝업", value: "popup" },
  { label: "찜한 아이템", value: "item" },
];

// 찜 탭 (피그마 찜한 팝업 474:23011, 찜한 아이템 474:23025)
// - 탭은 쿼리(?tab=item)로 관리 → 상세에서 뒤로 와도 보던 탭 유지
// - 헤더 위치 버튼은 Header가 인증 상태·모달을 직접 관리함
export default function WishPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "item" ? "item" : "popup";

  // 탭 전환은 기록을 쌓지 않음 (뒤로가기 시 탭이 아니라 이전 페이지로)
  const handleTabChange = (tab) =>
    setSearchParams(tab === "item" ? { tab: "item" } : {}, { replace: true });

  return (
    <>
      <Header variant="main" showLocationButton />

      <TopBar tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === "popup" ? <WishPopupList /> : <WishItemList />}
    </>
  );
}
