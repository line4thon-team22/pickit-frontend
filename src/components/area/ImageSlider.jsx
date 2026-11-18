import { useRef, useState } from "react";
import styled from "styled-components";

// 사진 여러 장을 좌우로 넘기는 슬라이드 (교환글 상세 사진 영역)
// - 한 장씩 딱 맞게 멈춤 (scroll-snap), 2장 이상일 때만 아래 가운데 인디케이터 표시
// - 인디케이터 모양: 홈 추천 배너(RecommendBanner)와 같은 선 모양을 흰색으로
// - 인디케이터를 누르면 해당 사진으로 이동 (데스크톱에서도 넘길 수 있게)
// - isDimmed: 모든 사진을 어둡게 (교환글 예약 중·교환 완료)
// - 찜 하트 등 사진 위 버튼은 바깥에서 겹쳐서 배치
export default function ImageSlider({
  images = [],
  alt = "사진",
  height = 480,
  isDimmed = false,
}) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    setActiveIndex(Math.round(scrollLeft / clientWidth));
  };

  const moveTo = (index) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" });
  };

  return (
    <Container>
      <Track ref={trackRef} onScroll={handleScroll} $height={height}>
        {images.map((image, index) => (
          <Slide key={`${image}-${index}`} $isDimmed={isDimmed}>
            <img
              src={image}
              alt={images.length > 1 ? `${alt} ${index + 1}` : alt}
            />
          </Slide>
        ))}
      </Track>

      {images.length > 1 && (
        <Indicator>
          {images.map((image, index) => (
            <Dot
              key={`${image}-${index}`}
              type="button"
              $active={index === activeIndex}
              onClick={() => moveTo(index)}
              aria-label={`사진 ${index + 1} 보기`}
            />
          ))}
        </Indicator>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
`;

const Track = styled.div`
  display: flex;
  height: ${({ $height }) => $height}px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
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

  /* 어둡게: rgba(0, 0, 0, 0.5) (피그마 교환 완료 439:21571) */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: ${({ $isDimmed }) => ($isDimmed ? 1 : 0)};
    pointer-events: none;
  }
`;

// 찜 하트(오른쪽 아래 24px)와 겹치지 않게 가운데 아래
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
