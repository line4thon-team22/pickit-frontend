import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/header/Header";
import TopBar from "../../components/bar/TopBar";
import ExchangeCard from "../../components/card/ExchangeCard";
import plusIcon from "../../assets/images/icon/plus-white-small.svg";

import { popups } from "../../data/popupDummyData";
import { exchangePosts } from "../../data/exchangeDummyData";
import { isOnSiteExchange, toExchangeCardProps } from "./exchangeUtils";

const TABS = [
  { label: "현장 교환", value: "onsite" },
  { label: "일반 교환", value: "general" },
];

// 팝업별 교환 보드 (피그마 현장 교환 293:12390, 일반 교환 669:7709)
// - 진입: 교환 탭 내 현장 팝업 클릭 / 팝업 상세 "상품 교환하기"
// - 탭은 쿼리(?tab=general)로 관리 → 교환글 상세에서 뒤로 와도 보던 탭 유지
export default function ExchangeBoardPage() {
  const navigate = useNavigate();
  const { popupId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab =
    searchParams.get("tab") === "general" ? "general" : "onsite";

  // 탭 전환은 기록을 쌓지 않음 (뒤로가기 시 탭이 아니라 이전 페이지로)
  const handleTabChange = (tab) =>
    setSearchParams(tab === "general" ? { tab: "general" } : {}, {
      replace: true,
    });

  // TODO(API): 팝업 상세 조회 API 연동 시 더미 데이터 교체
  const popup = popups.find((item) => String(item.id) === popupId);

  if (!popup) {
    return (
      <>
        <Header variant="back" />
        {/* TODO: 없는 팝업 안내 디자인 확정되면 수정 */}
        <EmptyText>존재하지 않는 팝업이에요</EmptyText>
      </>
    );
  }

  // TODO(API): 팝업별 교환글 목록 조회 API 연동 시 교체 (탭 구분도 서버 필터로)
  const posts = exchangePosts.filter(
    (post) =>
      post.popupId === popup.id &&
      isOnSiteExchange(post) === (activeTab === "onsite"),
  );

  return (
    <>
      <Header variant="back" />

      {/* 팝업 정보 (피그마 293:12393) */}
      <PopupInfo>
        <PopupImage>
          <img src={popup.image} alt={popup.title} />
        </PopupImage>

        <InfoBody>
          <PopupTitle>{popup.title}</PopupTitle>

          <InfoRow>
            <Meta>
              <p>{popup.location}</p>
              <p>{popup.period}</p>
            </Meta>

            {/* 작성 화면에 지금 보드의 팝업이 선택된 상태로 넘김 */}
            <WriteButton
              type="button"
              onClick={() => navigate(`/exchange/write?popupId=${popup.id}`)}
            >
              <img src={plusIcon} alt="" />
              교환
            </WriteButton>
          </InfoRow>
        </InfoBody>
      </PopupInfo>

      {/* 교환 보드 (피그마 293:12405) */}
      <BoardSection>
        <BoardTitle>교환 보드</BoardTitle>

        <BoardTabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={handleTabChange}
        />

        {posts.length > 0 ? (
          <PostList>
            {posts.map((post) => (
              <ExchangeCard
                key={post.id}
                {...toExchangeCardProps(post)}
                onClick={() => navigate(`/exchange/post/${post.id}`)}
              />
            ))}
          </PostList>
        ) : (
          // TODO: 교환글 없음 디자인 확정되면 수정
          <EmptyText>아직 올라온 교환글이 없어요</EmptyText>
        )}
      </BoardSection>
    </>
  );
}

const PopupInfo = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 24px 24px;
  border-bottom: 1px solid #e3e3e3;
`;

const PopupImage = styled.div`
  width: 100%;
  height: 160px;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  overflow: hidden;
  background-color: #e8e8e8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 8px;
`;

const PopupTitle = styled.h1`
  margin: 0;
  color: #000;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
  word-break: keep-all;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Meta = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.gray[700]};
    font-size: 10px;
    font-weight: 500;
    line-height: normal;
  }
`;

// 피그마 338:14941: 높이 32, 좌우 12, 아이콘 12 + 간격 6, 12/600
const WriteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  height: 32px;
  padding: 0 12px;
  border: 1px solid #e3e3e3;
  border-radius: 10000px;
  background-color: ${({ theme }) => theme.colors.gray[900]};

  color: #fafafa;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
`;

const BoardSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 24px;
`;

const BoardTitle = styled.h2`
  margin: 0;
  padding: 0 32px;
  color: #000;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
`;

// 보드 탭은 교환·찜·채팅 탭보다 작음 (피그마 293:12407: 16px, 간격 12, 좌우 32)
const BoardTabs = styled(TopBar)`
  height: auto;
  padding: 0 32px;
  gap: 12px;

  button {
    font-size: 16px;
  }
`;

// 카드 자체 좌우 4px + 20px = 피그마 좌우 24px, 카드 간격 12px
const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 20px 24px;
`;

const EmptyText = styled.p`
  margin: 0;
  padding: 80px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[700]};
  ${({ theme }) => theme.typography.body3};
`;
