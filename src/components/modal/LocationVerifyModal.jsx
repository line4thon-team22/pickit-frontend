import { useState } from "react";
import styled, { keyframes } from "styled-components";

import ModalBase from "./ModalBase";
import CommonButton from "../button/CommonButton";
import LocationMap from "../map/LocationMap";

import locationIcon from "../../assets/images/icon/location-pink.svg";
import loadingIcon from "../../assets/images/icon/loading.svg";
import refreshIcon from "../../assets/images/icon/refresh.svg";

import { popups } from "../../data/popupDummyData";

export default function LocationVerifyModal({ isOpen, onClose }) {
  const [step, setStep] = useState("request");

  const handleVerify = () => {
    setStep("loading");

    // TODO: 실제 위치 API 연결 시 교체
    setTimeout(() => {
      setStep("result");
    }, 2000);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} $width={330}>
      {step === "request" && (
        <Content>
          <Icon src={locationIcon} alt="" />

          <Title>지금 팝업 위치를 인증할까요?</Title>

          <Description>
            위치 인증 후 현재 위치에 있는 팝업의
            <br />
            현장 교환글을 이용할 수 있습니다.
          </Description>

          <CommonButton
            $width={288}
            $height={48}
            $fontSize={16}
            onClick={handleVerify}
          >
            내 위치 인증하기
          </CommonButton>
        </Content>
      )}

      {step === "loading" && (
        <Content>
          <LoadingIcon src={loadingIcon} alt="" />

          <Title>내 위치를 검색 중입니다 ···</Title>

          <Description>
            위치 인증 후 현재 위치에 있는 팝업의
            <br />
            현장 교환글을 이용할 수 있습니다.
          </Description>

          <CommonButton $width={288} $height={48} $fontSize={16} disabled>
            내 위치 인증하기
          </CommonButton>
        </Content>
      )}

      {step === "result" && (
        <ResultContent>
          <LocationHeader>
            <LocationInfo>
              <LocationLabel>현재 내 위치</LocationLabel>
              <LocationName>서울 용산</LocationName>
            </LocationInfo>

            <RefreshButton type="button" onClick={handleVerify}>
              <img src={refreshIcon} alt="" />
              <span>새로고침</span>
            </RefreshButton>
          </LocationHeader>

          <LocationMap />

          <PopupList>
            {popups.map((popup) => (
              <PopupItem key={popup.id}>{popup.title}</PopupItem>
            ))}
          </PopupList>

          <CommonButton
            $width={288}
            $height={48}
            $fontSize={16}
            onClick={onClose}
          >
            이 장소가 맞아요
          </CommonButton>
        </ResultContent>
      )}
    </ModalBase>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
  margin-bottom: 6px;
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingIcon = styled(Icon)`
  animation: ${rotate} 1s linear infinite;
`;

const Title = styled.p`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #141414;
`;

const Description = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 300;
  color: #727272;
`;

const ResultContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LocationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const LocationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const LocationLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #141414;
  padding: 0 4px;
`;

const LocationName = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #ff006a;
`;

const RefreshButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  img {
    width: 12px;
    height: 12px;
  }

  span {
    font-size: 8px;
    color: #727272;
    font-weight: 500;
  }
`;

const PopupList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  border: 1px solid #e3e3e3;
  border-radius: 12px;
  overflow: hidden;
`;

const PopupItem = styled.li`
  position: relative;
  padding: 8px 12px 8px 26px;

  font-size: 12px;
  font-weight: 400;
  color: #727272;

  &:not(:last-child) {
    border-bottom: 1px solid #e3e3e3;
  }

  &::before {
    content: "•";
    position: absolute;
    left: 10px;
    top: 8px;
    color: #727272;
  }
`;
