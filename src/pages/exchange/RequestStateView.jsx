import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CommonButton from "../../components/button/CommonButton";

const ACTION_TEXT = {
  retry: "다시 시도",
  login: "로그인하러 가기",
};

// 교환 화면 공통 상태 표시 (불러오는 중·빈 목록·없는 글·에러·로그인 필요)
// - message: 보여줄 문구
// - action: 없음(문구만) / "retry"(다시 시도 → onRetry) / "login"(로그인하러 가기 → /login)
// 어떤 상태인지는 각 화면이 판단해서 문구·버튼을 넘긴다
// TODO: 로딩·에러·빈 상태·로그인 안내 디자인 확정되면 수정
export default function RequestStateView({ message, action, onRetry }) {
  const navigate = useNavigate();

  if (!action) return <Message>{message}</Message>;

  const handleClick = action === "login" ? () => navigate("/login") : onRetry;

  return (
    <ActionArea>
      <Message>{message}</Message>
      <CommonButton
        variant="secondary"
        $width={120}
        $height={36}
        $fontSize={14}
        $borderRadius={10000}
        onClick={handleClick}
      >
        {ACTION_TEXT[action]}
      </CommonButton>
    </ActionArea>
  );
}

// 팝업 화면의 빈 목록 문구·"다시 시도" 영역과 같은 스타일
const Message = styled.p`
  margin: 0;
  padding: 80px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[700]};
  ${({ theme }) => theme.typography.body3};
`;

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 80px;

  ${Message} {
    padding-bottom: 16px;
  }
`;
