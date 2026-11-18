import styled from "styled-components";
import ToggleIconButton from "../button/ToggleIconButton";
import heartIcon from "../../assets/images/icon/heart-gray.svg";
import heartLineIcon from "../../assets/images/icon/heart-white-line.svg";
import heartFilledIcon from "../../assets/images/icon/heart-pink-shadow.svg";

// showLikeButton: 이미지 오른쪽 아래 찜 하트 표시 (찜 탭 474:23011에서 사용)
// - 팝업 데이터를 {...popup}으로 넘기는 화면이 있어서 isLiked가 아닌 별도 prop으로 켬
export default function PopupCard({
  image,
  title,
  location,
  period,
  likes = 0,
  showLikeButton = false,
  isLiked = false,
  onClick,
  onLikeChange,
}) {
  return (
    <Container onClick={onClick}>
      <ImageArea>
        {image && <img src={image} alt={title} />}

        {showLikeButton && (
          // 하트 클릭이 카드 클릭(상세 이동)으로 이어지지 않도록 전파를 막음
          <HeartPosition onClick={(e) => e.stopPropagation()}>
            {/* TODO(API): 찜 추가/해제 API 연동 */}
            <ToggleIconButton
              defaultActive={isLiked}
              inactiveIcon={heartLineIcon}
              activeIcon={heartFilledIcon}
              onChange={onLikeChange}
              aria-label="찜하기"
              $width={24}
              $height={24}
              $iconSize={24}
            />
          </HeartPosition>
        )}
      </ImageArea>

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
  position: relative;
  width: 100%;
  aspect-ratio: 178 / 100;
  border-radius: 12px;
  border: 1px solid #e3e3e3;
  overflow: hidden;
  background-color: #e8e8e8;

  /* 팝업 이미지만 (하트 아이콘 img에는 적용 안 되게 직계 자식으로 한정) */
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 피그마 474:23011: 이미지 테두리 안쪽 기준 오른쪽·아래 10px
const HeartPosition = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
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
