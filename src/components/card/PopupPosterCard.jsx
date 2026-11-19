import styled from "styled-components";
import StatusBadge from "../badge/StatusBadge";
import ToggleIconButton from "../button/ToggleIconButton";
import heartIcon from "../../assets/images/icon/heart-gray.svg";
import heartLineIcon from "../../assets/images/icon/heart-white-line.svg";
import heartFilledIcon from "../../assets/images/icon/heart-pink-shadow.svg";

// 팝업 탭·찜 탭용 포스터 카드 (피그마 팝업 탭 293:7496)
// - 포스터 위 왼쪽 위: 상태 뱃지 / 오른쪽 아래: 찜 하트
// - 기간 줄 오른쪽 끝: 찜 수 (피그마 없음, 교환 탭 내 현장 팝업 카드 PopupCard와 같은 모양)
export default function PopupPosterCard({
  image,
  title,
  status,
  location,
  period,
  likes = 0,
  isLiked = false,
  onClick,
  onLikeChange,
}) {
  return (
    <Container onClick={onClick}>
      <Poster>
        {image && <img src={image} alt={title} />}

        <BadgePosition>
          <StatusBadge type="popup" status={status} />
        </BadgePosition>

        {/* 하트 클릭이 카드 클릭(상세 이동)으로 이어지지 않도록 전파를 막음 */}
        <HeartPosition onClick={(e) => e.stopPropagation()}>
          {/* 누르면 바로 바뀌고 onLikeChange(다음 찜 여부)로 알림 → 서버 저장·실패 시 되돌리기는 화면에서 처리 */}
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
      </Poster>

      <Content>
        <Title>{title}</Title>

        <Meta>
          <p>{location}</p>

          <BottomRow>
            <p>{period}</p>

            <Likes>
              <img src={heartIcon} alt="" />
              <span>{likes}</span>
            </Likes>
          </BottomRow>
        </Meta>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 0;
  cursor: pointer;
`;

const Poster = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  overflow: hidden;
  background-color: #e8e8e8;
  box-sizing: border-box;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BadgePosition = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
`;

const HeartPosition = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
`;

// 피그마 카드 높이 294 - 포스터 220 - 간격 10 = 64
const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  min-height: 64px;
  min-width: 0;
  padding: 0 4px;
`;

const Title = styled.p`
  margin: 0;
  color: #000;
  font-size: 14px;
  font-weight: 500;
  word-break: keep-all;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.gray[700]};
    font-size: 10px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// 기간이 길면 기간만 말줄임, 찜 수는 항상 보이게
const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  min-width: 0;
`;

// PopupCard의 찜 수와 같은 스타일
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
