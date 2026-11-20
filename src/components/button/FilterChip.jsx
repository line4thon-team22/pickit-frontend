import styled, { css } from "styled-components";
import filterIcon from "../../assets/images/icon/filter.svg";
import closeIcon from "../../assets/images/icon/close-pink.svg";

// 필터 버튼·선택된 필터 칩 (피그마 팝업 탭 254:2669 / 필터 적용 293:8095)
// - variant="filter": 필터 아이콘 + "필터" (바텀시트 열기)
// - variant="selected": × 아이콘 + 선택한 값 (누르면 해당 필터 해제)
export default function FilterChip({
  variant = "filter",
  children,
  onClick,
  ...props
}) {
  const isSelected = variant === "selected";

  return (
    <Chip
      type="button"
      $isSelected={isSelected}
      onClick={onClick}
      aria-label={isSelected ? `${children} 필터 해제` : undefined}
      {...props}
    >
      <Icon src={isSelected ? closeIcon : filterIcon} alt="" />
      {children ?? "필터"}
    </Chip>
  );
}

const Chip = styled.button`
  width: fit-content;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  padding: 3px 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  border-radius: 10000px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray[700]};

  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
  cursor: pointer;

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      border-color: #ff66a6;
      background-color: #ffe5f0;
      color: #ff66a6;
    `}
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
