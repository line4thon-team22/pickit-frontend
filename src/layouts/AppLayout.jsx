import { Outlet, useMatches } from "react-router-dom";
import styled from "styled-components";
import Footer from "../components/footer/Footer";
import BottomNav from "../components/nav/BottomNav";

// 모든 페이지를 감싸는 앱 셸
// 라우트 handle의 hideNav / hideFooter로 하단 내비·푸터를 숨긴다 (router.jsx 참고)
export default function AppLayout() {
  const matches = useMatches();
  const hideNav = matches.some((match) => match.handle?.hideNav);
  const hideFooter = matches.some((match) => match.handle?.hideFooter);

  return (
    <Background>
      <Frame>
        <ScrollArea $hasNav={!hideNav}>
          <Main>
            <Outlet />
          </Main>
          {!hideFooter && <Footer />}
        </ScrollArea>
        {!hideNav && (
          <NavPosition>
            <BottomNav />
          </NavPosition>
        )}
      </Frame>
    </Background>
  );
}

// 데스크톱에서 폰 화면 바깥 영역 (디자인에 없는 값이라 theme에 넣지 않음)
const Background = styled.div`
  height: 100dvh;
  background-color: #f5f5f5;
`;

const Frame = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  height: 100%;
  margin: 0 auto;
  padding-top: env(safe-area-inset-top);

  background-color: #ffffff;
`;

// 이 영역만 스크롤된다. 페이지 헤더는 이 안에서 position: sticky; top: 0으로 고정
const ScrollArea = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;

  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;

  /* 내비가 있으면 본문 끝이 내비에 가리지 않도록 내비 높이 + 아래 간격만큼 여백 확보
     (푸터 아래 여백 36px과 합쳐 피그마 홈 157:2203의 푸터~내비 간격과 맞춤) */
  padding-bottom: ${({ $hasNav, theme }) =>
    $hasNav
      ? `calc(${theme.layout.navHeight} + max(${theme.layout.navBottom}, env(safe-area-inset-bottom)))`
      : "env(safe-area-inset-bottom)"};
`;

const Main = styled.main`
  flex: 1 0 auto;
`;

// 하단 내비를 화면 아래에 띄우는 위치 (354px = 402px - 좌우 24px)
const NavPosition = styled.div`
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: max(
    ${({ theme }) => theme.layout.navBottom},
    env(safe-area-inset-bottom)
  );
  z-index: 10;
`;
