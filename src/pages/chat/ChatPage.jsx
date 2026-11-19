import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { getChatRooms } from "../../api/chatApi";
import { toImageUrl } from "../../api/client";

import Header from "../../components/header/Header";
import TopBar from "../../components/bar/TopBar";
import defaultProfile from "../../assets/images/profile/default-profile.jpg";
const CHAT_TABS = [
  { label: "전체", value: "all" },
  { label: "내 약속", value: "appointment" },
];

export default function ChatPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadChatRooms = async () => {
      try {
        const data = await getChatRooms({
          page: 0,
          size: 20,
        });

        console.log("💬 채팅방 목록:", data);

        if (active) {
          setChats(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        console.error("채팅방 목록 조회 실패:", err);

        if (active) {
          setError("채팅방 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadChatRooms();

    return () => {
      active = false;
    };
  }, []);

  // 내 약속 탭은 약속 API 연결 시 필터링
  const filteredChats = activeTab === "all" ? chats : [];

  return (
    <>
      <Header variant="main" />

      <TabWrapper>
        <TopBar
          tabs={CHAT_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </TabWrapper>

      <Container>
        <ChatList>
          {isLoading ? (
            <ListMessage>채팅방을 불러오는 중입니다.</ListMessage>
          ) : error ? (
            <ListMessage>{error}</ListMessage>
          ) : filteredChats.length === 0 ? (
            <ListMessage>
              {activeTab === "appointment"
                ? "내 약속 채팅방이 없습니다."
                : "아직 채팅방이 없습니다."}
            </ListMessage>
          ) : (
            filteredChats.map((chat) => (
              <ChatItem
                key={chat.roomId}
                type="button"
                onClick={() => navigate(`/chat/${chat.roomId}`)}
              >
                <ProfileImage
                  src={
                    toImageUrl(chat.opponent?.profileImageUrl) || defaultProfile
                  }
                  alt=""
                />

                <ChatInfo>
                  <NicknameRow>
                    <Nickname>
                      {chat.opponent?.username ?? "알 수 없는 사용자"}
                    </Nickname>
                  </NicknameRow>

                  <LastMessage>
                    {chat.lastMessage ?? "아직 메시지가 없습니다."}
                  </LastMessage>
                </ChatInfo>

                <ChatMeta>
                  <Time>
                    {chat.lastMessageAt
                      ? new Date(chat.lastMessageAt).toLocaleTimeString(
                          "ko-KR",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )
                      : ""}
                  </Time>
                </ChatMeta>
              </ChatItem>
            ))
          )}
        </ChatList>
      </Container>
    </>
  );
}

const TabWrapper = styled.div`
  border-bottom: 1px solid #e3e3e3;
`;

const Container = styled.main`
  padding: 0;
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChatItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 16px 20px;
  border: none;
  border-bottom: 1px solid #e3e3e3;

  background-color: #ffffff;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NicknameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Nickname = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #141414;
`;

// eslint-disable-next-line no-unused-vars
const UnreadDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ff006a;
  flex-shrink: 0;
  margin: 0 0 6px;
`;

const LastMessage = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #141414;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatMeta = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  align-self: flex-end;
`;

const Time = styled.span`
  font-size: 12px;
  color: #727272;
  white-space: nowrap;
`;

const ListMessage = styled.p`
  padding: 40px 20px;
  text-align: center;
  color: #727272;
  font-size: 14px;
`;
