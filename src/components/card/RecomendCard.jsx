import styled from "styled-components";

export default function RecommendCard({
  image,
  title,
  wanted,
  location,
  time,
  isActive = false,
  ...props
}) {
  return (
    <Card $isActive={isActive} {...props}>
      <BackgroundImage $image={image} />

      <ProductImage src={image} alt={title} />

      <Info>
        <Title>{title}</Title>
        <Wanted>구함 : {wanted}</Wanted>
        <Detail>교환 위치 : {location}</Detail>
        <Detail>교환 시간 : {time}</Detail>
      </Info>
    </Card>
  );
}

const Card = styled.div`
  position: relative;

  width: ${({ $width }) => $width || 160}px;
  height: ${({ $height }) => $height || 250}px;

  border: 1px solid ${({ $isActive }) => ($isActive ? "#FF006A" : "#FFB3D1")};

  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;

  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: -20px;

  background-image: ${({ $image }) => ($image ? `url("${$image}")` : "none")};
  background-size: cover;
  background-position: center;

  filter: blur(20px);
  opacity: 0.55;

  pointer-events: none;
`;

const ProductImage = styled.img`
  display: block;
  width: calc(100% - 7px);
  aspect-ratio: 1 / 1;
  margin: 4px;
  border-radius: 10px;
  border: 1px solid #ffcce1;
  object-fit: cover;
  position: relative;
  z-index: 1;
`;

const Info = styled.div`
  padding: 8px 12px 27px;
  position: relative;
  z-index: 1;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #141414;
`;

const Wanted = styled.div`
  margin: 4px 0;
  font-size: 10px;
  color: #ff006a;
  font-weight: 400;
`;

const Detail = styled.div`
  margin-top: 2px;
  font-size: 8px;
  font-weight: 400;
  color: #434343;
`;
