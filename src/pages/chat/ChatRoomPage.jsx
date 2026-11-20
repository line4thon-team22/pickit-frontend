import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { getChatRoomDetail, getChatMessages } from "../../api/chatApi";
import { toImageUrl } from "../../api/client";
import {
  connectChatSocket,
  sendChatMessage,
  disconnectChatSocket,
} from "../../api/chatSocket";
import {
  confirmAppointment,
  completeAppointment,
  createAppointmentReview,
} from "../../api/appointmentApi";

import Header from "../../components/header/Header";
import ModalBase from "../../components/modal/ModalBase";
import CommonButton from "../../components/button/CommonButton";

import defaultProfile from "../../assets/images/profile/default-profile.jpg";
import cameraIcon from "../../assets/images/icon/camera-gray.svg";
import starEmpty from "../../assets/images/icon/star-empty.svg";
import starFilled from "../../assets/images/icon/star.svg";

// 서버 메시지를 기존 UI 형식으로 변환
const formatChatMessage = (item, opponentId) => ({
  id: item.messageId,
  sender: Number(item.senderId) === Number(opponentId) ? "other" : "me",
  text:
    item.messageType === "IMAGE"
      ? "[사진]"
      : item.messageType === "APPOINTMENT"
        ? item.content || "교환 약속이 확정되었습니다."
        : item.content || "",
  time: item.createdAt
    ? new Date(item.createdAt).toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "",
});

