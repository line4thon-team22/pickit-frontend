import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "../../components/input/SearchBar";
import ExchangeCard from "../../components/card/ExchangeCard";

import useApi from "../../hooks/useApi";
import { getPosts } from "../../api/exchangeApi";
import { toExchangeCardProps } from "./exchangeUtils";
import RequestStateView from "./RequestStateView";

// 교환 탭 - 전체 교환 (피그마 447:21626)
// 전체 교환글을 모아보고 검색하는 화면 (검색 범위: 가진 상품·구하는 상품·설명, 서버 기준)
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

  // 검색어가 바뀔 때마다 서버에서 다시 받아옴 (정렬도 서버 기준, 현장·일반 교환 모두)
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useApi(() => getPosts({ keyword }), [keyword]);

  // 목록 영역: 처음 불러오는 중 / 에러 / 결과 없음 / 목록
  // 다시 불러오는 동안에는 이전 목록을 그대로 보여줌 (깜빡임 방지)
  const renderList = () => {
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
      return (
        <RequestStateView
          message={
            keyword ? "검색 결과가 없어요" : "아직 올라온 교환글이 없어요"
          }
        />
      );
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
  };

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

      {renderList()}
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
