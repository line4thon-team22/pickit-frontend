import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ExchangeCard from "../../components/card/ExchangeCard";

import { wishPosts } from "../../data/wishDummyData";
import { toExchangeCardProps } from "../exchange/exchangeUtils";

// 찜 탭 - 찜한 아이템 (피그마 474:23025)
// - 카드 클릭 → 교환글 상세 (찜 해제는 상세 화면에서)
// - 교환 완료된 글도 목록에 남기고 "교환 완료" 태그 + 어두운 사진으로 표시
export default function WishItemList() {
  const navigate = useNavigate();

  // TODO(API): 찜한 교환글 목록 조회 API 연동 시 더미 데이터 교체
  if (wishPosts.length === 0) {
    // TODO: 빈 목록 디자인 확정 후 교체
    return <EmptyText>아직 찜한 아이템이 없어요</EmptyText>;
  }

  return (
    <PostList>
      {wishPosts.map((post) => (
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
const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 20px;
`;

const EmptyText = styled.p`
  margin: 0;
  padding: 80px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[700]};
  ${({ theme }) => theme.typography.body3};
`;
