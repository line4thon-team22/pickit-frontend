import { useState } from "react";
import styled from "styled-components";

import RecommendCard from "../card/RecomendCard";
import CommonButton from "../button/CommonButton";
import alertIcon from "../../assets/images/icon/alert.svg";

import { Recproducts } from "../../data/homeDummyData";

export default function RecommendBanner({
  products = [],
  isLoggedIn = false,
  onLoginClick,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // 로그인: 실제 추천 데이터 / 로그아웃: 기존 더미 데이터
  const displayProducts = isLoggedIn ? products : Recproducts.slice(0, 5);

  const handleMove = (index) => {
    if (displayProducts.length === 0) return;

    setActiveIndex((index + displayProducts.length) % displayProducts.length);
  };

  const handleTouchStart = (e) => {
    e.currentTarget.dataset.startX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const startX = Number(e.currentTarget.dataset.startX);
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) < 40) return;

    handleMove(activeIndex + (diff < 0 ? 1 : -1));
  };

  return (
    <Container>
      <BannerArea
        onTouchStart={isLoggedIn ? handleTouchStart : undefined}
        onTouchEnd={isLoggedIn ? handleTouchEnd : undefined}
      >
        {displayProducts.map((product, index) => {
          const offset =
            ((index - activeIndex + displayProducts.length + 2) %
              displayProducts.length) -
            2;

          const distance = Math.abs(offset);

          return (
            <CardWrapper
              key={index}
              $offset={offset}
              $distance={distance}
              onClick={() => isLoggedIn && handleMove(index)}
            >
              <RecommendCard
                {...product}
                isActive={distance === 0}
                $width={distance === 0 ? 160 : distance === 1 ? 140 : 120}
                $height={distance === 0 ? 250 : distance === 1 ? 219 : 188}
              />
            </CardWrapper>
          );
        })}

        {!isLoggedIn && (
          <LoginOverlay>
            <img src={alertIcon} alt="" />

            <Message>
              로그인하면 더 관심있는 교환글을
              <br />
              바로 볼 수 있어요!
            </Message>

            <CommonButton
              $width={142}
              $height={28}
              $fontSize={12}
              $borderRadius={16}
              onClick={onLoginClick}
            >
              로그인하러 가기
            </CommonButton>
          </LoginOverlay>
        )}
      </BannerArea>

      <Indicator>
        {displayProducts.map((_, index) => (
          <Line
            key={index}
            $active={index === activeIndex}
            onClick={() => isLoggedIn && handleMove(index)}
          />
        ))}
      </Indicator>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  isolation: isolate;
  width: 100%;
`;

const BannerArea = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  touch-action: pan-y;
`;

const CardWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%)
    translateX(
      ${({ $offset }) => {
        const distance = Math.abs($offset);

        if (distance === 0) return 0;
        if (distance === 1) return Math.sign($offset) * 60;
        return Math.sign($offset) * 100;
      }}px
    );

  z-index: ${({ $distance }) => 5 - $distance};

  transition: transform 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 16px;

    background-color: rgba(
      255,
      255,
      255,
      ${({ $distance }) => ($distance === 0 ? 0 : $distance === 1 ? 0.2 : 0.75)}
    );

    pointer-events: none;
  }
`;

const LoginOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  background-color: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
`;

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #141414;
  text-align: center;
`;

const Indicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
`;

const Line = styled.div`
  width: ${({ $active }) => ($active ? 14 : 5)}px;
  height: 3px;
  border-radius: 10px;
  background-color: ${({ $active }) => ($active ? "#141414" : "#d9d9d9")};
  cursor: pointer;
`;
