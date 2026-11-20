import { RouterProvider } from "react-router-dom";
import router from "./router";
import useLocationHeartbeat from "./hooks/useLocationHeartbeat";

function App() {
  // 위치 인증 유지 (페이지 이동과 관계없이 앱 전체에서 한 번만 실행)
  useLocationHeartbeat();

  return <RouterProvider router={router} />;
}

export default App;
