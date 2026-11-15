import { useState } from "react";
import CommonButton from "../../components/button/CommonButton";
import ToggleIconButton from "../../components/button/ToggleIconButton";

import homeGray from "../../assets/images/icon/home-gray.svg";
import homePink from "../../assets/images/icon/home-pink.svg";
import CommonInput from "../../components/input/CommonInput";
import SearchBar from "../../components/input/SearchBar";
import StatusBadge from "../../components/badge/StatusBadge";
import CategoryButton from "../../components/button/CategoryButton";
import TopBar from "../../components/bar/TopBar";
import ModalBase from "../../components/modal/ModalBase";
import LocationButton from "../../components/button/LocationButton";

// 에셋 확인용: assets/images 아래 SVG를 자동으로 모은다
const assetImages = import.meta.glob("../../assets/images/**/*.svg", {
  eager: true,
  import: "default",
});

function TestPage() {
  // 탭바 useState
  const [activeTab, setActiveTab] = useState("my");

  const tabs = [
    { label: "내 현장 팝업", value: "my" },
    { label: "전체 교환", value: "all" },
  ];

  // 모달 useState
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div
        style={{
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <CommonInput placeholder="아이디를 입력해주세요" $width={338} />

        <CommonInput type="password" placeholder="비밀번호를 입력해주세요" />

        <CommonInput placeholder="입력할 수 없습니다" disabled />
      </div>

      <CommonButton>로그인</CommonButton>
      <CommonButton variant="secondary">회원가입</CommonButton>

      <CommonButton $width={354} $borderRadius={10000}>
        상품 교환하기
      </CommonButton>

      <div style={{ padding: "30px" }}>
        <ToggleIconButton
          inactiveIcon={homeGray}
          activeIcon={homePink}
          $width={40}
          $height={40}
          $iconSize={28}
        />
      </div>

      <div style={{ padding: "8px 0" }}>
        <SearchBar placeholder="궁금한 팝업을 검색해 보세요" />
      </div>

      <div style={{ display: "flex", gap: "12px", padding: "40px" }}>
        <StatusBadge type="popup" status="upcoming" />
        <StatusBadge type="popup" status="ongoing" />
        <StatusBadge type="popup" status="completed" />

        <StatusBadge type="reservation" status="ongoing" />
        <StatusBadge type="reservation" status="completed" />
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
        <CategoryButton>서울 전체</CategoryButton>
        <CategoryButton>강남/서초</CategoryButton>
        <CategoryButton defaultSelected={true}>경상권</CategoryButton>
        <CategoryButton>종로/광화문</CategoryButton>
      </div>

      <div>
        <TopBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div>
          {activeTab === "my" ? (
            <p>내 현장 팝업 목록</p>
          ) : (
            <p>전체 교환 목록</p>
          )}
        </div>
      </div>

      <div style={{ padding: "40px" }}>
        <CommonButton
          $width={160}
          $height={44}
          $fontSize={14}
          onClick={() => setIsModalOpen(true)}
        >
          모달 열기
        </CommonButton>

        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          $width={330}
        >
          <CommonButton
            $width={278}
            $height={46}
            $fontSize={16}
            onClick={() => setIsModalOpen(false)}
          >
            교환 확정
          </CommonButton>
        </ModalBase>
      </div>
      <div>
        <LocationButton onClick={() => alert("위치 버튼 클릭!")}>
          위치 인증
        </LocationButton>
      </div>

      {/* 에셋 확인 */}
      <div style={{ padding: "40px 20px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>에셋</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {Object.entries(assetImages).map(([path, src]) => (
            <div
              key={path}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                fontSize: "10px",
              }}
            >
              <img src={src} alt="" style={{ outline: "1px dashed #d0d0d0" }} />
              <span>{path.split("assets/images/")[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestPage;