export default function ChatRoomPage() {
  const { chatId } = useParams();

  const socketRef = useRef(null);
  const messageAreaRef = useRef(null);

  // 채팅방 상세 정보
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 메시지
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const isConfirmed = Boolean(room?.appointment?.appointmentId);
  const isCompleted = Boolean(room?.appointment?.completedAt);
  const isReviewed = Boolean(room?.appointment?.reviewed);
  // 상대가 글쓴이가 아니면 내가 글쓴이 (교환 확정은 글쓴이만, 서버는 막지 않음)
  const isWriter =
    room?.post?.userId != null &&
    Number(room.post.userId) !== Number(room.opponent?.userId);

  // 교환 진행 (추후 API 연동)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);

  // 1. 채팅방 상세 조회
  useEffect(() => {
    let active = true;

    const loadRoom = async () => {
      setIsLoading(true);
      setError("");
      setRoom(null);

      try {
        const data = await getChatRoomDetail(chatId);

        if (active) {
          setRoom(data);
          console.log("💬 채팅방 상세:", data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "채팅방을 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadRoom();

    return () => {
      active = false;
    };
  }, [chatId]);

  // 2. 이전 메시지 조회 + WebSocket 연결
  useEffect(() => {
    if (!room?.roomId) return;

    let active = true;
    let socket = null;

    const opponentId = room.opponent?.userId;

    const addMessage = (data) => {
      if (!active) return;

      const formatted = formatChatMessage(data, opponentId);

      setMessages((prev) => {
        // 서버에서 같은 메시지가 중복 도착하는 경우 방지
        if (prev.some((item) => item.id === formatted.id)) {
          return prev;
        }

        return [...prev, formatted].sort((a, b) => Number(a.id) - Number(b.id));
      });
    };

    // 소켓을 먼저 연결하고 메시지 조회
    // 조회 중 도착한 새 메시지도 ID로 중복 제거
    socket = connectChatSocket({
      roomId: room.roomId,

      onMessage: addMessage,

      onConnect: () => {
        if (active) setIsConnected(true);
      },

      onDisconnect: () => {
        if (active) setIsConnected(false);
      },

      onError: (err) => {
        if (!active) return;

        console.error("채팅 소켓 오류:", err);
      },
    });

    socketRef.current = socket;

    const loadMessages = async () => {
      try {
        const data = await getChatMessages(room.roomId, {
          size: 30,
        });

        if (!active) return;

        const history = (data.messages ?? []).map((item) =>
          formatChatMessage(item, opponentId),
        );

        setMessages((prev) => {
          const merged = new Map();

          [...history, ...prev].forEach((item) => {
            merged.set(item.id, item);
          });

          return [...merged.values()].sort(
            (a, b) => Number(a.id) - Number(b.id),
          );
        });

        console.log("💬 이전 메시지:", data);
      } catch (err) {
        if (active) {
          console.error("메시지 조회 실패:", err);
        }
      }
    };

    loadMessages();

    return () => {
      active = false;

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      disconnectChatSocket(socket);
    };
  }, [room]);

  // 3. 새 메시지가 추가되면 아래로 스크롤
  useEffect(() => {
    if (!messageAreaRef.current) return;

    messageAreaRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // 기존 UI에 맞게 데이터 변환
  const post = room?.post
    ? {
        id: room.post.postId,
        title: room.post.haveItemName,
        want: room.post.wantItemName,
        images: (room.post.images ?? []).map(toImageUrl),
        place: room.post.preferredLocation || "채팅으로 협의해요 :)",
        time: room.post.preferredTime || "채팅으로 협의해요 :)",
      }
    : null;

  const user = room?.opponent
    ? {
        nickname: room.opponent.username || "알 수 없는 사용자",
        profileImage: toImageUrl(room.opponent.profileImageUrl),
        rating: room.opponent.mannerScore,
      }
    : null;

  // 4. 실시간 메시지 전송
  const handleSend = (event) => {
    event.preventDefault();

    const text = message.trim();

    if (!text || !room) return;

    const sent = sendChatMessage(socketRef.current, room.roomId, text);

    if (!sent) {
      alert("채팅 서버에 연결 중이에요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    // 메시지는 서버에서 다시 전달받을 때 화면에 추가
    setMessage("");
  };

  const handleConfirm = async () => {
    if (!room?.roomId) return;

    try {
      await confirmAppointment(room.roomId, post.place);

      const updatedRoom = await getChatRoomDetail(room.roomId);
      setRoom(updatedRoom);

      setIsConfirmOpen(false);
    } catch (err) {
      console.error("교환 확정 실패:", err);
      alert(err.message || "교환 확정에 실패했습니다.");
    }
  };

  const handleComplete = async () => {
    const appointmentId = room?.appointment?.appointmentId;

    if (!appointmentId) {
      alert("확정된 교환 약속을 찾을 수 없습니다.");
      return;
    }

    try {
      await completeAppointment(appointmentId);
    } catch (err) {
      // 409: 상대가 먼저 완료함 → 그대로 후기 작성으로 진행
      if (err.status !== 409) {
        alert(err.message || "교환 완료 처리에 실패했습니다.");
        return;
      }
    }

    try {
      const updatedRoom = await getChatRoomDetail(room.roomId);
      setRoom(updatedRoom);
    } catch (err) {
      console.error("채팅방 다시 조회 실패:", err);
    }

    setIsReviewOpen(true);
  };

  const handleReview = async () => {
    if (rating === 0) return;

    const appointmentId = room?.appointment?.appointmentId;
    if (!appointmentId) return;

    try {
      await createAppointmentReview(appointmentId, rating);

      const updatedRoom = await getChatRoomDetail(room.roomId);
      setRoom(updatedRoom);

      setIsReviewOpen(false);
    } catch (err) {
      alert(err.message || "후기 작성에 실패했습니다.");
    }
  };

  if (isLoading || error || !post || !user) {
    return (
      <>
        <Header variant="back" />
        <EmptyText>
          {isLoading
            ? "채팅방을 불러오는 중이에요."
            : error || "채팅방을 찾을 수 없어요."}
        </EmptyText>
      </>
    );
  }

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

            {/* 교환 확정: 글쓴이만 / 교환 완료·후기 작성: 둘 다 */}
            <StatusButton
              type="button"
              disabled={isReviewed || (!isConfirmed && !isWriter)}
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
                ? isWriter
                  ? "교환 확정하기"
                  : "상대방의 교환 확정을 기다리고 있어요"
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

          <div ref={messageAreaRef} />
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
              placeholder={
                isConnected ? "교환을 제시해주세요" : "채팅 서버 연결 중..."
              }
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
