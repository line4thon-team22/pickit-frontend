import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/header/Header";
import StatusBadge from "../../components/badge/StatusBadge";
import CommonButton from "../../components/button/CommonButton";

import useApi from "../../hooks/useApi";
import { getPopupDetail } from "../../api/popupApi";

// 팝업 상세 화면 (피그마 팝업 상세 257:3150)
export default function PopupDetailPage() {
  const navigate = useNavigate();
  const { popupId } = useParams();

  const {
    data: popup,
    isLoading,
    error,
    refetch,
  } = useApi(() => getPopupDetail(popupId), [popupId]);

  // TODO: 로딩·에러·없는 팝업 안내 디자인 확정되면 수정
  if (isLoading) {
    return (
      <>
        <Header variant="back" />
        <EmptyText>불러오는 중이에요</EmptyText>
      </>
    );
  }

  if (error?.status === 404 || (!error && !popup)) {
    return (
      <>
        <Header variant="back" />
        <EmptyText>존재하지 않는 팝업이에요</EmptyText>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header variant="back" />
        <ErrorArea>
          <EmptyText>{error.message}</EmptyText>
          <CommonButton
            variant="secondary"
            $width={120}
            $height={36}
            $fontSize={14}
            $borderRadius={10000}
            onClick={refetch}
          >
            다시 시도
          </CommonButton>
        </ErrorArea>
      </>
    );
  }

  return (
    <>
      <Header variant="back" />

      <Poster>
        <img src={popup.image} alt={popup.title} />
      </Poster>

      <InfoSection>
        <TitleArea>
          <StatusBadge type="popup" status={popup.status} size="large" />
          <Title>{popup.title}</Title>
        </TitleArea>

        <InfoList>
          <InfoRow>
            <dt>장소 :</dt>
            <dd>{popup.address}</dd>
          </InfoRow>
          <InfoRow>
            <dt>날짜 :</dt>
            <dd>{popup.period}</dd>
          </InfoRow>
        </InfoList>
      </InfoSection>

      <DescriptionArea>
        <Description>{popup.description}</Description>
      </DescriptionArea>

      <ButtonArea>
        {/* 이 팝업의 교환 보드로 이동 */}
        <CommonButton
          $width={354}
          $borderRadius={10000}
          onClick={() => navigate(`/exchange/board/${popup.id}`)}
        >
          상품 교환하기
        </CommonButton>
      </ButtonArea>
    </>
  );
}

const Poster = styled.div`
  width: 100%;
  height: 480px;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  overflow: hidden;
  background-color: #e8e8e8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
`;

const InfoSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 24px;
  border-bottom: 1px solid #e3e3e3;
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Title = styled.h1`
  margin: 0;
  color: #000;
  font-size: 24px;
  font-weight: 600;
  line-height: normal;
  word-break: keep-all;
`;

const InfoList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0 4px;
`;

// 라벨은 고정, 값이 길면 값 쪽만 줄바꿈
const InfoRow = styled.div`
  display: flex;
  gap: 12px;

  dt,
  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.gray[700]};
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
  }

  dt {
    flex-shrink: 0;
  }

  dd {
    flex: 1;
    min-width: 0;
  }
`;

const DescriptionArea = styled.div`
  padding: 20px;
`;

const Description = styled.p`
  margin: 0;
  padding: 16px;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  background-color: #fafafa;

  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  white-space: pre-wrap;
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px 24px;
`;

const ErrorArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 80px;

  p {
    padding-bottom: 16px;
  }
`;

const EmptyText = styled.p`
  margin: 0;
  padding: 80px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[700]};
  ${({ theme }) => theme.typography.body3};
`;
