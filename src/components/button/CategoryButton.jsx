import { useState } from "react";
import styled from "styled-components";

export default function CategoryButton({
  children,
  defaultSelected = false,
  onChange,
  ...props
}) {
  const [selected, setSelected] = useState(defaultSelected);

  const handleClick = () => {
    setSelected(!selected);
    onChange?.(!selected);
  };

  return (
    <Chip
      type="button"
      $selected={selected}
      onClick={handleClick}
      aria-pressed={selected}
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
`;
