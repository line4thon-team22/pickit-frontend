import styled from "styled-components";

export default function AppointmentCard({
  image,
  title,
  want,
  location,
  date,
  onClick,
}) {
  return (
    <Container onClick={onClick}>
      <ImageArea>{image && <img src={image} alt={title} />}</ImageArea>

      <Content>
        <Title>{title}</Title>
        <WantText>구함 : {want}</WantText>
        <Info>교환 장소 : {location}</Info>
        <Info>교환 시간 : {date}</Info>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  width: 100%;
  padding: 16px;
  box-sizing: border-box;

  border: 2px solid #ff99c3;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 0 4px 0 #ff006a;

  cursor: pointer;
`;

const ImageArea = styled.div`
  width: 72px;
  height: 90px;
  flex-shrink: 0;
  overflow: hidden;

  border-radius: 12px;
  border: 1px solid #e3e3e3;
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
  gap: 3px;
  min-width: 0;
`;

const Title = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #141414;
`;

const WantText = styled.p`
  margin: 0 0 5px 0;
  font-size: 12px;
  color: #ff006a;
`;

const Info = styled.p`
  margin: 0;
  font-size: 12px;
  color: #727272;
`;
