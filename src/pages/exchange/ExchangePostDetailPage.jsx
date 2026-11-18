import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/header/Header";
import StatusBadge from "../../components/badge/StatusBadge";
import ToggleIconButton from "../../components/button/ToggleIconButton";
import CommonButton from "../../components/button/CommonButton";
import heartLineIcon from "../../assets/images/icon/heart-white-line-large.svg";
import heartFilledIcon from "../../assets/images/icon/heart-pink-large.svg";
import heartGrayIcon from "../../assets/images/icon/heart-gray.svg";
import chatGrayIcon from "../../assets/images/icon/chat-gray.svg";
import starIcon from "../../assets/images/icon/star.svg";
import defaultProfile from "../../assets/images/profile/default-profile.jpg";

import { exchangePosts } from "../../data/exchangeDummyData";
import { getExchangeBadge, isTradeClosed } from "./exchangeUtils";

// 교환글 상세 (피그마 기본 293:12527, 찜 334:14220, 교환 완료 439:21567)
// - 예약 중·교환 완료: 사진 어둡게
// - 찜 하트: 교환 가능·예약 중은 표시, 교환 완료는 이미 찜한 사람에게만 표시(해제용)
export default function ExchangePostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();

  // TODO(API): 교환글 상세 조회 API 연동 시 더미 데이터 교체
  const post = exchangePosts.find((item) => String(item.id) === postId);

  if (!post) {
    return (
      <>
        <Header variant="back" />
        {/* TODO: 없는 교환글 안내 디자인 확정되면 수정 */}
        <EmptyText>존재하지 않는 교환글이에요</EmptyText>
      </>
    );
  }

  const badge = getExchangeBadge(post);

  // TODO: 디자인 확인 (예약 중 상세 디자인 없음, 교환 완료 + 이미 찜한 경우는 피그마와 다름)
  // 예약 중: 예약이 취소되면 다시 교환 가능해지므로 찜 유지
  // 교환 완료: 새로 찜할 이유가 없어 숨김 (피그마 439:21571), 단 이미 찜한 사람은 해제할 수 있게 표시
  // 서버에서 받은 찜 여부 기준이라, 해제해도 하트는 흰 테두리로 남아 다시 누를 수 있음
  const showLikeButton = post.tradeStatus !== "completed" || post.isLiked;

  const { author } = post;

  return (
    <>
      <Header variant="back" />

      <PhotoArea>
        <Photo $isDimmed={isTradeClosed(post)}>
          <img src={post.image} alt={post.title} />
        </Photo>

        {showLikeButton && (
          <HeartPosition>
            {/* TODO(API): 찜 추가/해제 API 연동 */}
            <ToggleIconButton
              defaultActive={post.isLiked}
              inactiveIcon={heartLineIcon}
              activeIcon={heartFilledIcon}
              aria-label="찜하기"
              $width={48}
              $height={48}
              $iconSize={48}
            />
          </HeartPosition>
        )}
      </PhotoArea>

      <InfoSection>
        <TopGroup>
          <BadgeRow>
            <StatusBadge type={badge.type} status={badge.status} size="large" />

            {/* TODO(API): 찜 수는 서버 값 표시 (피그마에서도 찜 토글 시 숫자 그대로) */}
            <Stats>
              <Stat>
                <img src={heartGrayIcon} alt="" />
                <span>{post.likes}</span>
              </Stat>
              <Stat>
                <img src={chatGrayIcon} alt="" />
                <span>{post.comments}</span>
              </Stat>
            </Stats>
          </BadgeRow>

          <TitleGroup>
            <Title>{post.title}</Title>
            <WantText>구함 : {post.want}</WantText>
          </TitleGroup>
        </TopGroup>

        <MetaList>
          <MetaText>{post.date}</MetaText>
          <MetaRow>
            <dt>교환 장소 :</dt>
            <dd>{post.place}</dd>
          </MetaRow>
          <MetaRow>
            <dt>교환 시간 :</dt>
            <dd>{post.time}</dd>
          </MetaRow>
        </MetaList>
      </InfoSection>

      <AuthorSection>
        <AuthorCard>
          <AuthorRow>
            <Profile src={author.profileImage || defaultProfile} alt="" />
            <Nickname>{author.nickname}</Nickname>
            {author.rating != null && (
              <Rating>
                <img src={starIcon} alt="평점" />
                {Number(author.rating).toFixed(1)}
              </Rating>
            )}
          </AuthorRow>

          <Description>{post.description}</Description>
        </AuthorCard>
      </AuthorSection>

      <ButtonArea>
        {/* TODO(API): 채팅방 생성 API 연동 후 해당 채팅방으로 이동 */}
        <CommonButton
          $width={354}
          $borderRadius={10000}
          onClick={() => navigate("/chat")}
        >
          채팅하기
        </CommonButton>
      </ButtonArea>
    </>
  );
}

const PhotoArea = styled.div`
  position: relative;
`;

const Photo = styled.div`
  position: relative;
  width: 100%;
  height: 480px;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  overflow: hidden;
  background-color: #e8e8e8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* 예약 중·교환 완료: 피그마 rgba(0, 0, 0, 0.5) */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: ${({ $isDimmed }) => ($isDimmed ? 1 : 0)};
    pointer-events: none;
  }
`;

// 피그마: 사진 오른쪽 아래에서 24px
const HeartPosition = styled.div`
  position: absolute;
  right: 24px;
  bottom: 24px;
  display: flex;
`;

const InfoSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 24px;
  border-bottom: 1px solid #e3e3e3;
`;

const TopGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 피그마: 폭 65px 양 끝 배치 (ExchangeCard와 같은 방식)
const Stats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 65px;
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

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: 24px;
  font-weight: 600;
  line-height: normal;
  word-break: keep-all;
`;

const WantText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
`;

const MetaList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0 4px;
`;

const metaTextStyle = `
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
`;

const MetaText = styled.p`
  ${metaTextStyle}
  color: ${({ theme }) => theme.colors.gray[700]};
`;

// 라벨은 고정, 값이 길면 값 쪽만 줄바꿈 (PopupDetailPage InfoRow와 같은 방식)
const MetaRow = styled.div`
  display: flex;
  gap: 12px;

  dt,
  dd {
    ${metaTextStyle}
    color: ${({ theme }) => theme.colors.gray[700]};
  }

  dt {
    flex-shrink: 0;
  }

  dd {
    flex: 1;
    min-width: 0;
  }
`;

const AuthorSection = styled.section`
  padding: 20px;
`;

const AuthorCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 16px 24px;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  background-color: #fafafa;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e3e3e3;
`;

const Profile = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const Nickname = styled.span`
  color: ${({ theme }) => theme.colors.gray[900]};
  ${({ theme }) => theme.typography.h5SemiBold}
`;

const Rating = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${({ theme }) => theme.colors.gray[900]};
  ${({ theme }) => theme.typography.h5SemiBold}

  img {
    width: 20px;
    height: 20px;
  }
`;

const Description = styled.p`
  margin: 0;
  color: #000;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  white-space: pre-wrap;
`;

// 피그마 330:14159: 위아래 32, 좌우 24
const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px 24px;
`;

const EmptyText = styled.p`
  margin: 0;
  padding: 80px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[700]};
  ${({ theme }) => theme.typography.body3};
`;
