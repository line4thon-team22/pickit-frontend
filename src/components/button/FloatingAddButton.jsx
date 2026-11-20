import styled from "styled-components";
import plusIcon from "../../assets/images/icon/plus-white.svg";

// 화면 오른쪽 아래 "+" 플로팅 버튼 (피그마 교환 탭 503:6844)
// - 하단 내비 위 22px, 앱 화면(402px) 오른쪽 끝에서 32px
// - 스크롤과 상관없이 고정 (데스크톱에서도 402px 화면 안에 머물도록 right 계산)
export default function FloatingAddButton({
  onClick,
  "aria-label": ariaLabel = "추가하기",
  ...props
}) {
  return (
    <Button type="button" onClick={onClick} aria-label={ariaLabel} {...props}>
      <img src={plusIcon} alt="" />
    </Button>
  );
}

const Button = styled.button`
  position: fixed;
  right: max(
    32px,
    calc((100vw - ${({ theme }) => theme.layout.maxWidth}) / 2 + 32px)
  );
  /* 내비 아래 간격 + 내비 높이 + 내비와의 간격 22px (AppLayout NavPosition과 같은 계산) */
  bottom: calc(
    max(${({ theme }) => theme.layout.navBottom}, env(safe-area-inset-bottom)) +
      ${({ theme }) => theme.layout.navHeight} + 22px
  );
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 50px;
  height: 50px;
  padding: 0;
  border: 1.385px solid #e3e3e3;
  border-radius: 10000px;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  cursor: pointer;
`;
