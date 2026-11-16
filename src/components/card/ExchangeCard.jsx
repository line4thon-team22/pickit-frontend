import styled from "styled-components";

import StatusBadge from "../badge/StatusBadge";
import heartIcon from "../../assets/images/icon/heart-gray.svg";
import chatIcon from "../../assets/images/icon/chat-gray.svg";

export default function ExchangeCard({
  title,
  want,
  likes = 0,
  comments = 0,
  status = "new",
  onClick,
}) {
  return (
    <Container onClick={onClick}>
      <ImageArea />

      <Content>
        <StatusBadge type="exchange" status={status} />

        <Title>{title}</Title>
        <WantText>구함 : {want}</WantText>
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
  width: 72px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px solid #e3e3e3;
  background-color: #e8e8e8;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
`;

const Title = styled.p`
  margin: 10px 0 2px;
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

const Stats = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;
  gap: 13px;
  flex-shrink: 0;
  margin-left: auto;
  margin-bottom: 10px;
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
