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
import LocationButton from "../../components/button/LocationButton";

import Header from "../../components/header/Header";
import BottomNav from "../../components/nav/BottomNav";
import Footer from "../../components/footer/Footer";

import RecommendCard from "../../components/card/RecomendCard";
import product1 from "../../assets/images/product/recommend1.png";

import PopupPosterCard from "../../components/card/PopupPosterCard";
import FilterChip from "../../components/button/FilterChip";
import BottomSheet from "../../components/modal/BottomSheet";
import { popups as popupList } from "../../data/popupDummyData";

import LoginRequiredModal from "../../components/modal/LoginRequiredModal";

import ExchangeCard from "../../components/card/ExchangeCard";
import PopupCard from "../../components/card/PopupCard";
import BlurOverlay from "../../components/area/BlurOverlay";
import LoginBlurOverlay from "../../components/area/LoginBlurOverlay";
import FloatingAddButton from "../../components/button/FloatingAddButton";
import { exchangePosts } from "../../data/exchangeDummyData";
import { getExchangeBadge, isTradeClosed } from "../exchange/exchangeUtils";

import PhotoPicker from "../exchange/PhotoPicker";
import PopupSelect from "../exchange/PopupSelect";
import { myLocationPopupIds } from "../../data/exchangeDummyData";

import ImageSlider from "../../components/area/ImageSlider";

// 에셋 확인용: assets/images 아래 이미지(svg/png/jpg)를 자동으로 모은다
const assetImages = import.meta.glob(
  "../../assets/images/**/*.{svg,png,jpg,jpeg}",
  {
    eager: true,
    import: "default",
  },
);

