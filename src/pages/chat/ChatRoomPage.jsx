import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Header from "../../components/header/Header";
import ModalBase from "../../components/modal/ModalBase";
import CommonButton from "../../components/button/CommonButton";

import { exchangePosts } from "../../data/exchangeDummyData";
import defaultProfile from "../../assets/images/profile/default-profile.jpg";
import cameraIcon from "../../assets/images/icon/camera-gray.svg";
import starEmpty from "../../assets/images/icon/star-empty.svg";
import starFilled from "../../assets/images/icon/star.svg";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "other",
    text: "안녕하세요, 아무 캔뱃지랑 교환하고 싶어요.",
    time: "오후 7시 48분",
  },
  {
    id: 2,
    sender: "me",
    text: "네 좋아요, 언제 바꾸실래요?",
    time: "오후 7시 48분",
  },
  {
    id: 3,
    sender: "other",
    text: "지금 당장 원합니다.",
    time: "오후 7시 48분",
  },
  {
    id: 4,
    sender: "me",
    text: "헐 좋아요. 그럼 약속 확정해 드릴게요!!!!!",
    time: "오후 7시 48분",
  },
];

export default function ChatRoomPage() {
  const { chatId } = useParams();

  // TODO(API): 실제 채팅방 조회 API로 교체
  // demo-{postId}는 프론트 UI 시연용 임시 경로
  const postId = chatId?.startsWith("demo-")
    ? Number(chatId.replace("demo-", ""))
    : 3;

  const post = exchangePosts.find((item) => item.id === postId);

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [message, setMessage] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [isReviewed, setIsReviewed] = useState(false);

  if (!post) {
    return (
      <>
        <Header variant="back" />
        <EmptyText>채팅방을 찾을 수 없어요.</EmptyText>
      </>
    );
  }

  const user = post.author;

  const handleSend = (event) => {
    event.preventDefault();

    const text = message.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "me",
        text,
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "numeric",
          minute: "2-digit",
        }),
      },
    ]);

    setMessage("");
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    setIsConfirmOpen(false);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsReviewOpen(true);
  };

  const handleReview = () => {
    if (rating === 0) return;

    setIsReviewed(true);
    setIsReviewOpen(false);
  };

  return (
    <>
      <Header variant="chat" user={user} />

      <Page>
        <ProductCard>
          <ProductImage src={post.images?.[0]} alt={post.title} />

          <ProductInfo>
            <ProductTitle>{post.title}</ProductTitle>
            <WantText>구함 : {post.want}</WantText>
            <MetaText>교환 장소 : {post.place}</MetaText>
            <MetaText>교환 시간 : {post.time}</MetaText>

            <StatusButton
              type="button"
              disabled={isReviewed}
              onClick={() => {
                if (!isConfirmed) {
                  setIsConfirmOpen(true);
                } else if (!isCompleted) {
                  handleComplete();
                } else {
                  setIsReviewOpen(true);
                }
              }}
            >
              {!isConfirmed
                ? "교환 확정하기"
                : !isCompleted
                  ? "교환 완료"
                  : isReviewed
                    ? "교환 완료됨"
                    : "후기 작성"}
            </StatusButton>
          </ProductInfo>
        </ProductCard>

        <MessageArea data-message-area>
          {messages.map((item) => (
            <ChatMessage key={item.id} item={item} user={user} />
          ))}
        </MessageArea>

        <InputArea onSubmit={handleSend}>
          <InputBox>
            <CameraButton
              type="button"
              aria-label="사진 첨부"
              onClick={() => {
                // TODO: 이미지 첨부 API 연결
              }}
            >
              <img src={cameraIcon} alt="" />
            </CameraButton>

            <MessageInput
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="교환을 제시해주세요"
              aria-label="메시지 입력"
            />

            {message.trim() ? (
              <SendButton type="submit">전송</SendButton>
            ) : (
              <CameraButton
                type="button"
                aria-label="사진 첨부"
                onClick={() => {
                  // TODO: 이미지 첨부 API 연결
                }}
              >
                <img src={cameraIcon} alt="" />
              </CameraButton>
            )}
          </InputBox>
        </InputArea>
      </Page>

      <ModalBase
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        $width={330}
      >
        <ModalContent>
          <ModalTitle>교환 확정</ModalTitle>

          <ModalLabel>교환 상대</ModalLabel>
          <ModalValue>{user.nickname}</ModalValue>

          <ModalLabel>교환 장소</ModalLabel>
          <ModalValue>{post.place}</ModalValue>

          <ModalDivider />

          <CommonButton
            $width={280}
            $height={48}
            $fontSize={16}
            onClick={handleConfirm}
          >
            교환 확정
          </CommonButton>
        </ModalContent>
      </ModalBase>

      <ModalBase
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        $width={330}
      >
        <ReviewContent>
          <ReviewTitle>교환 후기</ReviewTitle>
          <ReviewDescription>교환이 만족스러우셨나요?</ReviewDescription>

          <ReviewNickname>{user.nickname}</ReviewNickname>

          <StarRow>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarButton
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`${star}점`}
                aria-pressed={rating === star}
              >
                <img src={star <= rating ? starFilled : starEmpty} alt="" />
              </StarButton>
            ))}
          </StarRow>

          <CommonButton
            $width={280}
            $height={48}
            $fontSize={16}
            onClick={handleReview}
          >
            후기 완료
          </CommonButton>
        </ReviewContent>
      </ModalBase>
    </>
  );
}

