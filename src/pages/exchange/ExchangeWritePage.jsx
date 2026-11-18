import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/header/Header";
import CommonButton from "../../components/button/CommonButton";
import PhotoPicker from "./PhotoPicker";
import PopupSelect from "./PopupSelect";

import { popups } from "../../data/popupDummyData";
import { myLocationPopupIds } from "../../data/exchangeDummyData";

const DESCRIPTION_MAX = 120;

// 교환글 작성 (피그마 기본 664:7169, 팝업 목록 711:8483, 팝업 선택 711:8564)
// - 교환 보드 "+ 교환"에서 오면 ?popupId로 그 팝업이 선택된 상태로 시작
// - 필수값: 사진 1장 이상, 상품명, 구하는 제품, 팝업
// - 폼 값 이름은 작성 API(POST /api/posts) 필드에 맞춤
//   TODO(API): 목록·상세 더미 필드(title/want/place/time)와 이름이 다름 → API 연동 시 함께 정리
export default function ExchangeWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 넘겨받은 popupId가 실제 팝업일 때만 선택
  const initialPopupId = popups.some(
    (popup) => String(popup.id) === searchParams.get("popupId"),
  )
    ? Number(searchParams.get("popupId"))
    : null;

  // TODO: 위치 인증 전역 상태 연결 (지금은 인증된 것으로 보고 내 현장 팝업을 목록 맨 위에 표시)
  const isLocationVerified = true;

  const [photos, setPhotos] = useState([]);
  const [popupId, setPopupId] = useState(initialPopupId);
  const [form, setForm] = useState({
    haveItemName: "",
    wantItemName: "",
    preferredLocation: "",
    preferredTime: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 사진 미리보기 URL: 지울 때와 화면을 나갈 때 해제
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(
    () => () =>
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)),
    [],
  );

  const handleAddPhotos = (files) =>
    setPhotos((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
      })),
    ]);

  const handleRemovePhoto = (id) =>
    setPhotos((prev) => {
      const target = prev.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((photo) => photo.id !== id);
    });

  const isValid =
    photos.length > 0 &&
    form.haveItemName.trim() !== "" &&
    form.wantItemName.trim() !== "" &&
    popupId != null;

  const handleSubmit = () => {
    if (!isValid) return;

    // TODO(API): 1) POST /api/posts/images (multipart, files) → imageUrls (배열 순서 = 사진 순서)
    //            2) POST /api/posts { popupId, categoryId, haveItemName, wantItemName,
    //               preferredLocation, preferredTime, description, imageUrls }
    //            categoryId는 선택한 팝업 데이터의 categoryId 사용
    // TODO(API): 위치 인증 미유효 시 403 처리 (403 기준 백엔드 확인 중)
    alert("작성 완료 (API 연동 전이라 저장되지 않아요)");
    navigate(`/exchange/board/${popupId}`, { replace: true });
  };

  return (
    <>
      <Header variant="back" />

      <Content>
        <PhotoPicker
          photos={photos}
          onAdd={handleAddPhotos}
          onRemove={handleRemovePhoto}
        />

        <FormArea>
          <FieldGroup>
            <UnderlineField $size={24}>
              <label htmlFor="haveItemName">상품명 :</label>
              <input
                id="haveItemName"
                name="haveItemName"
                value={form.haveItemName}
                onChange={handleChange}
                autoComplete="off"
              />
            </UnderlineField>

            <UnderlineField $size={16}>
              <label htmlFor="wantItemName">구하는 제품 :</label>
              <input
                id="wantItemName"
                name="wantItemName"
                value={form.wantItemName}
                onChange={handleChange}
                autoComplete="off"
              />
            </UnderlineField>
          </FieldGroup>

          <DetailGroup>
            <DetailField>
              <label htmlFor="preferredLocation">교환 장소 :</label>
              <input
                id="preferredLocation"
                name="preferredLocation"
                placeholder="교환이 가능한 장소를 작성해주세요 :)"
                value={form.preferredLocation}
                onChange={handleChange}
                autoComplete="off"
              />
            </DetailField>

            <DetailField>
              <label htmlFor="preferredTime">교환 가능 시간 :</label>
              <input
                id="preferredTime"
                name="preferredTime"
                placeholder="현장 교환이 가능한 시간을 작성해주세요 :)"
                value={form.preferredTime}
                onChange={handleChange}
                autoComplete="off"
              />
            </DetailField>
          </DetailGroup>

          <PopupField>
            <PopupLabel>팝업 선택</PopupLabel>
            {/* TODO(API): 작성용 팝업 목록 API·내 현장 팝업 구분 방식 백엔드 확인 중 */}
            <PopupSelect
              popups={popups}
              highlightIds={isLocationVerified ? myLocationPopupIds : []}
              selectedId={popupId}
              onSelect={setPopupId}
            />
          </PopupField>
        </FormArea>

        <DescriptionArea>
          <DescriptionBox>
            <textarea
              name="description"
              aria-label="상품 설명"
              placeholder="교환할 제품의 설명을 써주세요 :)"
              maxLength={DESCRIPTION_MAX}
              value={form.description}
              onChange={handleChange}
            />
            <Counter>
              {form.description.length}/{DESCRIPTION_MAX}
            </Counter>
          </DescriptionBox>
        </DescriptionArea>
      </Content>

      {/* 피그마대로 화면 아래 고정 (711:8610) */}
      <ButtonArea>
        <CommonButton
          $width={354}
          $borderRadius={10000}
          disabled={!isValid}
          onClick={handleSubmit}
        >
          작성 완료
        </CommonButton>
      </ButtonArea>
    </>
  );
}