function TestPage() {
  // 탭바 useState
  const [activeTab, setActiveTab] = useState("my");

  const tabs = [
    { label: "내 현장 팝업", value: "my" },
    { label: "전체 교환", value: "all" },
  ];

  // 헤더 위치 버튼 클릭 예시 useState
  const [isTestVerified, setIsTestVerified] = useState(false);

  // 모달 useState
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 카테고리 칩 selected·disabled 예시 useState (부모가 선택 상태 관리)
  const [testRegions, setTestRegions] = useState([]);
  const isTestAll = testRegions.includes("전국");
  const toggleTestRegion = (label) => {
    if (label === "전국") {
      setTestRegions(isTestAll ? [] : ["전국"]);
      return;
    }
    setTestRegions((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  // 바텀시트 useState
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 플로팅 버튼 표시 여부 (고정 위치라 다른 테스트를 가리지 않도록 토글)
  const [isFabVisible, setIsFabVisible] = useState(false);

  // 사진 선택 예시 (고른 파일을 미리보기 URL로 변환, 테스트라 URL 해제는 생략)
  const [testPhotos, setTestPhotos] = useState([]);
  const addTestPhotos = (files) =>
    setTestPhotos((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
      })),
    ]);

  // 팝업 선택 예시
  const [testPopupId, setTestPopupId] = useState(null);

  // 사진 여러 장 예시 (작성 화면에서 3장 고른 상태로 시작)
  const multiPhotoPost = exchangePosts.find((post) => post.images.length > 2);
  const [presetPhotos, setPresetPhotos] = useState(() =>
    multiPhotoPost.images.map((url, index) => ({ id: `preset-${index}`, url })),
  );

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

      <div>
        <CommonButton
          $width={160}
          $height={44}
          $fontSize={14}
          onClick={() => setIsModalOpen(true)}
        >
          로그인 모달
        </CommonButton>

        <LoginRequiredModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
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
              <img
                src={src}
                alt=""
                style={{ maxWidth: "64px", outline: "1px dashed #d0d0d0" }}
              />
              <span>{path.split("assets/images/")[1]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 헤더 확인 */}
      <div style={{ padding: "40px 0" }}>
        <p style={{ margin: "0 20px 12px", fontWeight: 600 }}>헤더</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* 각 헤더를 div로 감싸서 sticky가 서로 겹치지 않게 함 */}
          <div style={{ outline: "1px dashed #d0d0d0" }}>
            <Header variant="main" showLocationButton />
          </div>
          <div style={{ outline: "1px dashed #d0d0d0" }}>
            <Header variant="main" />
          </div>
          <div style={{ outline: "1px dashed #d0d0d0" }}>
            <Header variant="chat" user={{ nickname: "우사기", rating: 4.8 }} />
          </div>
          <div style={{ outline: "1px dashed #d0d0d0" }}>
            <Header variant="chat" user={{ nickname: "피킷", rating: null }} />
          </div>
          <div style={{ outline: "1px dashed #d0d0d0" }}>
            <Header variant="back" onBack={() => alert("뒤로가기 클릭!")} />
          </div>
        </div>
      </div>

      {/* 하단 내비·푸터 확인 */}
      <div style={{ padding: "40px 0" }}>
        <p style={{ margin: "0 20px 12px", fontWeight: 600 }}>하단 내비·푸터</p>
        <p style={{ margin: "0 20px 12px", fontSize: "12px" }}>
          현재 경로가 /test라서 모든 탭이 비활성으로 보이는 게 정상
        </p>
        <div style={{ padding: "0 24px" }}>
          <BottomNav />
        </div>
        <div style={{ marginTop: "12px", outline: "1px dashed #d0d0d0" }}>
          <Footer />
        </div>
      </div>

      <RecommendCard
        image={product1}
        title="베이비 쿠로미 인형"
        wanted="베이비 헬로키티 인형"
        location="용산 아이파크몰 6층"
        time="채팅으로 정해요 :)"
        color="#FF006A"
        $width={220}
      />

      {/* 헤더 위치 버튼 상태 확인 (위치 인증 / 팝업 확인) */}
      <div style={{ padding: "40px 0" }}>
        <p style={{ margin: "0 20px 12px", fontWeight: 600 }}>
          헤더 위치 버튼 상태
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ outline: "1px dashed #d0d0d0" }}>
            <Header
              variant="main"
              showLocationButton
              onLocationClick={() => alert("위치 인증 클릭!")}
            />
          </div>
          <div style={{ outline: "1px dashed #d0d0d0" }}>
            <Header
              variant="main"
              showLocationButton
              isLocationVerified
              onPopupCheckClick={() => alert("팝업 확인 클릭!")}
            />
          </div>
          <p style={{ margin: "0 20px", fontSize: "12px" }}>
            클릭 예시: 누를 때마다 위치 인증 ↔ 팝업 확인 전환
          </p>
          <div style={{ outline: "1px dashed #d0d0d0" }}>
            <Header
              variant="main"
              showLocationButton
              isLocationVerified={isTestVerified}
              onLocationClick={() => setIsTestVerified(true)}
              onPopupCheckClick={() => setIsTestVerified(false)}
            />
          </div>
        </div>
      </div>

      {/* 팝업 포스터 카드 확인 (진행 전/중/완료 뱃지, 찜 하트 2종) */}
      <div style={{ padding: "40px 0" }}>
        <p style={{ margin: "0 20px 12px", fontWeight: 600 }}>
          팝업 포스터 카드
        </p>
        <p style={{ margin: "0 20px 12px", fontSize: "12px" }}>
          카드 클릭 시 alert, 하트 클릭 시 하트만 토글
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            columnGap: "10px",
            rowGap: "32px",
            maxWidth: "402px",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          {popupList.map((popup) => (
            <PopupPosterCard
              key={popup.id}
              {...popup}
              onClick={() => alert(`카드 클릭: ${popup.id}`)}
            />
          ))}
        </div>
      </div>

      {/* 필터 칩 확인 (필터 버튼 / 선택된 필터 칩) */}
      <div style={{ padding: "40px 20px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>필터 칩</p>
        <div style={{ display: "flex", gap: "6px" }}>
          <FilterChip onClick={() => alert("필터 버튼 클릭!")} />
          <FilterChip variant="selected" onClick={() => alert("용산 해제!")}>
            용산
          </FilterChip>
          <FilterChip variant="selected" onClick={() => alert("진행 중 해제!")}>
            진행 중
          </FilterChip>
        </div>
      </div>

      {/* 카테고리 칩 selected·disabled 확인 (전국 선택 시 나머지 해제 + 비활성) */}
      <div style={{ padding: "40px 20px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>
          카테고리 칩 selected·disabled
        </p>
        <p style={{ marginBottom: "12px", fontSize: "12px" }}>
          선택: {testRegions.join(", ") || "없음"}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {["용산", "성수", "잠실", "전국"].map((label) => (
            <CategoryButton
              key={label}
              selected={testRegions.includes(label)}
              disabled={isTestAll && label !== "전국"}
              onChange={() => toggleTestRegion(label)}
            >
              {label}
            </CategoryButton>
          ))}
        </div>
      </div>

      {/* 바텀시트 확인 (딤 배경·닫기 버튼으로 닫힘) */}
      <div style={{ padding: "40px 20px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>바텀시트</p>
        <CommonButton
          $width={160}
          $height={44}
          $fontSize={14}
          onClick={() => setIsSheetOpen(true)}
        >
          바텀시트 열기
        </CommonButton>

        <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              padding: "0 24px 32px",
            }}
          >
            <p style={{ margin: 0 }}>바텀시트 내용 영역</p>
            <CommonButton
              $width={354}
              $borderRadius={10000}
              onClick={() => setIsSheetOpen(false)}
            >
              닫기
            </CommonButton>
          </div>
        </BottomSheet>
      </div>

      {/* 팝업 상태 뱃지 큰 사이즈 확인 (팝업 상세용 size="large") */}
      <div style={{ padding: "40px 20px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>
          팝업 상태 뱃지 large
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <StatusBadge type="popup" status="upcoming" size="large" />
          <StatusBadge type="popup" status="ongoing" size="large" />
          <StatusBadge type="popup" status="completed" size="large" />
        </div>
      </div>

      {/* 교환글 상태 뱃지 small 확인 (Live / New / 방금 전 / 예약 중 / 교환 완료) */}
      <div style={{ padding: "40px 20px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>
          교환글 상태 뱃지 small
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          {EXCHANGE_BADGES.map(({ type, status }) => (
            <StatusBadge
              key={`${type}-${status}`}
              type={type}
              status={status}
            />
          ))}
        </div>
      </div>

      {/* 교환글 상태 뱃지 large 확인 (교환글 상세용) */}
      <div style={{ padding: "40px 20px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>
          교환글 상태 뱃지 large
        </p>
        <p style={{ marginBottom: "8px", fontSize: "12px" }}>
          방금 전·교환 완료만 피그마 기준, 나머지는 임시
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {EXCHANGE_BADGES.map(({ type, status }) => (
            <StatusBadge
              key={`${type}-${status}`}
              type={type}
              status={status}
              size="large"
            />
          ))}
        </div>
      </div>

      {/* 교환글 카드 확인 (사진, 상태 태그 규칙, 예약 중·교환 완료 사진 어둡게) */}
      <div style={{ padding: "40px 20px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>
          교환글 카드 (exchangeDummyData)
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {exchangePosts.slice(0, 5).map((post) => {
            const badge = getExchangeBadge(post);
            return (
              <ExchangeCard
                key={post.id}
                image={post.images[0]}
                title={post.title}
                want={post.want}
                likes={post.likes}
                comments={post.comments}
                badgeType={badge.type}
                status={badge.status}
                isDimmed={isTradeClosed(post)}
                onClick={() => alert(`교환글 클릭: ${post.id}`)}
              />
            );
          })}
        </div>
      </div>

      {/* 흐린 배경 오버레이 확인 (위치 미인증 내 현장 팝업 예시) */}
      <div style={{ padding: "40px 0" }}>
        <p style={{ margin: "0 20px 12px", fontWeight: 600 }}>
          흐린 배경 오버레이
        </p>
        <BlurOverlay
          title="위치 인증이 필요한 서비스입니다."
          description="위치 인증하고 팝업 현장에서 굿즈를 교환해 보세요!"
          buttonText="위치 인증하러 가기"
          onButtonClick={() => alert("위치 인증하러 가기 클릭!")}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              columnGap: "10px",
              rowGap: "32px",
              padding: "24px",
            }}
          >
            {popupList.map((popup) => (
              <PopupCard key={popup.id} {...popup} />
            ))}
          </div>
        </BlurOverlay>
      </div>

      {/* 플로팅 "+" 버튼 확인 (화면 오른쪽 아래 고정) */}
      <div style={{ padding: "40px 20px 120px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>플로팅 버튼</p>
        <p style={{ marginBottom: "12px", fontSize: "12px" }}>
          /test는 내비가 없어서 버튼 아래가 비어 보이는 게 정상
        </p>
        <CommonButton
          $width={160}
          $height={44}
          $fontSize={14}
          onClick={() => setIsFabVisible((prev) => !prev)}
        >
          {isFabVisible ? "플로팅 버튼 숨기기" : "플로팅 버튼 보기"}
        </CommonButton>
        {isFabVisible && (
          <FloatingAddButton onClick={() => alert("+ 버튼 클릭!")} />
        )}
      </div>

      {/* 교환글 작성 사진 선택 확인 (카메라 박스 → 사진 여러 장 가로 나열, 삭제) */}
      <div style={{ padding: "40px 0" }}>
        <p style={{ margin: "0 20px 12px", fontWeight: 600 }}>
          사진 선택 (최대 5장)
        </p>
        <PhotoPicker
          photos={testPhotos}
          onAdd={addTestPhotos}
          onRemove={(id) =>
            setTestPhotos((prev) => prev.filter((photo) => photo.id !== id))
          }
        />
      </div>

      {/* 교환글 작성 팝업 선택 확인 (내 현장 팝업 분홍, 검색, 키보드·목록 동작) */}
      <div style={{ padding: "40px 24px 240px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>팝업 선택</p>
        <p style={{ marginBottom: "12px", fontSize: "12px" }}>
          선택: {testPopupId ?? "없음"}
        </p>
        <PopupSelect
          popups={popupList}
          highlightIds={myLocationPopupIds.slice(0, 2)}
          selectedId={testPopupId}
          onSelect={setTestPopupId}
        />
      </div>

      {/* 사진 여러 장 예시 1: 교환글 작성에서 3장 고른 상태 (디자인 없음, 제안용) */}
      <div style={{ padding: "40px 0" }}>
        <p style={{ margin: "0 20px 12px", fontWeight: 600 }}>
          사진 여러 장 - 교환글 작성 (3장 선택된 상태)
        </p>
        <p style={{ margin: "0 20px 12px", fontSize: "12px" }}>
          카메라 박스 옆에 같은 크기로 나열, 넘치면 가로 스크롤
        </p>
        <PhotoPicker
          photos={presetPhotos}
          onAdd={addTestPhotos}
          onRemove={(id) =>
            setPresetPhotos((prev) => prev.filter((photo) => photo.id !== id))
          }
        />
      </div>

      {/* 사진 여러 장 예시 2: 교환글 상세 사진 슬라이드 (ImageSlider, 상세에 적용됨) */}
      <div style={{ padding: "40px 0" }}>
        <p style={{ margin: "0 20px 12px", fontWeight: 600 }}>
          사진 여러 장 - 교환글 상세 (좌우로 넘기기)
        </p>
        <p style={{ margin: "0 20px 12px", fontSize: "12px" }}>
          폰: 좌우 스와이프 / 컴퓨터: 아래 인디케이터 클릭
        </p>
        <ImageSlider images={multiPhotoPost.images} />

        <p style={{ margin: "24px 20px 12px", fontSize: "12px" }}>
          예약 중·교환 완료일 때 (모든 사진 어둡게)
        </p>
        <ImageSlider images={multiPhotoPost.images} isDimmed />
      </div>

      {/* PopupCard 찜 하트 확인 (하트 없음 / 찜한 상태 / 찜 안 한 상태, 찜 탭용 showLikeButton) */}
      <div style={{ padding: "40px 24px" }}>
        <p style={{ marginBottom: "12px", fontWeight: 600 }}>
          PopupCard 찜 하트
        </p>
        <p style={{ marginBottom: "12px", fontSize: "12px" }}>
          하트를 누르면 하트만 바뀌고, 카드 나머지를 누르면 카드 클릭 알림
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "32px 10px",
          }}
        >
          <PopupCard
            {...popupList[0]}
            onClick={() => alert("카드 클릭! (하트 없음)")}
          />
          <PopupCard
            {...popupList[1]}
            showLikeButton
            isLiked
            onClick={() => alert("카드 클릭! (찜한 상태)")}
          />
          <PopupCard
            {...popupList[2]}
            showLikeButton
            isLiked={false}
            onClick={() => alert("카드 클릭! (찜 안 한 상태)")}
          />
        </div>
      </div>

      {/* 로그인 안내 흐린 배경 확인 (로그아웃 상태의 내 현장 팝업·찜 탭, 버튼 → /login) */}
      <div style={{ padding: "40px 0" }}>
        <p style={{ margin: "0 20px 12px", fontWeight: 600 }}>
          로그인 안내 흐린 배경 (LoginBlurOverlay)
        </p>
        <LoginBlurOverlay>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              columnGap: "10px",
              rowGap: "32px",
              padding: "24px",
            }}
          >
            {popupList.slice(0, 4).map((popup) => (
              <PopupCard key={popup.id} {...popup} />
            ))}
          </div>
        </LoginBlurOverlay>
      </div>
    </div>
  );
}

// 교환글 상태 뱃지 확인용 (Live / New / 방금 전 / 예약 중 / 교환 완료)
const EXCHANGE_BADGES = [
  { type: "exchange", status: "live" },
  { type: "exchange", status: "new" },
  { type: "reservation", status: "upcoming" },
  { type: "reservation", status: "ongoing" },
  { type: "reservation", status: "completed" },
];

export default TestPage;
