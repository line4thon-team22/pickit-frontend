import { NavLink } from "react-router-dom";
import styled from "styled-components";
import homeGray from "../../assets/images/icon/home-gray.svg";
import homePink from "../../assets/images/icon/home-pink.svg";
import popupGray from "../../assets/images/icon/popup-gray.svg";
import popupPink from "../../assets/images/icon/popup-pink.svg";
import exchangeGray from "../../assets/images/icon/exchange-gray.svg";
import exchangePink from "../../assets/images/icon/exchange-pink.svg";
import heartGray from "../../assets/images/icon/heart-gray.svg";
import heartPink from "../../assets/images/icon/heart-pink.svg";
import chatGray from "../../assets/images/icon/chat-gray.svg";
import chatPink from "../../assets/images/icon/chat-pink.svg";

// end: 해당 경로와 정확히 일치할 때만 활성 (홈 "/"이 모든 경로에서 활성되는 것 방지)
const TABS = [
  { to: "/", label: "홈", icon: homeGray, activeIcon: homePink, end: true },
  { to: "/popup", label: "팝업", icon: popupGray, activeIcon: popupPink },
  {
    to: "/exchange",
    label: "교환",
    icon: exchangeGray,
    activeIcon: exchangePink,
  },
  { to: "/wish", label: "찜", icon: heartGray, activeIcon: heartPink },
  { to: "/chat", label: "채팅", icon: chatGray, activeIcon: chatPink },
];

// 화면 하단 위치는 AppLayout이 잡는다
export default function BottomNav() {
  return (
    <Wrapper aria-label="하단 메뉴">
      {TABS.map(({ to, label, icon, activeIcon, end }) => (
        <Tab key={to} to={to} end={end}>
          {({ isActive }) => (
            <>
              <img src={isActive ? activeIcon : icon} alt="" />
              <Label $active={isActive}>{label}</Label>
            </>
          )}
        </Tab>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: ${({ theme }) => theme.layout.navHeight};
  padding: 10px 36px 16px;

  border: 1px solid ${({ theme }) => theme.colors.primary[100]};
  border-radius: 10000px;
  /* primary/500 10% */
  background-color: rgba(255, 0, 106, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const Tab = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  width: 32px;
`;

const Label = styled.span`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.gray[900] : theme.colors.gray[800]};
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
`;
