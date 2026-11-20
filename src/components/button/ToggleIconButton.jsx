import { useState } from "react";
import styled from "styled-components";

export default function ToggleIconButton({
  defaultActive = false,
  inactiveIcon,
  activeIcon,
  onChange,
  ...props
}) {
  const [isActive, setIsActive] = useState(defaultActive);

  const handleClick = () => {
    setIsActive(!isActive);
    onChange?.(!isActive);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      {...props}
    >
      <Icon
        src={isActive ? activeIcon : inactiveIcon}
        alt=""
        $size={props.$iconSize}
      />
    </Button>
  );
}

const Button = styled.button`
  width: ${({ $width }) => $width || 32}px;
  height: ${({ $height }) => $height || 32}px;
  border: none;
  background-color: transparent;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  padding: 0;
  cursor: pointer;
`;

const Icon = styled.img`
  width: ${({ $size }) => $size || 24}px;
  height: ${({ $size }) => $size || 24}px;
  object-fit: contain;
`;
