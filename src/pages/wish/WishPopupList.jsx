import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PopupCard from "../../components/card/PopupCard";
import LoginBlurOverlay from "../../components/area/LoginBlurOverlay";
import LoginRequiredModal from "../../components/modal/LoginRequiredModal";

import useApi from "../../hooks/useApi";
import { useAuth } from "../../context/useAuth";
import {
  getLikedPopups,
  getPopups,
  likePopup,
  unlikePopup,
} from "../../api/popupApi";
import RequestStateView from "../exchange/RequestStateView";

// 로그아웃 상태 흐린 배경에 깔 팝업 개수 (2열 2줄)
const BACKGROUND_POPUP_COUNT = 4;

// 찜 탭 - 찜한 팝업 (피그마 474:23011)
// - 카드 클릭 → 팝업 상세 → "상품 교환하기" → 해당 팝업 교환 보드 (기존 흐름)
// - 하트를 해제해도 목록에서 바로 빼지 않음 (다음에 목록을 불러올 때 빠짐, 실수로 눌러도 다시 찜 가능)
// - 로그인 필요: 로그아웃이면 요청하지 않고 흐린 배경 + 로그인 안내
export default function WishPopupList() {
  const navigate = useNavigate();
  const { isLoggedIn, isAuthLoading } = useAuth();

  const {
    data: popups,
    setData: setPopups,
    isLoading,
    error,
    refetch,
  } = useApi(
    () => (isLoggedIn ? getLikedPopups() : Promise.resolve(null)),
    [isLoggedIn],
  );

  // 로그아웃 / 토큰 만료 후 재발급도 실패(401)
  const needsLogin = (!isAuthLoading && !isLoggedIn) || error?.status === 401;

  // 로그인 안내일 때만 흐린 배경용 팝업을 받아옴 (팝업 목록 앞쪽)
  const { data: backgroundPopups } = useApi(
    () => (needsLogin ? getPopups() : Promise.resolve([])),
    [needsLogin],
  );

  // ===== 찜 =====
  // 하트는 누르는 즉시 바뀌고(카드 안 ToggleIconButton), 그 다음 서버에 저장 (PopupPage와 같은 방식)
  // - 성공: 서버가 준 찜 여부·찜 수로 목록 데이터 갱신 (해제해도 목록에서 빼지 않음)
  // - 실패: 하트를 원래대로 되돌림 (카드 key를 바꿔 다시 그려서 isLiked로 초기화)
  // - 로그인 안 됨(401): 되돌리고 로그인 안내 모달
  const [revertCounts, setRevertCounts] = useState({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLikeChange = async (popupId, nextLiked) => {
    try {
      const result = nextLiked
        ? await likePopup(popupId)
        : await unlikePopup(popupId);

      setPopups((prev) =>
        prev.map((popup) =>
          popup.id === popupId ? { ...popup, ...result } : popup,
        ),
      );
    } catch (err) {
      setRevertCounts((prev) => ({
        ...prev,
        [popupId]: (prev[popupId] ?? 0) + 1,
      }));

      if (err.status === 401) setIsLoginModalOpen(true);
      // TODO: 그 밖의 실패 안내(토스트 등) 디자인 확정되면 추가
    }
  };

  // 로그인 확인 중 / 로그인 필요 / 에러 / 불러오는 중 / 빈 목록 / 목록
  const renderContent = () => {
    if (isAuthLoading) return <RequestStateView message="불러오는 중이에요" />;

    if (needsLogin) {
      return (
        <LoginBlurOverlay>
          <PopupGrid $isBlurred>
            {(backgroundPopups ?? [])
              .slice(0, BACKGROUND_POPUP_COUNT)
              .map((popup) => (
                <PopupCard key={popup.id} {...popup} />
              ))}
          </PopupGrid>
        </LoginBlurOverlay>
      );
    }

    if (error) {
      return (
        <RequestStateView
          message={error.message}
          action="retry"
          onRetry={refetch}
        />
      );
    }

    if (!popups && isLoading) {
      return <RequestStateView message="불러오는 중이에요" />;
    }

    if (!popups?.length) {
      // TODO: 빈 목록 디자인 확정 후 교체
      return <RequestStateView message="아직 찜한 팝업이 없어요" />;
    }

    return (
      <PopupGrid>
        {popups.map((popup) => (
          <PopupCard
            key={`${popup.id}-${revertCounts[popup.id] ?? 0}`}
            {...popup}
            showLikeButton
            onClick={() => navigate(`/popup/${popup.id}`)}
            onLikeChange={(nextLiked) => handleLikeChange(popup.id, nextLiked)}
          />
        ))}
      </PopupGrid>
    );
  };

  return (
    <>
      {renderContent()}

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}

// 피그마 474:23019: padding 24, 2열 간격 10 / 행 간격 32
// 흐린 배경일 때는 목록이 짧아도 안내 문구가 들어갈 높이를 확보
const PopupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 10px;
  row-gap: 32px;
  padding: 24px;
  min-height: ${({ $isBlurred }) => ($isBlurred ? "360px" : "auto")};
`;
