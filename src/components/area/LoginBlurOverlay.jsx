import { useNavigate } from "react-router-dom";
import BlurOverlay from "./BlurOverlay";

// 로그인이 필요한 화면: 배경(children)을 흐리게 깔고 로그인 안내 + 로그인하러 가기
// - 내 현장 팝업, 찜한 팝업·찜한 아이템에서 로그아웃 상태일 때 사용
// - 문구는 LoginRequiredModal과 같게
// TODO: 로그인 안내 디자인 확정되면 수정 (지금은 위치 미인증 안내와 같은 모양)
export default function LoginBlurOverlay({ children }) {
  const navigate = useNavigate();

  return (
    <BlurOverlay
      title="로그인이 필요한 서비스입니다."
      description="로그인하고 PICKIT의 다양한 기능을 이용해 보세요!"
      buttonText="로그인하러 가기"
      onButtonClick={() => navigate("/login")}
    >
      {children}
    </BlurOverlay>
  );
}
