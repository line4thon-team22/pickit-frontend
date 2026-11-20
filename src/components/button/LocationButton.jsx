import styled, { css } from "styled-components";
import locationIcon from "../../assets/images/icon/location-white.svg";

// 헤더 위치 버튼 (피그마 헤더 Default 228:4129 / Variant5 319:13214)
// - 인증 전: "위치 인증"
// - 인증 후(isVerified): "팝업 확인" + 굵은 글자 + 안쪽 그림자
// children을 넘기면 기본 문구 대신 표시한다
export default function LocationButton({
  isVerified = false,
  children,
  onClick,
  ...props
}) {
  return (
    <Button type="button" $isVerified={isVerified} onClick={onClick} {...props}>
      <Icon src={locationIcon} alt="" />
      {children ?? (isVerified ? "팝업 확인" : "위치 인증")}
    </Button>
  );
}

const Button = styled.button`
  width: fit-content;
  height: object-fit;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;

  padding: 4px 8px;

  position: relative;
  overflow: hidden;

  border: 1px solid #ff66a6;
  border-radius: 10000px;
  background-color: #ff006a;
  color: #fafafa;

  font-family: inherit;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;

  ${({ $isVerified }) =>
    $isVerified &&
    css`
      font-weight: 600;
      box-shadow: inset 0 -4px 8px rgba(255, 229, 240, 0.6);
    `}

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.25);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const Icon = styled.img`
  width: 12px;
  height: 12px;
`;
