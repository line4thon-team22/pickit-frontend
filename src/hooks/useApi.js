import { useCallback, useEffect, useState } from "react";

// 조회 API 공통 훅: 화면이 처음 열릴 때·deps가 바뀔 때 요청하고 로딩·에러 상태를 관리
// - request: API 함수를 부르는 함수 (예: () => getPopupDetail(popupId))
// - deps: 다시 요청할 기준 값들 (예: [popupId]). 객체·배열도 내용이 같으면 같은 값으로 봄
// - 반환: { data, setData, isLoading, error, refetch }
//   data: 다시 불러오는 동안에는 이전 결과를 유지 (목록이 깜빡이지 않게)
//   setData: 찜 토글처럼 화면에서 데이터를 직접 고칠 때 사용
// 추가·수정·삭제 요청(찜 등)은 이 훅 없이 이벤트 함수에서 API 함수를 직접 호출한다
export default function useApi(request, deps = []) {
  const [reloadCount, setReloadCount] = useState(0);
  const requestKey = JSON.stringify([...deps, reloadCount]);

  // 결과에 어떤 요청(requestKey)의 결과인지 함께 저장
  // → 지금 요청과 다르면 아직 불러오는 중 (로딩 상태를 따로 set하지 않음)
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const isLoading = result.key !== requestKey;

  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);

  const setData = useCallback((updater) => {
    setResult((prev) => ({
      ...prev,
      data: typeof updater === "function" ? updater(prev.data) : updater,
    }));
  }, []);

  useEffect(() => {
    // 늦게 도착한 이전 요청 결과가 최신 결과를 덮지 않도록 무시
    let isLatest = true;

    request()
      .then((data) => {
        if (isLatest) setResult({ key: requestKey, data, error: null });
      })
      .catch((error) => {
        if (isLatest) {
          setResult((prev) => ({ key: requestKey, data: prev.data, error }));
        }
      });

    return () => {
      isLatest = false;
    };
    // request는 매 렌더마다 새로 만들어지므로 requestKey(deps)로만 다시 요청한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  return {
    data: result.data,
    setData,
    isLoading,
    error: isLoading ? null : result.error,
    refetch,
  };
}
