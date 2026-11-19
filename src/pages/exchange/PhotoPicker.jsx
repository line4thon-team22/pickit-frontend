import { useEffect, useRef } from "react";
import styled from "styled-components";
import cameraIcon from "../../assets/images/icon/camera.svg";
import closeIcon from "../../assets/images/icon/close-pink.svg";

// 사진 최대 장수 (임시 5장)
// TODO(API): 백엔드 수정 후 반영 예정 - 이미지 업로드 최대 장수·용량 받으면 수정 (교환 API 요청 5번)
export const MAX_PHOTOS = 5;

// 교환글 작성 사진 선택 (피그마 카메라 박스 711:8569)
// - photos: [{ id, url }] (부모가 관리, 배열 순서 = 업로드 순서)
// - 카메라 박스 오른쪽에 고른 사진을 같은 크기로 가로 나열, 썸네일마다 삭제 버튼
// - capture 속성 없이 열어서 폰에서 "사진 찍기 / 보관함" 선택창이 뜨게 함
export default function PhotoPicker({
  photos = [],
  max = MAX_PHOTOS,
  onAdd,
  onRemove,
}) {
  const inputRef = useRef(null);
  const rowRef = useRef(null);
  const isFull = photos.length >= max;

  // 데스크톱 마우스 휠(세로)로도 가로 스크롤되게 변환 (터치·트랙패드는 원래대로 가로 스크롤)
  // passive: false여야 페이지가 같이 세로로 스크롤되는 걸 막을 수 있어서 직접 등록
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;

    const handleWheel = (e) => {
      const canScrollX = row.scrollWidth > row.clientWidth;
      if (!canScrollX || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      const atStart = row.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd =
        row.scrollLeft + row.clientWidth >= row.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return; // 끝에 닿으면 페이지 세로 스크롤로 넘김

      e.preventDefault();
      row.scrollLeft += e.deltaY;
    };

    row.addEventListener("wheel", handleWheel, { passive: false });
    return () => row.removeEventListener("wheel", handleWheel);
  }, []);

  const handleChange = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAdd?.(files.slice(0, max - photos.length));
    // 같은 사진을 지웠다가 다시 고를 수 있도록 선택값 초기화
    e.target.value = "";
  };

  return (
    <Row ref={rowRef}>
      <AddBox
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isFull}
        aria-label="사진 추가"
      >
        <img src={cameraIcon} alt="" />
        {photos.length > 0 && (
          <Count>
            {photos.length}/{max}
          </Count>
        )}
      </AddBox>

      <HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
      />

      {photos.map((photo, index) => (
        <Thumb key={photo.id}>
          <img src={photo.url} alt={`첨부 사진 ${index + 1}`} />
          <RemoveButton
            type="button"
            onClick={() => onRemove?.(photo.id)}
            aria-label={`사진 ${index + 1} 삭제`}
          >
            <img src={closeIcon} alt="" />
          </RemoveButton>
        </Thumb>
      ))}
    </Row>
  );
}

// 사진이 많아지면 가로 스크롤 (스크롤바는 숨김)
const Row = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 24px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// 피그마: 120×120, 배경 #ececec, 테두리 1.667px #e3e3e3, radius 20
const boxStyle = `
  position: relative;
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border: 1.667px solid #e3e3e3;
  border-radius: 20px;
  overflow: hidden;
`;

const AddBox = styled.button`
  ${boxStyle}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  background-color: #ececec;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

const Count = styled.span`
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Thumb = styled.div`
  ${boxStyle}
  background-color: #ececec;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;
