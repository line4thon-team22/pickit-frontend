import styled from "styled-components";

export default function CommonInput({ type = "text", ...props }) {
  return <Input type={type} autoComplete="off" {...props} />;
}

const Input = styled.input`
  width: ${({ $width }) => $width || 338}px;
  height: ${({ $height }) => $height || 37}px;
  border: 1px solid #e3e3e3;
  border-radius: ${({ $borderRadius }) => $borderRadius || 16}px;
  background-color: #fafafa;

  padding: 0 10px;
  box-sizing: border-box;

  font-family: inherit;
  font-size: ${({ $fontSize }) => $fontSize || 14}px;
  font-weight: 400;
  color: #141414;

  outline: none;

  &::placeholder {
    color: #727272;
  }

  &:focus {
    border-color: #141414;
  }

  &:disabled {
    background-color: #f0f0f0;
    color: #a0a0a0;
    cursor: not-allowed;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #fafafa inset;
    -webkit-text-fill-color: #141414;
    transition: background-color 5000s ease-in-out 0s;
  }
`;
