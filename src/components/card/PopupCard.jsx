import styled from "styled-components";
import heartIcon from "../../assets/images/icon/heart-gray.svg";

export default function PopupCard({
  image,
  title,
  location,
  period,
  likes = 0,
  onClick,
}) {
  return (
    <Container onClick={onClick}>
      <ImageArea>{image && <img src={image} alt={title} />}</ImageArea>

      <Content>
        <Title>{title}</Title>
        <Location>{location}</Location>

        <BottomRow>
          <Period>{period}</Period>

          <Likes>
            <img src={heartIcon} alt="" />
            <span>{likes}</span>
          </Likes>
        </BottomRow>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
  cursor: pointer;
`;

const ImageArea = styled.div`
  width: 100%;
  aspect-ratio: 178 / 100;
  border-radius: 12px;
  border: 1px solid #e3e3e3;
  overflow: hidden;
  background-color: #e8e8e8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin: 0 8px;
`;

const Title = styled.p`
  margin: 0 0 4px;
  color: #141414;
  font-size: 14px;
  font-weight: 500;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Location = styled.p`
  margin: 0 0 2px;
  color: #727272;
  font-size: 10px;
  font-weight: 500;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Period = styled.p`
  margin: 0;
  color: #727272;
  font-size: 10px;
  white-space: nowrap;
`;

const Likes = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;

  color: #a1a1a1;
  font-size: 10px;

  img {
    width: 12px;
    height: 12px;
  }
`;
