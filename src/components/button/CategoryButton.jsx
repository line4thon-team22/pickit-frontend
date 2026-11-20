import { useState } from "react";
import styled from "styled-components";

// selected를 넘기면 부모가 선택 상태를 관리하고, 안 넘기면 버튼이 직접 관리한다
export default function CategoryButton({
  children,
  selected,
  defaultSelected = false,
  onChange,
  ...props
}) {
  const [innerSelected, setInnerSelected] = useState(defaultSelected);
  const isSelected = selected ?? innerSelected;

  const handleClick = () => {
    if (selected === undefined) setInnerSelected(!isSelected);
    onChange?.(!isSelected);
  };

  return (
    <Chip
      type="button"
      $selected={isSelected}
      onClick={handleClick}
      aria-pressed={isSelected}
      {...props}
    >
      {children}
    </Chip>
  );
}

const Chip = styled.button`
  width: fit-content;
  height: object-fit;
  padding: 3px 10px;

  border: 1px solid ${({ $selected }) => ($selected ? "#FF006A" : "#727272")};
  border-radius: 10000px;
  background-color: #ffffff;

  color: ${({ $selected }) => ($selected ? "#FF006A" : "#727272")};

  font-family: inherit;
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  box-sizing: border-box;

  /* TODO: 비활성 칩 디자인 확정되면 수정 */
  &:disabled {
    border-color: #d0d0d0;
    color: #d0d0d0;
    cursor: not-allowed;
  }
`;
