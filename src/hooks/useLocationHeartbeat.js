import { useEffect } from "react";

import { useAuth } from "../context/useAuth";
import { getCurrentVerifications, updateLocation } from "../api/locationApi";
import { getCurrentLocation } from "../utils/getCurrentLocation";

// 서버가 주기를 안 내려줄 때 기본값 (명세: 5분마다 위치 갱신)
const DEFAULT_INTERVAL_SECONDS = 300;

// 위치 권한을 이미 받았는지 확인 (사용자 동작 없이 권한 요청 창을 띄우지 않기 위해)
// 권한 조회를 지원하지 않는 브라우저는, 인증을 한 번 했다면 권한이 있다고 보고 진행
const hasLocationPermission = async () => {
  try {
    if (!navigator.permissions?.query) return true;
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state === "granted";
  } catch {
    return true;
  }
};

// 위치 인증 유지: 로그인 상태에서 유효한 인증이 있으면 주기적으로 현재 위치 전송
// - 반경 안이면 서버가 인증을 10분 연장, 벗어나면 그 팝업만 LEFT 처리
// - 앱이 백그라운드면 브라우저가 타이머를 멈추므로, 앱으로 돌아올 때도 한 번 전송
// TODO: 헤더 위치 인증 상태가 전역으로 관리되면 갱신 결과를 그 상태에도 반영
export default function useLocationHeartbeat() {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;

    let active = true;
    let isSending = false;
    let timerId = null;
    let intervalMs = DEFAULT_INTERVAL_SECONDS * 1000;

    const sendLocation = async () => {
      if (isSending || document.visibilityState !== "visible") return;
      isSending = true;

      try {
        // 유효한 인증이 있는 사람만 위치 측정 (인증 안 한 사용자는 GPS를 켜지 않음)
        const status = await getCurrentVerifications();
        if (!active) return;

        if (status.updateIntervalSeconds) {
          intervalMs = status.updateIntervalSeconds * 1000;
        }
        if (!(status.verifiedCount > 0)) return;
        if (!(await hasLocationPermission())) return;

        const location = await getCurrentLocation();
        if (!active) return;

        await updateLocation(location);
      } catch (error) {
        // 409: 이미 처리한 것보다 오래된 측정값 → 무시
        // 정확도 부족·권한 거부 등은 이번 회차만 건너뛰고 다음 주기에 다시 시도
        if (error?.status !== 409) {
          console.warn("위치 갱신 실패:", error?.message ?? error);
        }
      } finally {
        isSending = false;
      }
    };

    const scheduleNext = () => {
      timerId = setTimeout(async () => {
        await sendLocation();
        if (active) scheduleNext();
      }, intervalMs);
    };

    const handleVisible = () => {
      if (document.visibilityState === "visible") sendLocation();
    };

    // 앱을 열었을 때 한 번 보내고, 이후 주기적으로 전송
    sendLocation();
    scheduleNext();
    document.addEventListener("visibilitychange", handleVisible);

    return () => {
      active = false;
      clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, [isLoggedIn]);
}
