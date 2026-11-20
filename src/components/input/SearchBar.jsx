import styled from "styled-components";
import searchIcon from "../../assets/images/icon/search.svg";

// onSearchClick: 돋보기 버튼 클릭 시 실행 (input으로는 전달하지 않음)
export default function SearchBar({ onSearchClick, ...props }) {
  return (
    <Container
      $width={props.$width}
      $height={props.$height}
      $borderRadius={props.$borderRadius}
    >
      <Input type="search" placeholder="검색어를 입력해주세요" {...props} />
      <SearchButton type="button" aria-label="검색" onClick={onSearchClick}>
        <Icon src={searchIcon} alt="" />
      </SearchButton>
    </Container>
  );
}

const Container = styled.div`
  width: ${({ $width }) => $width || 354}px;
  height: ${({ $height }) => $height || 40}px;
  border: 1px solid #e3e3e3;
  border-radius: 10000px;
  background-color: #f6f6f6;

  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;

  padding: 0 20px;
  font-family: inherit;
  font-size: ${({ $fontSize }) => $fontSize || 16}px;
  font-weight: 500;
  color: #141414;

  &::placeholder {
    color: #727272;
  }

  &::-webkit-search-cancel-button {
    display: none;
  }
`;

const SearchButton = styled.button`
  width: 40px;
  height: 100%;
  border: none;
  background: transparent;
  padding: 0;
  margin-right: 8px;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;
