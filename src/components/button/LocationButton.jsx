import styled from "styled-components";
import locationIcon from "../../assets/images/icon/location-white.svg";

export default function LocationButton({ children, onClick, ...props }) {
  return (
    <Button type="button" onClick={onClick} {...props}>
      <Icon src={locationIcon} alt="" />
      {children}
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
