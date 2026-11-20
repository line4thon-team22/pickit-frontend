import { Client } from "@stomp/stompjs";
import { API_BASE_URL, getAccessToken } from "./client";

const WS_URL = `${API_BASE_URL.replace(/^http/, "ws").replace(/\/$/, "")}/ws/chat`;

export const connectChatSocket = ({
  roomId,
  onMessage,
  onError,
  onConnect,
  onDisconnect,
}) => {
  const client = new Client({
    brokerURL: WS_URL,

    connectHeaders: {
      Authorization: `Bearer ${getAccessToken() || ""}`,
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    onConnect: () => {
      console.log("💬 WebSocket 연결 성공");

      client.subscribe(`/sub/chat-rooms/${roomId}`, (frame) => {
        try {
          const data = JSON.parse(frame.body);
          onMessage?.(data);
        } catch (error) {
          console.error("채팅 메시지 파싱 오류:", error);
        }
      });

      client.subscribe("/user/queue/errors", (frame) => {
        try {
          const error = JSON.parse(frame.body);
          console.error("채팅 서버 오류:", error);
          onError?.(error);
        } catch {
          onError?.({
            message: "채팅 처리 중 오류가 발생했습니다.",
          });
        }
      });

      onConnect?.();
    },

    onStompError: (frame) => {
      console.error("STOMP 오류:", frame);
      onError?.({
        message: frame.headers.message || "채팅 서버 연결에 실패했습니다.",
      });
    },

    onWebSocketError: (error) => {
      console.error("WebSocket 오류:", error);
      onError?.({
        message: "WebSocket 연결에 실패했습니다.",
      });
    },

    onDisconnect: () => {
      onDisconnect?.();
    },
  });

  client.activate();

  return client;
};

export const sendChatMessage = (client, roomId, content) => {
  if (!client?.connected) {
    return false;
  }

  client.publish({
    destination: `/pub/chat-rooms/${roomId}`,
    body: JSON.stringify({
      messageType: "TEXT",
      content,
      imageUrl: null,
    }),
  });

  return true;
};

export const disconnectChatSocket = (client) => {
  if (client) {
    return client.deactivate();
  }

  return Promise.resolve();
};