// 피그마 711:8567: 위아래 24, 사진과 폼 사이 32
// 아래 고정 버튼(60 + 위아래 32)에 내용이 가리지 않도록 아래 여백 확보
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 0 calc(124px + env(safe-area-inset-bottom));
`;

const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 20px 24px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const inputReset = `
  flex: 1;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  color: inherit;
`;

// 상품명 24/500, 구하는 제품 16/500, 아래 테두리 #d0d0d0
const UnderlineField = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #d0d0d0;

  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ $size }) => $size}px;
  font-weight: 500;
  line-height: normal;

  label {
    flex-shrink: 0;
  }

  input {
    ${inputReset}
  }
`;

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 4px;
`;

// 14/400, 라벨 #141414, placeholder #727272
const DetailField = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 2px;
  border-bottom: 1px solid #d0d0d0;

  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: 14px;
  font-weight: 400;
  line-height: normal;

  label {
    flex-shrink: 0;
    white-space: nowrap;
  }

  input {
    ${inputReset}

    &::placeholder {
      color: ${({ theme }) => theme.colors.gray[700]};
    }
  }
`;

const PopupField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PopupLabel = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[900]};
  ${({ theme }) => theme.typography.h4}
`;

const DescriptionArea = styled.div`
  padding: 0 20px;
`;

// 피그마 711:8606: 높이 100, padding 16, radius 12
const DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100px;
  padding: 16px;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  background-color: #fafafa;

  textarea {
    flex: 1;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    resize: none;

    color: ${({ theme }) => theme.colors.gray[900]};
    font-size: 14px;
    font-weight: 400;
    line-height: normal;

    &::placeholder {
      color: ${({ theme }) => theme.colors.gray[700]};
    }
  }
`;

const Counter = styled.span`
  align-self: flex-end;
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 12px;
  font-weight: 300;
  line-height: normal;
`;

// 피그마 711:8610: 화면 아래 고정, 좌우 24, 위아래 32 (배경 없음)
const ButtonArea = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 5;
  transform: translateX(-50%);

  display: flex;
  justify-content: center;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  padding: 32px 24px max(32px, env(safe-area-inset-bottom));
  pointer-events: none;

  button {
    pointer-events: auto;
  }
`;
