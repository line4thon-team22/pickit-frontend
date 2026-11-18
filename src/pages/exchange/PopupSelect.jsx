import { useEffect, useId, useRef, useState } from "react";
import styled, { css } from "styled-components";
import arrowIcon from "../../assets/images/icon/dropdown-arrow.svg";

// 교환글 작성 팝업 선택창 (피그마 닫힘 664:7169, 열림 711:8483, 선택 711:8564)
// - popups: 팝업 목록
// - highlightIds: 내 현장 팝업 id 목록 → 분홍 글씨로 목록 맨 위에 (highlightIds 순서), 나머지는 원래 순서
// - 선택창을 누르면 목록이 열리고 바로 검색 입력 가능 (키보드 올라옴)
// - 목록을 누르거나 스크롤하면 키보드만 내려가고 목록은 유지
// - 팝업을 고르거나 선택창 바깥을 누르면 닫힘
export default function PopupSelect({
  popups = [],
  highlightIds = [],
  selectedId,
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();

  const selectedPopup = popups.find((popup) => popup.id === selectedId);

  const close = () => {
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // 선택창 바깥을 누르면 닫기
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (e) => {
      if (containerRef.current?.contains(e.target)) return;
      setIsOpen(false);
      inputRef.current?.blur();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const handleOpen = () => {
    if (isOpen) return;
    setQuery("");
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    // 엔터: 키보드만 내리고 목록은 유지 (한글 조합 중 엔터는 무시)
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      inputRef.current?.blur();
    }
    if (e.key === "Escape") close();
  };

  // 항목 id는 data-id로 받음 (렌더 중 ref를 넘기지 않도록 핸들러 하나로 처리)
  const handleOptionClick = (e) => {
    onSelect?.(Number(e.currentTarget.dataset.id));
    close();
  };

  // 내 현장 팝업을 맨 위로
  const highlightedPopups = highlightIds
    .map((id) => popups.find((popup) => popup.id === id))
    .filter(Boolean);
  const otherPopups = popups.filter(
    (popup) => !highlightIds.includes(popup.id),
  );
  const orderedPopups = [...highlightedPopups, ...otherPopups];

  // TODO: 검색 범위(제목만) 확정되면 수정
  const lowerQuery = query.trim().toLowerCase();
  const filteredPopups = orderedPopups.filter((popup) =>
    popup.title.toLowerCase().includes(lowerQuery),
  );

  return (
    <Container ref={containerRef}>
      <Trigger $isOpen={isOpen}>
        {/* TODO: 검색 UI 디자인 확인 (열렸을 때 placeholder는 임시 문구) */}
        <Input
          ref={inputRef}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          value={isOpen ? query : (selectedPopup?.title ?? "")}
          placeholder={
            isOpen ? "팝업 이름으로 검색해 보세요" : "팝업을 선택해주세요."
          }
          onFocus={handleOpen}
          onClick={handleOpen}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <ArrowButton
          type="button"
          onClick={() => (isOpen ? close() : inputRef.current?.focus())}
          aria-label={isOpen ? "팝업 목록 닫기" : "팝업 목록 열기"}
          $isOpen={isOpen}
        >
          <img src={arrowIcon} alt="" />
        </ArrowButton>
      </Trigger>

      {isOpen && (
        // 목록을 누르거나 스크롤하면 키보드만 내림
        <List
          id={listId}
          role="listbox"
          onPointerDown={() => inputRef.current?.blur()}
          onScroll={() => inputRef.current?.blur()}
        >
          {filteredPopups.length > 0 ? (
            filteredPopups.map((popup) => (
              <Option
                key={popup.id}
                role="option"
                aria-selected={popup.id === selectedId}
                $isHighlighted={highlightIds.includes(popup.id)}
                $isSelected={popup.id === selectedId}
                data-id={popup.id}
                onClick={handleOptionClick}
              >
                {popup.title}
              </Option>
            ))
          ) : (
            // TODO: 검색 결과 없음 디자인 확정되면 수정
            <EmptyOption>검색 결과가 없어요</EmptyOption>
          )}
        </List>
      )}
    </Container>
  );
}

// 피그마: 테두리 #e3e3e3, radius 6, 열렸을 때 전체 높이 180
const Container = styled.div`
  width: 100%;
  border: 1px solid #e3e3e3;
  border-radius: 6px;
  overflow: hidden;
`;

const Trigger = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid
    ${({ $isOpen }) => ($isOpen ? "#e3e3e3" : "transparent")};
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;

  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  text-overflow: ellipsis;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ArrowButton = styled.button`
  display: flex;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  padding: 0;
  transform: rotate(${({ $isOpen }) => ($isOpen ? 180 : 0)}deg);
  transition: transform 0.2s ease;
`;

// 180 - 선택창 높이(약 25) - 테두리 = 약 153
const List = styled.ul`
  max-height: 153px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

// 피그마: 좌우 16, 위아래 7, 10px / 배경 #f6f6f6
// 내 현장 팝업: 분홍 글씨, 나머지: 회색 글씨, 선택: 분홍 배경 + 흰 글씨 SemiBold
const optionStyle = css`
  padding: 7px 16px;
  border-bottom: 1px solid #e3e3e3;
  background-color: #f6f6f6;

  font-size: 10px;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:last-child {
    border-bottom: none;
  }
`;

const Option = styled.li`
  ${optionStyle}
  color: ${({ $isHighlighted, theme }) =>
    $isHighlighted ? theme.colors.primary[500] : "#a1a1a1"};
  cursor: pointer;

  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      background-color: ${theme.colors.primary[500]};
      color: #fafafa;
      font-weight: 600;
    `}
`;

const EmptyOption = styled.li`
  ${optionStyle}
  color: #a1a1a1;
`;
