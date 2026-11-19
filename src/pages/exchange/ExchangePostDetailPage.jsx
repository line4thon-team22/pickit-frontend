import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/header/Header";
import StatusBadge from "../../components/badge/StatusBadge";
import ToggleIconButton from "../../components/button/ToggleIconButton";
import CommonButton from "../../components/button/CommonButton";
import ImageSlider from "../../components/area/ImageSlider";
import heartLineIcon from "../../assets/images/icon/heart-white-line-large.svg";
import heartFilledIcon from "../../assets/images/icon/heart-pink-large.svg";
import heartGrayIcon from "../../assets/images/icon/heart-gray.svg";
import chatGrayIcon from "../../assets/images/icon/chat-gray.svg";
import starIcon from "../../assets/images/icon/star.svg";
import defaultProfile from "../../assets/images/profile/default-profile.jpg";

import useApi from "../../hooks/useApi";
import { getPostDetail } from "../../api/exchangeApi";
import { getExchangeBadge, isTradeClosed } from "./exchangeUtils";
import RequestStateView from "./RequestStateView";

// 교환글 상세 (피그마 기본 293:12527, 찜 334:14220, 교환 완료 439:21567)
// - 사진 여러 장: 좌우로 넘기는 슬라이드 (ImageSlider)
// - 예약 중·교환 완료: 사진 어둡게
// - 찜 하트: 교환 가능·예약 중은 표시, 교환 완료는 이미 찜한 사람에게만 표시(해제용)
// - 상세 조회는 로그인 없이 가능. 토큰이 만료·잘못되면 401 → 로그인 안내
export default function ExchangePostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const {
    data: post,
    isLoading,
    error,
    refetch,
  } = useApi(() => getPostDetail(postId), [postId]);

  // 불러오는 중 / 없는 글 / 로그인 필요 / 그 밖의 에러
  const renderState = () => {
    if (isLoading) return <RequestStateView message="불러오는 중이에요" />;

    if (error?.status === 404 || (!error && !post)) {
      return <RequestStateView message="존재하지 않는 교환글이에요" />;
    }

    if (error?.status === 401) {
      return (
        <RequestStateView message="로그인이 필요한 서비스예요" action="login" />
      );
    }

    return (
      <RequestStateView
        message={error.message}
        action="retry"
        onRetry={refetch}
      />
    );
  };

  if (isLoading || error || !post) {
    return (
      <>
        <Header variant="back" />
        {renderState()}
      </>
    );
  }

  const badge = getExchangeBadge(post);

  // 찜 하트 표시 규칙
  // 예약 중: 예약이 취소되면 다시 교환 가능해지므로 찜 유지
  // 교환 완료: 새로 찜할 이유가 없어 숨김 (피그마 439:21571), 단 이미 찜한 사람은 해제할 수 있게 표시
  // 서버에서 받은 찜 여부 기준이라, 해제해도 하트는 흰 테두리로 남아 다시 누를 수 있음
  const showLikeButton = post.tradeStatus !== "completed" || post.isLiked;

  const { author } = post;

  return (
    <>
      <Header variant="back" />

      <PhotoArea>
        {/* 사진 여러 장이면 좌우로 넘기기 + 인디케이터 */}
        <ImageSlider
          images={post.images}
          alt={post.title}
          isDimmed={isTradeClosed(post)}
        />

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

            {/* 찜 수·채팅 수는 서버 값 그대로 표시 (피그마에서도 찜 토글 시 숫자 그대로) */}
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
