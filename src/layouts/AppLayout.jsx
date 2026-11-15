import { Outlet, useMatches } from "react-router-dom";
import styled from "styled-components";

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
          {/* TODO: 5단계에서 Footer 컴포넌트로 교체 */}
          {!hideFooter && <FooterSlot>푸터 자리</FooterSlot>}
        </ScrollArea>
        {/* TODO: 5단계에서 하단 내비 컴포넌트로 교체 */}
        {!hideNav && <NavSlot>하단 내비 자리</NavSlot>}
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

  /* 내비가 있으면 본문 끝이 내비에 가리지 않도록 여백 확보 */
  padding-bottom: ${({ $hasNav, theme }) =>
    $hasNav
      ? `calc(${theme.layout.navHeight} + max(${theme.layout.navBottom}, env(safe-area-inset-bottom)) + 16px)`
      : "env(safe-area-inset-bottom)"};
`;

const Main = styled.main`
  flex: 1 0 auto;
`;

const FooterSlot = styled.div`
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 120px;

  border: 1px dashed #d0d0d0;
  color: #a1a1a1;
  font-size: 12px;
`;

const NavSlot = styled.nav`
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: max(
    ${({ theme }) => theme.layout.navBottom},
    env(safe-area-inset-bottom)
  );
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  height: ${({ theme }) => theme.layout.navHeight};

  border: 1px dashed #ff006a;
  border-radius: 10000px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #ff006a;
  font-size: 12px;
`;
