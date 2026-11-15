import styled from "styled-components";

export default function CommonButton({
  children,
  variant = "primary",
  ...props
}) {
  return (
    <Button $variant={variant} {...props}>
      {children}
    </Button>
  );
}

// 사용할 때 어떤 버튼인지 variant(default는 검정색)와 가로, 세로, radius(default는 12px), 폰트 크기 지정 가능
const Button = styled.button`
  width: ${({ $width }) => $width || 338}px;
  height: ${({ $height }) => $height || 60}px;
  border: 1px solid #e3e3e3;
  border-radius: ${({ $borderRadius }) => $borderRadius || 12}px;

  background-color: ${({ $variant }) =>
    $variant === "primary" ? "#141414" : "#fafafa"};
  color: ${({ $variant }) => ($variant === "primary" ? "#fafafa" : "#141414")};

  font-family: inherit;
  font-size: ${({ $fontSize }) => $fontSize || 20}px;
  font-weight: 600;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  padding: 0;
  cursor: pointer;

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === "primary" ? "#141414" : "#d0d0d0"};
    color: #727272;
  }

  &:hover:not(:disabled) {
    background-color: ${({ $variant }) =>
      $variant === "primary" ? "#141414" : "#d0d0d0"};
    color: #727272;
  }

  &:active:not(:disabled) {
    background-color: ${({ $variant }) =>
      $variant === "primary" ? "#101010" : "#c0c0c0"};
    color: #727272;
  }

  &:disabled {
    background-color: #9ca3af;
    color: #ffffff;
    cursor: not-allowed;
  }
`;
