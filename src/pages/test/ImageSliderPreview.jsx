import { useRef, useState } from "react";
import styled from "styled-components";
import ToggleIconButton from "../../components/button/ToggleIconButton";
import heartLineIcon from "../../assets/images/icon/heart-white-line-large.svg";
import heartFilledIcon from "../../assets/images/icon/heart-pink-large.svg";

// [테스트 전용] 교환글 상세 사진 여러 장 예시 (피그마 디자인 없음, 제안용)
// - 상세 사진 영역(480px)을 좌우로 넘기는 슬라이드 + 사진 위 인디케이터
// - 인디케이터 모양은 홈 추천 배너(RecommendBanner)와 같은 선 모양을 흰색으로
// - 디자인 확정되면 components/로 옮겨 ExchangePostDetailPage에 적용
export default function ImageSliderPreview({ images = [], isDimmed = false }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    setActiveIndex(Math.round(scrollLeft / clientWidth));
  };

  // 데스크톱 확인용: 인디케이터를 누르면 해당 사진으로 이동
  const moveTo = (index) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" });
  };

  return (
    <Container>
      <Track ref={trackRef} onScroll={handleScroll}>
        {images.map((image, index) => (
          <Slide key={image} $isDimmed={isDimmed}>
            <img src={image} alt={`교환글 사진 ${index + 1}`} />
          </Slide>
        ))}
      </Track>

      {images.length > 1 && (
        <Indicator>
          {images.map((image, index) => (
            <Dot
              key={image}
              type="button"
              $active={index === activeIndex}
              onClick={() => moveTo(index)}
              aria-label={`사진 ${index + 1} 보기`}
            />
          ))}
        </Indicator>
      )}

      <HeartPosition>
        <ToggleIconButton
          inactiveIcon={heartLineIcon}
          activeIcon={heartFilledIcon}
          aria-label="찜하기"
          $width={48}
          $height={48}
          $iconSize={48}
        />
      </HeartPosition>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  max-width: 402px;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
`;

// 한 장씩 딱 맞게 멈추는 가로 스크롤
const Track = styled.div`
  display: flex;
  height: 480px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Slide = styled.div`
  position: relative;
  flex: 0 0 100%;
  height: 100%;
  scroll-snap-align: start;
  background-color: #e8e8e8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: ${({ $isDimmed }) => ($isDimmed ? 1 : 0)};
    pointer-events: none;
  }
`;

// 하트(오른쪽 아래 24px)와 겹치지 않게 가운데 아래
const Indicator = styled.div`
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
`;

const Dot = styled.button`
  width: ${({ $active }) => ($active ? 14 : 5)}px;
  height: 3px;
  padding: 0;
  border-radius: 10px;
  background-color: ${({ $active }) =>
    $active ? "#ffffff" : "rgba(255, 255, 255, 0.5)"};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  transition: width 0.2s ease;
`;

const HeartPosition = styled.div`
  position: absolute;
  right: 24px;
  bottom: 24px;
  display: flex;
`;
