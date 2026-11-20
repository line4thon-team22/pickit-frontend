import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/header/Header";
import CommonButton from "../../components/button/CommonButton";
import LoginRequiredModal from "../../components/modal/LoginRequiredModal";
import PhotoPicker from "./PhotoPicker";
import PopupSelect from "./PopupSelect";

import useApi from "../../hooks/useApi";
import { getPopups } from "../../api/popupApi";
import {
  createPost,
  getMyVerifiedPopups,
  uploadPostImages,
} from "../../api/exchangeApi";
import RequestStateView from "./RequestStateView";

const DESCRIPTION_MAX = 120;

// 교환글 작성 (피그마 기본 664:7169, 팝업 목록 711:8483, 팝업 선택 711:8564)
// - 교환 보드 "+ 교환"에서 오면 ?popupId로 그 팝업이 선택된 상태로 시작
// - 필수값: 사진 1장 이상, 상품명, 구하는 제품, 팝업
// - 폼 값 이름은 작성 API(POST /api/posts) 필드에 맞춤 (화면 표시용 이름은 exchangeApi.js에서 변환)
// - 카테고리는 서버가 팝업 기준으로 채워서 보내지 않음, 현장 밖에서 쓴 글은 서버가 일반 교환으로 분류
export default function ExchangeWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 팝업 선택 목록 (팝업 탭과 같은 전체 목록)
  const {
    data: popups,
    error: popupsError,
    refetch: refetchPopups,
  } = useApi(() => getPopups(), []);

  // 내 현장 팝업: 목록 맨 위에 분홍 글씨로 표시
  // 로그인 안 했거나 미인증·에러면 하이라이트 없이 전체 목록만
  // TODO(위치 인증): 담당 팀원의 전역 상태로 교체
  const { data: verification } = useApi(getMyVerifiedPopups, []);
  const highlightIds = verification?.popups.map((popup) => popup.id) ?? [];

  const [photos, setPhotos] = useState([]);

  // 넘겨받은 popupId로 시작, 목록에 실제로 있는 팝업일 때만 선택된 것으로 봄
  const [popupId, setPopupId] = useState(
    searchParams.get("popupId") ? Number(searchParams.get("popupId")) : null,
  );
  const selectedPopupId = popups?.some((popup) => popup.id === popupId)
    ? popupId
    : null;
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
    selectedPopupId != null;

  // ===== 작성 완료 =====
  // 1) 사진 업로드 → 서버 이미지 경로 (배열 순서 = 사진 순서) 2) 글 저장 → 새 글 상세로 이동
  // - 보내는 동안 버튼 비활성 (두 번 눌러도 한 번만 저장)
  // - 실패: 입력값 그대로 두고 안내 (401은 로그인 모달)
  //   사진 업로드 후 글 저장만 실패하면 다시 누를 때 사진을 또 올림 (안 쓰이는 사진이 서버에 남을 수 있음)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const imageUrls = await uploadPostImages(
        photos.map((photo) => photo.file),
      );
      const newPostId = await createPost({
        ...form,
        popupId: selectedPopupId,
        imageUrls,
      });

      // 뒤로 가기 하면 작성 화면이 아니라 이전 화면으로
      navigate(`/exchange/post/${newPostId}`, { replace: true });
    } catch (err) {
      if (err.status === 401) setIsLoginModalOpen(true);
      // TODO: 안내 디자인 확정되면 alert 대신 수정
      else alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
            {popupsError ? (
              <RequestStateView
                message={popupsError.message}
                action="retry"
                onRetry={refetchPopups}
              />
            ) : (
              <PopupSelect
                popups={popups ?? []}
                highlightIds={highlightIds}
                selectedId={selectedPopupId}
                onSelect={setPopupId}
              />
            )}
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
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit}
        >
          작성 완료
        </CommonButton>
      </ButtonArea>

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
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
