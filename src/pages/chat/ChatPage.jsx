import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Header from "../../components/header/Header";
import TopBar from "../../components/bar/TopBar";
import { chats } from "../../data/chatDummyData";
import defaultProfile from "../../assets/images/profile/default-profile.jpg";

const CHAT_TABS = [
  { label: "전체", value: "all" },
  { label: "내 약속", value: "appointment" },
];

export default function ChatPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const filteredChats =
    activeTab === "all"
      ? chats
      : chats.filter((chat) => chat.exchangeStatus === "scheduled");

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
          {filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              type="button"
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <ProfileImage src={chat.profileImage || defaultProfile} alt="" />

              <ChatInfo>
                <NicknameRow>
                  <Nickname>{chat.nickname}</Nickname>

                  {chat.unreadCount > 0 && (
                    <UnreadDot aria-label="읽지 않은 메시지 있음" />
                  )}
                </NicknameRow>

                <LastMessage>{chat.lastMessage}</LastMessage>
              </ChatInfo>

              <ChatMeta>
                <Time>{chat.lastMessageTime}</Time>
              </ChatMeta>
            </ChatItem>
          ))}
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