function ChatMessage({ item, user }) {
  const isMine = item.sender === "me";
  const bubbleRef = useRef(null);
  const [isLong, setIsLong] = useState(false);

  useEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble) return;

    const checkWidth = () => {
      const bubbleWidth = bubble.scrollWidth;
      const containerWidth = bubble.closest("[data-message-area]")?.clientWidth;

      if (containerWidth) {
        setIsLong(bubbleWidth > containerWidth * 0.6);
      }
    };

    checkWidth();

    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, [item.text]);

  return (
    <MessageRow $isMine={isMine}>
      {!isMine && (
        <MessageProfile src={user.profileImage || defaultProfile} alt="" />
      )}

      <MessageContent $isMine={isMine} $isLong={isLong}>
        <Bubble ref={bubbleRef} $isMine={isMine}>
          {item.text}
        </Bubble>

        <MessageTime $isMine={isMine} $isLong={isLong}>
          {item.time}
        </MessageTime>
      </MessageContent>
    </MessageRow>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 72px);
  background: #fff;
`;

const ProductCard = styled.section`
  display: flex;
  gap: 16px;
  margin: 16px 10px;
  padding: 16px;
  border: 1px solid #ff006a;
  border-radius: 12px;
`;

const ProductImage = styled.img`
  width: 72px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 12px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
`;

const ProductTitle = styled.p`
  margin: 0;
  color: #141414;
  font-size: 16px;
  font-weight: 600;
`;

const WantText = styled.p`
  margin: 0 0 12px;
  color: #ff006a;
  font-size: 12px;
  font-weight: 400;
`;

const MetaText = styled.p`
  margin: 0;
  color: #727272;
  font-size: 12px;
  font-weight: 400;
  gap: 4px;
`;

const StatusButton = styled.button`
  width: 100%;
  height: 24px;
  margin-top: 12px;
  border: 1px solid #e3e3e3;
  border-radius: 10000px;
  background: #141414;
  color: #fafafa;
  font-size: 12px;
  cursor: pointer;

  &:disabled {
    background: #727272;
    cursor: default;
  }
`;

const MessageArea = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
  padding: 8px 16px;
`;

const MessageRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: ${({ $isMine }) => ($isMine ? "flex-end" : "flex-start")};
  gap: 4px;
`;

const MessageProfile = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: ${({ $isLong, $isMine }) =>
    $isLong ? "column" : $isMine ? "row-reverse" : "row"};

  align-items: ${({ $isLong, $isMine }) =>
    $isLong ? ($isMine ? "flex-end" : "flex-start") : "flex-end"};

  gap: ${({ $isLong }) => ($isLong ? "4px" : "4px")};
  max-width: 85%;
`;

const Bubble = styled.div`
  width: fit-content;
  max-width: 100%;
  padding: 10px 16px;
  border: 1px solid #ffcce1;
  border-radius: 12px;
  background: ${({ $isMine }) => ($isMine ? "#ffe5f0" : "#ff66a6")};
  color: #141414;
  font-size: 14px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
`;

const MessageTime = styled.span`
  flex-shrink: 0;
  color: #727272;
  font-size: 10px;
  white-space: nowrap;

  /* 긴 메시지: 말풍선 끝에서 안쪽으로 6px */
  ${({ $isLong, $isMine }) =>
    $isLong &&
    `
      margin-right: ${$isMine ? "6px" : "0"};
      margin-left: ${$isMine ? "0" : "6px"};
    `}

  /* 짧은 메시지: 기존 위치에서 2px 위로 */
  transform: ${({ $isLong }) => ($isLong ? "none" : "translateY(-2px)")};
`;

const InputArea = styled.form`
  position: sticky;
  bottom: 0;
  padding: 12px 20px;
  background: #fff;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 8px 20px;
  border: 1px solid #e3e3e3;
  border-radius: 10000px;
  background: #f6f6f6;
`;

const CameraButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #141414;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;

  &::placeholder {
    color: #727272;
  }
`;

const SendButton = styled.button`
  border: none;
  background: transparent;
  color: #ff006a;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 4px;
`;

const ModalTitle = styled.h2`
  margin: 0 4px 24px;
  color: #141414;
  font-size: 20px;
  font-weight: 600;
`;

const ModalLabel = styled.span`
  margin: 0 4px 8px;
  color: #727272;
  font-size: 14px;
  font-weight: 500;
`;

const ModalValue = styled.p`
  margin: 0 4px 24px;
  color: #141414;
  font-size: 15px;
  font-weight: 500;
`;

const ModalDivider = styled.div`
  height: 0;
  margin-bottom: 32px;
  border-top: 1px solid #e3e3e3;
`;

const EmptyText = styled.p`
  padding: 60px 20px;
  text-align: center;
  color: #727272;
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 4px;
`;

const ReviewTitle = styled.h2`
  align-self: flex-start;
  margin: 0 4px 4px;
  color: #141414;
  font-size: 20px;
  font-weight: 600;
`;

const ReviewDescription = styled.p`
  margin: 0 4px 24px;
  color: #727272;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
`;

const ReviewNickname = styled.p`
  margin: 0 4px 6px;
  color: #141414;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
`;

const StarRow = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0px;
  margin-bottom: 32px;
`;

const StarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  img {
    width: 32px;
    height: 32px;
  }
`;
