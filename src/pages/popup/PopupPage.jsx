import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/header/Header";
import SearchBar from "../../components/input/SearchBar";
import FilterChip from "../../components/button/FilterChip";
import PopupPosterCard from "../../components/card/PopupPosterCard";
import PopupFilterSheet from "../../components/modal/PopupFilterSheet";

import { popups } from "../../data/popupDummyData";
import {
  EMPTY_FILTERS,
  getSelectedChips,
  matchesFilters,
} from "./popupFilterUtils";

// 팝업 탭 목록 화면 (피그마 기본 팝업 탭 252:2331)
export default function PopupPage() {
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

  // 적용된 필터 ("선택 완료"를 눌렀을 때만 바뀜) / 필터 시트 열림 여부
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilters = (nextFilters) => {
    setAppliedFilters(nextFilters);
    setIsFilterOpen(false);
  };

  const handleRemoveFilter = (groupKey, value) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [groupKey]: prev[groupKey].filter((item) => item !== value),
    }));
  };

  // TODO(API): 팝업 목록 조회 API 연동 시 서버 검색·필터링으로 교체
  const filteredPopups = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();
    return popups.filter(
      (popup) =>
        popup.title.toLowerCase().includes(lowerKeyword) &&
        matchesFilters(popup, appliedFilters),
    );
  }, [keyword, appliedFilters]);

  const selectedChips = getSelectedChips(appliedFilters);

  return (
    <>
      <Header variant="main" />

      <TopArea>
        <SearchBar
          placeholder="궁금한 팝업을 검색해 보세요"
          $height={42}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onSearchClick={handleSearch}
        />

        <FilterRow>
          <FilterChip onClick={() => setIsFilterOpen(true)} />

          {/* 선택된 필터 칩: 누르면 해당 필터 해제 (피그마 필터 적용 293:7990) */}
          {selectedChips.map((chip) => (
            <FilterChip
              key={`${chip.groupKey}-${chip.value}`}
              variant="selected"
              onClick={() => handleRemoveFilter(chip.groupKey, chip.value)}
            >
              {chip.label}
            </FilterChip>
          ))}
        </FilterRow>
      </TopArea>

      {filteredPopups.length > 0 ? (
        <PopupGrid>
          {filteredPopups.map((popup) => (
            <PopupPosterCard
              key={popup.id}
              {...popup}
              onClick={() => navigate(`/popup/${popup.id}`)}
            />
          ))}
        </PopupGrid>
      ) : (
        // TODO: 검색·필터 결과 없음 디자인 확정되면 수정
        <EmptyText>조건에 맞는 팝업이 없어요</EmptyText>
      )}

      {/* 열 때마다 새로 마운트해서 지금 적용된 필터로 시작 */}
      {isFilterOpen && (
        <PopupFilterSheet
          appliedFilters={appliedFilters}
          onApply={handleApplyFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </>
  );
}

const TopArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 6px 24px 8px;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 4px;
`;

const PopupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 10px;
  row-gap: 32px;
  padding: 24px 24px 36px;
  border-top: 1px solid #e3e3e3;
`;

const EmptyText = styled.p`
  margin: 0;
  padding: 80px 24px;
  border-top: 1px solid #e3e3e3;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[700]};
  ${({ theme }) => theme.typography.body3};
`;
