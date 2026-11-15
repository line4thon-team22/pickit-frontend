import CommonButton from "../../components/button/CommonButton";
import ToggleIconButton from "../../components/button/ToggleIconButton";

import homeGray from "../../assets/images/icon/home-gray.svg";
import homePink from "../../assets/images/icon/home-pink.svg";
import CommonInput from "../../components/input/CommonInput";
import SearchBar from "../../components/input/SearchBar";
import StatusBadge from "../../components/badge/StatusBadge";

function TestPage() {
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
    </div>
  );
}

export default TestPage;
