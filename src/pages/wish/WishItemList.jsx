import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ExchangeCard from "../../components/card/ExchangeCard";
import LoginBlurOverlay from "../../components/area/LoginBlurOverlay";

import useApi from "../../hooks/useApi";
import { useAuth } from "../../context/useAuth";
import { getLikedPosts, getPosts } from "../../api/exchangeApi";
import { toExchangeCardProps } from "../exchange/exchangeUtils";
import RequestStateView from "../exchange/RequestStateView";

// 로그아웃 상태 흐린 배경에 깔 교환글 개수
const BACKGROUND_POST_COUNT = 3;

// 찜 탭 - 찜한 아이템 (피그마 474:23025)
// - 카드 클릭 → 교환글 상세 (찜 해제는 상세 화면에서, 돌아오면 다시 불러와서 목록에서 빠짐)
// - 교환 완료된 글도 목록에 남기고 "교환 완료" 태그 + 어두운 사진으로 표시 (toExchangeCardProps)
// - 로그인 필요: 로그아웃이면 요청하지 않고 흐린 배경 + 로그인 안내
export default function WishItemList() {
  const navigate = useNavigate();
  const { isLoggedIn, isAuthLoading } = useAuth();

  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useApi(
    () => (isLoggedIn ? getLikedPosts() : Promise.resolve(null)),
    [isLoggedIn],
  );

  // 로그아웃 / 토큰 만료 후 재발급도 실패(401)
  const needsLogin = (!isAuthLoading && !isLoggedIn) || error?.status === 401;

  // 로그인 안내일 때만 흐린 배경용 교환글을 받아옴 (전체 교환글 앞쪽, 로그인 없이 조회 가능)
  const { data: backgroundPosts } = useApi(
    () => (needsLogin ? getPosts() : Promise.resolve([])),
    [needsLogin],
  );

  // 로그인 확인 중 / 로그인 필요 / 에러 / 불러오는 중 / 빈 목록 / 목록
  if (isAuthLoading) return <RequestStateView message="불러오는 중이에요" />;

  if (needsLogin) {
    return (
      <LoginBlurOverlay>
        <PostList $isBlurred>
          {(backgroundPosts ?? [])
            .slice(0, BACKGROUND_POST_COUNT)
            .map((post) => (
              <ExchangeCard key={post.id} {...toExchangeCardProps(post)} />
            ))}
        </PostList>
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

  if (!posts && isLoading) {
    return <RequestStateView message="불러오는 중이에요" />;
  }

  if (!posts?.length) {
    // TODO: 빈 목록 디자인 확정 후 교체
    return <RequestStateView message="아직 찜한 아이템이 없어요" />;
  }

  return (
    <PostList>
      {posts.map((post) => (
        <ExchangeCard
          key={post.id}
          {...toExchangeCardProps(post)}
          onClick={() => navigate(`/exchange/post/${post.id}`)}
        />
      ))}
    </PostList>
  );
}

// 피그마 474:23035: 위아래 24, 카드 간격 12
// 카드 자체 좌우 4px + 20px = 피그마 좌우 24px
// 흐린 배경일 때는 목록이 짧아도 안내 문구가 들어갈 높이를 확보
const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 20px;
  min-height: ${({ $isBlurred }) => ($isBlurred ? "360px" : "auto")};
`;
