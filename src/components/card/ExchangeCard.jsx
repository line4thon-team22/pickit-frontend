import styled from "styled-components";

import StatusBadge from "../badge/StatusBadge";
import heartIcon from "../../assets/images/icon/heart-gray.svg";
import chatIcon from "../../assets/images/icon/chat-gray.svg";

// badgeType·status: StatusBadge에 그대로 넘김 (교환글은 getExchangeBadge 결과 사용)
// isDimmed: 예약 중·교환 완료 글은 사진을 어둡게 (피그마 교환 보드 293:12409)
export default function ExchangeCard({
  image,
  title,
  want,
  likes = 0,
  comments = 0,
  badgeType = "exchange",
  status = "new",
  isDimmed = false,
  onClick,
}) {
  return (
    <Container onClick={onClick}>
      <ImageArea $isDimmed={isDimmed}>
        {image && <img src={image} alt={title} />}
      </ImageArea>

      {/* 텍스트 열과 찜·댓글을 아래선에 맞춤 (피그마 홈 254:2721) */}
      <Body>
        <Content>
          <StatusBadge type={badgeType} status={status} />

          <TextGroup>
            <Title>{title}</Title>
            <WantText>구함 : {want}</WantText>
          </TextGroup>
        </Content>

        <Stats>
          <Stat>
            <img src={heartIcon} alt="" />
            <span>{likes}</span>
          </Stat>

          <Stat>
            <img src={chatIcon} alt="" />
            <span>{comments}</span>
          </Stat>
        </Stats>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 90px;
  padding: 0 4px;
  cursor: pointer;
`;

const ImageArea = styled.div`
  position: relative;
  width: 72px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px solid #e3e3e3;
  overflow: hidden;
  background-color: #e8e8e8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* 어둡게: 피그마 rgba(0, 0, 0, 0.5) */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: ${({ $isDimmed }) => ($isDimmed ? 1 : 0)};
    pointer-events: none;
  }
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  padding-bottom: 10px;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  min-width: 0;
`;

const Title = styled.p`
  margin: 0;
  color: #141414;
  font-size: 14px;
  font-weight: 500;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

const WantText = styled.p`
  margin: 0;
  color: #ff006a;
  font-size: 12px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

// 피그마: 폭 65px 양 끝 배치. 숫자가 길어져도 겹치지 않게 최소 폭 + 최소 간격
const Stats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 65px;
  flex-shrink: 0;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #a1a1a1;
  font-size: 12px;

  img {
    width: 16px;
    height: 16px;
  }
`;
