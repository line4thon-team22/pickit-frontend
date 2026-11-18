import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "../../components/input/SearchBar";
import ExchangeCard from "../../components/card/ExchangeCard";

import { exchangePosts } from "../../data/exchangeDummyData";
import { toExchangeCardProps } from "./exchangeUtils";

// 교환 탭 - 전체 교환 (피그마 447:21626)
// 전체 교환글을 모아보고 검색하는 화면
export default function AllExchangeList() {
  const navigate = useNavigate();

  // 입력창에 보이는 값 / 실제로 검색한 값 (돋보기·엔터를 눌렀을 때만 검색)
  const [inputValue, setInputValue] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => setKeyword(inputValue.trim());

  const handleKeyDown = (e) => {
    // 한글 조합 중 엔터는 무시 (이벤트가 두 번 발생하는 것 방지)
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    handleSearch();
    e.currentTarget.blur(); // 폰 키보드 내리기
  };

  // TODO(API): 검색 범위(제목/내용) 확정 후 API 검색으로 교체
  // TODO: 정렬 기준 확정되면 수정 (지금은 더미 데이터 순서)
  const filteredPosts = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();
    return exchangePosts.filter((post) =>
      post.title.toLowerCase().includes(lowerKeyword),
    );
  }, [keyword]);

  return (
    <>
      <SearchArea>
        <SearchBar
          placeholder="궁금한 아이템을 검색해 보세요"
          $height={42}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onSearchClick={handleSearch}
        />
      </SearchArea>

      {filteredPosts.length > 0 ? (
        <PostList>
          {filteredPosts.map((post) => (
            <ExchangeCard
              key={post.id}
              {...toExchangeCardProps(post)}
              onClick={() => navigate(`/exchange/post/${post.id}`)}
            />
          ))}
        </PostList>
      ) : (
        // TODO: 검색 결과 없음 디자인 확정되면 수정
        <EmptyText>검색 결과가 없어요</EmptyText>
      )}
    </>
  );
}

// 피그마: 탭 아래 검색창 영역 높이 72 (위 10, 검색창 42, 아래 20)
const SearchArea = styled.div`
  padding: 10px 24px 20px;
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
