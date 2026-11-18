import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import HomePage from "./pages/home/HomePage";
import TestPage from "./pages/test/TestPage";

// TODO: 레이아웃 확인용 빈 페이지 (담당자가 실제 화면으로 구현)
import LoginPage from "./pages/login/LoginPage";
import MyPage from "./pages/my/MyPage";
import PopupPage from "./pages/popup/PopupPage";
import PopupDetailPage from "./pages/popup/PopupDetailPage";
import ExchangePage from "./pages/exchange/ExchangePage";
import WishPage from "./pages/wish/WishPage";
import ChatPage from "./pages/chat/ChatPage";
import ChatRoomPage from "./pages/chat/ChatRoomPage";
import InterestSettingPage from "./pages/interest/InterestSettingPage";

/*
  새 페이지 추가 방법: AppLayout의 children에 한 줄 추가하면 앱 셸이 자동 적용된다.

  { path: "popup", element: <PopupPage /> },

  하단 내비·푸터가 필요 없는 페이지는 handle로 숨긴다.

  {
    path: "popup/:popupId",
    element: <PopupDetailPage />,
    handle: { hideNav: true, hideFooter: true },
  },

  상세 경로는 탭 경로 아래(popup/...)에 두어야 하단 내비에서 해당 탭이 활성으로 보인다.
*/
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },

      // 탭·상세 페이지 (현재는 레이아웃 확인용 빈 페이지)
      { path: "popup", element: <PopupPage /> },
      {
        path: "popup/:popupId",
        element: <PopupDetailPage />,
        handle: { hideNav: true, hideFooter: true },
      },
      { path: "exchange", element: <ExchangePage /> },
      { path: "wish", element: <WishPage /> },
      { path: "chat", element: <ChatPage />, handle: { hideFooter: true } },
      {
        path: "chat/:chatId",
        element: <ChatRoomPage />,
        handle: { hideNav: true, hideFooter: true },
      },

      // 개발용 (배포 전 삭제)
      {
        path: "test",
        element: <TestPage />,
        handle: { hideNav: true, hideFooter: true },
      },

      // 아직 없는 페이지
      {
        path: "*",
        element: <p style={{ padding: "40px 20px" }}>준비 중인 페이지예요.</p>,
      },
    ],
  },
  {
    path: "/login",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
        handle: { hideNav: true, hideFooter: true },
      },
    ],
  },
  {
    path: "my",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <MyPage />,
        handle: { hideNav: true, hideFooter: true },
      },
      {
        path: "interest",
        element: <InterestSettingPage />,
        handle: { hideNav: true, hideFooter: true },
      },
    ],
  },
]);

export default router;
